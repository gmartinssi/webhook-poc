# Webhook POC Project - Continuation Prompt for WebSocket Implementation

## Project Context

I have a full-stack webhook POC application located at `/home/gmartinssi/webhook-poc` (or `\\wsl.localhost\Ubuntu-24.04\home\gmartinssi\webhook-poc` on Windows WSL). The project is already functional and pushed to GitHub at https://github.com/gmartinssi/webhook-poc

### Current Architecture

```
webhook-poc/
├── src/                      # Spring Boot backend (Java 21)
├── frontend/                 # React + Vite frontend
├── webhook-receiver-ui/      # Webhook monitoring dashboard
│   ├── server/              # Node.js + Socket.IO server
│   └── client/              # React dashboard
├── pom.xml                  # Maven configuration
└── README.md
```

### Existing Components

#### Backend (Spring Boot - Port 8080)
- **Entities**: Article, WebhookSubscription
- **Controllers**: ArticleController, WebhookController
- **Services**: ArticleService, WebhookService, WebhookSubscriptionService
- **Database**: H2 in-memory
- **Features**: 
  - Article CRUD operations
  - Webhook subscriptions per user
  - Async webhook delivery using WebClient
  - CORS configured for frontend

#### Frontend (React + Vite - Port 5173/5174)
- **Components**: ArticleList, ArticleForm, WebhookSettings, Tabs
- **Features**:
  - User-based article management
  - Webhook URL configuration
  - Real-time feedback
  - Tailwind CSS styling

#### Webhook Receiver UI (Port 3000 + 3001)
- **Server**: Express + Socket.IO for real-time webhook display
- **Client**: React dashboard with statistics and filtering
- **Features**: Real-time updates, export, notifications

### Current REST API Endpoints

```
POST   /api/articles           - Create article
GET    /api/articles/user/{id} - Get user's articles  
PUT    /api/articles/{id}      - Update article
DELETE /api/articles/{id}      - Delete article
POST   /api/webhooks/subscribe - Subscribe webhook
```

## New Requirement: Add WebSocket Support to Spring Boot Backend

### Objective
Enhance the Spring Boot backend to include WebSocket support so that the main frontend can receive real-time notifications when articles are created, updated, or deleted, without needing to poll the API.

### Technical Requirements

1. **WebSocket Configuration**
   - Add Spring WebSocket dependency to pom.xml
   - Configure STOMP protocol over WebSocket
   - Enable SockJS fallback for browser compatibility
   - Set up message broker (in-memory for this POC)

2. **WebSocket Endpoints**
   - `/ws` - Main WebSocket connection endpoint
   - STOMP destinations:
     - `/topic/articles/{userId}` - User-specific article updates
     - `/topic/articles/all` - All article updates (admin view)
     - `/app/subscribe/{userId}` - Subscribe to user updates

3. **Message Types**
   ```java
   ArticleEventMessage {
     String eventType;  // CREATED, UPDATED, DELETED
     Long userId;
     Article article;
     String timestamp;
   }
   ```

4. **Service Integration**
   - Modify ArticleService to broadcast WebSocket messages
   - Send notifications on:
     - Article creation
     - Article updates
     - Article deletion
   - Ensure both webhook AND WebSocket notifications work

5. **Frontend Updates**
   - Add SockJS and STOMP client libraries
   - Create WebSocket service for connection management
   - Update ArticleList component to receive real-time updates
   - Add connection status indicator
   - Show "real-time" badge when connected

### Implementation Steps

1. **Backend WebSocket Setup**:
   ```java
   // Add to pom.xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-websocket</artifactId>
   </dependency>
   ```

2. **Create WebSocket Configuration**:
   - WebSocketConfig class with STOMP configuration
   - Configure message broker
   - Set allowed origins

3. **Create WebSocket Controller**:
   - Handle subscription requests
   - Manage connected users

4. **Update ArticleService**:
   - Inject SimpMessagingTemplate
   - Send messages on article events
   - Maintain backward compatibility with webhooks

5. **Frontend WebSocket Integration**:
   ```javascript
   // Install packages
   npm install sockjs-client @stomp/stompjs
   
   // Create WebSocket service
   // Connect to /ws endpoint
   // Subscribe to /topic/articles/{userId}
   // Update UI on message receipt
   ```

### Expected Behavior

1. When a user creates/updates/deletes an article:
   - Webhook is sent (existing behavior)
   - WebSocket message is broadcast to subscribed clients
   - Frontend updates in real-time without refresh

2. Connection management:
   - Auto-reconnect on disconnect
   - Show connection status
   - Fallback to polling if WebSocket fails

### Testing Scenarios

1. Open multiple browser tabs with different user IDs
2. Create article in one tab, see it appear in others
3. Test connection recovery (stop/start backend)
4. Verify both webhook and WebSocket work simultaneously

### File Structure to Add/Modify

```
Backend:
├── src/main/java/com/example/webhookpoc/
│   ├── config/
│   │   └── WebSocketConfig.java (NEW)
│   ├── controller/
│   │   └── WebSocketController.java (NEW)
│   ├── dto/
│   │   └── ArticleEventMessage.java (NEW)
│   └── service/
│       └── ArticleService.java (MODIFY)

Frontend:
├── frontend/src/
│   ├── services/
│   │   └── websocket.js (NEW)
│   ├── components/
│   │   └── ConnectionStatus.jsx (NEW)
│   └── App.jsx (MODIFY)
```

### Success Criteria

- [ ] WebSocket connection established from frontend to backend
- [ ] Real-time article updates work for specific users
- [ ] Connection status shown in UI
- [ ] Auto-reconnection works
- [ ] Both webhooks and WebSockets work simultaneously
- [ ] No breaking changes to existing functionality
- [ ] Can handle multiple concurrent connections
- [ ] Graceful degradation if WebSocket unavailable

### Additional Context

- The project uses Java 21 and Spring Boot 3.3.0
- Frontend uses React 18 with Vite
- CORS is already configured for http://localhost:5173
- Authentication is not required (POC uses simple user IDs)
- Keep the implementation simple but production-ready in structure

### Commands to Run Project

```bash
# Backend
cd ~/webhook-poc
mvn spring-boot:run

# Frontend  
cd ~/webhook-poc/frontend
npm install
npm run dev

# Webhook Receiver (optional)
cd ~/webhook-poc/webhook-receiver-ui/server
npm start

cd ~/webhook-poc/webhook-receiver-ui/client
npm run dev
```

Please implement WebSocket support in the Spring Boot backend and update the React frontend to use real-time updates via WebSocket while maintaining all existing functionality.
