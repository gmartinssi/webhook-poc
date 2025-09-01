# Webhook Receiver UI

A real-time webhook monitoring dashboard built with Node.js, Socket.IO, React, and Vite.

## Features

- 🚀 **Real-time Updates**: Instant webhook display using WebSocket connections
- 📊 **Statistics Dashboard**: Track webhook counts, event types, and activity
- 🔍 **Search & Filter**: Find specific webhooks quickly
- 💾 **Export Data**: Download webhook history as JSON
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🔔 **Browser Notifications**: Get notified when new webhooks arrive
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Architecture

```
webhook-receiver-ui/
├── server/                 # Backend webhook receiver
│   ├── server.js          # Express + Socket.IO server
│   └── package.json       # Server dependencies
└── client/                # Frontend React application
    ├── src/
    │   ├── components/    # React components
    │   ├── App.jsx       # Main application
    │   └── index.css     # Tailwind styles
    └── package.json      # Client dependencies
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

### 1. Install Server Dependencies

```bash
cd webhook-receiver-ui/server
npm install
```

### 2. Install Client Dependencies

```bash
cd webhook-receiver-ui/client
npm install
```

## Running the Application

### Start the Server (Terminal 1)

```bash
cd webhook-receiver-ui/server
npm start
```

The server will start on http://localhost:3000

### Start the Client (Terminal 2)

```bash
cd webhook-receiver-ui/client
npm run dev
```

The client will start on http://localhost:3001

## Usage

1. **Open the Dashboard**: Navigate to http://localhost:3001
2. **Configure Your Application**: Point your webhook URLs to http://localhost:3000/webhook
3. **Monitor Webhooks**: Watch as webhooks appear in real-time
4. **Interact with Data**:
   - Click on webhooks to see details
   - Use search to find specific events
   - Filter by event type
   - Export data as JSON

## API Endpoints

### Webhook Receiver

- `POST /webhook` - Receive webhook events
- `GET /webhooks` - Get all stored webhooks
- `GET /webhooks/:id` - Get specific webhook
- `DELETE /webhooks` - Clear all webhooks
- `GET /health` - Health check
- `GET /stats` - Get statistics

### WebSocket Events

- `connection` - Client connected
- `new-webhook` - New webhook received
- `initial-webhooks` - Send existing webhooks to new client
- `clear-webhooks` - Clear all webhooks
- `webhooks-cleared` - Webhooks cleared notification

## Testing Webhooks

### Using cURL

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "ARTICLE_CREATED",
    "timestamp": "'$(date -Iseconds)'",
    "data": {
      "id": 1,
      "title": "Test Article",
      "content": "This is a test webhook",
      "userId": 1
    }
  }'
```

### Using the Main Application

Configure your webhook-poc application to send webhooks to:
```
http://localhost:3000/webhook
```

## Features in Detail

### Real-time Updates
- WebSocket connection for instant updates
- No page refresh needed
- Connection status indicator

### Statistics
- Total webhook count
- Webhooks in the last hour
- Event type distribution
- Visual charts and metrics

### Search & Filter
- Full-text search across webhook data
- Filter by event type
- Sort by timestamp

### Data Management
- Export webhooks as JSON
- Clear all webhooks
- Persistent storage (last 100 webhooks)

## Configuration

### Server Configuration

Edit `server/server.js` to modify:
- Port (default: 3000)
- Max webhooks stored (default: 100)
- CORS origins

### Client Configuration

Edit `client/vite.config.js` to modify:
- Port (default: 3001)
- Server URL

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Technologies Used

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS
- UUID

### Frontend
- React 18
- Vite
- Tailwind CSS
- Socket.IO Client
- date-fns
- Axios

## Troubleshooting

### Connection Issues
- Ensure both server and client are running
- Check firewall settings for ports 3000 and 3001
- Verify CORS configuration

### No Webhooks Appearing
- Check the webhook endpoint URL
- Verify the server is running on port 3000
- Check browser console for errors

## License

MIT