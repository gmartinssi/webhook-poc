# Webhook POC - Full Stack Application

## Overview
A complete full-stack application demonstrating webhook functionality for an Article Management System. The project consists of:
- **Backend**: Spring Boot REST API with webhook notifications
- **Frontend**: React + Vite SPA with Tailwind CSS
- **Features**: Article CRUD operations with automatic webhook triggers for create, update, and delete events

## Features
- Article CRUD operations
- Webhook subscription management
- Automatic webhook notifications on article events
- H2 in-memory database with web console
- RESTful API endpoints

## Prerequisites
- Java 21+
- Maven 3.6+
- Node.js 18+
- npm 9+

## Running the Application

### Backend (Spring Boot)

1. **Navigate to the project directory:**
```bash
cd /home/gmartinssi/webhook-poc
```

2. **Build the project:**
```bash
mvn clean install
```

3. **Run the backend:**
```bash
mvn spring-boot:run
```

The backend will start on port 8080.

### Frontend (React + Vite)

1. **Navigate to the frontend directory:**
```bash
cd /home/gmartinssi/webhook-poc/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the frontend:**
```bash
npm run dev
```

The frontend will start on port 5173.

### Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console

## H2 Database Console
Access the H2 database console at: http://localhost:8080/h2-console

**Connection details:**
- JDBC URL: `jdbc:h2:mem:articledb`
- Username: `sa`
- Password: `password`

## API Endpoints

### Article Endpoints

#### Create Article
```bash
POST /api/articles
Content-Type: application/json

{
  "title": "Sample Article",
  "content": "This is the article content",
  "userId": 1
}
```

#### Update Article
```bash
PUT /api/articles/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "userId": 1
}
```

#### Delete Article
```bash
DELETE /api/articles/{id}?userId=1
```

#### Get Articles by User
```bash
GET /api/articles/user/{userId}
```

#### Get Article by ID
```bash
GET /api/articles/{id}
```

### Webhook Endpoints

#### Subscribe/Update Webhook
```bash
POST /api/webhooks/subscribe
Content-Type: application/json

{
  "userId": 1,
  "webhookUrl": "http://localhost:3000/webhook"
}
```

## Testing with cURL

### 1. Subscribe a webhook for user 1:
```bash
curl -X POST http://localhost:8080/api/webhooks/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "webhookUrl": "http://localhost:3000/webhook"
  }'
```

### 2. Create an article (will trigger ARTICLE_CREATED webhook):
```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "This is the content of my first article",
    "userId": 1
  }'
```

### 3. Update an article (will trigger ARTICLE_UPDATED webhook):
```bash
curl -X PUT http://localhost:8080/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Article Title",
    "content": "Updated content",
    "userId": 1
  }'
```

### 4. Delete an article (will trigger ARTICLE_DELETED webhook):
```bash
curl -X DELETE "http://localhost:8080/api/articles/1?userId=1"
```

### 5. Get all articles for a user:
```bash
curl http://localhost:8080/api/articles/user/1
```

## Testing Webhooks with a Mock Server

To test webhook delivery, you can use a service like webhook.site or run a local mock server:

### Using Node.js Express (create a simple webhook receiver):
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook receiver listening on port 3000');
});
```

## Webhook Payload Structure

When a webhook is triggered, it sends the following payload:

```json
{
  "eventType": "ARTICLE_CREATED | ARTICLE_UPDATED | ARTICLE_DELETED",
  "timestamp": "2024-01-10T10:15:30Z",
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "Article Content",
    "userId": 1,
    "createdAt": "2024-01-10T10:15:30Z",
    "updatedAt": "2024-01-10T10:15:30Z"
  }
}
```

## Project Structure
```
webhook-poc/
├── pom.xml                      # Maven configuration
├── README.md                    # Project documentation
├── src/                         # Backend source code
│   └── main/
│       ├── java/
│       │   └── com/example/webhookpoc/
│       │       ├── WebhookPocApplication.java
│       │       ├── config/
│       │       │   └── WebClientConfig.java
│       │       ├── controller/
│       │       │   ├── ArticleController.java
│       │       │   ├── WebhookController.java
│       │       │   └── GlobalExceptionHandler.java
│       │       ├── dto/
│       │       │   ├── ArticleDTO.java
│       │       │   ├── WebhookSubscriptionDTO.java
│       │       │   └── WebhookPayloadDTO.java
│       │       ├── entity/
│       │       │   ├── Article.java
│       │       │   └── WebhookSubscription.java
│       │       ├── repository/
│       │       │   ├── ArticleRepository.java
│       │       │   └── WebhookSubscriptionRepository.java
│       │       └── service/
│       │           ├── ArticleService.java
│       │           ├── WebhookService.java
│       │           └── WebhookSubscriptionService.java
│       └── resources/
│           └── application.properties
└── frontend/                    # Frontend React application
    ├── package.json            # Node dependencies
    ├── vite.config.js          # Vite configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── index.html              # HTML template
    └── src/
        ├── App.jsx             # Main application component
        ├── main.jsx            # Application entry point
        ├── index.css           # Global styles
        ├── components/         # React components
        │   ├── ArticleList.jsx
        │   ├── ArticleForm.jsx
        │   ├── WebhookSettings.jsx
        │   └── Tabs.jsx
        └── services/           # API services
            └── api.js
```

## Notes
- The application uses an H2 in-memory database, so data will be lost when the application stops.
- Webhooks are sent asynchronously and won't block the main request.
- Failed webhook deliveries are logged but won't affect the main operation.
- Each user can have only one webhook URL registered at a time.
