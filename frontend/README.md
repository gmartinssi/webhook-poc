# Webhook POC Frontend

A React + Vite frontend application for the Article Management System with webhook functionality.

## Features

- 📝 **Article Management**: Create, view, and delete articles
- 🔔 **Webhook Configuration**: Subscribe and manage webhook URLs
- 👤 **User-based System**: Manage articles per user ID
- ⚡ **Real-time Updates**: Instant feedback and loading states
- 🎨 **Modern UI**: Built with Tailwind CSS for responsive design

## Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:8080

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser at http://localhost:5173

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── ArticleList.jsx    # Display articles
│   │   ├── ArticleForm.jsx    # Create articles
│   │   ├── WebhookSettings.jsx # Webhook configuration
│   │   └── Tabs.jsx           # Tab navigation
│   ├── services/           # API services
│   │   └── api.js            # Axios API client
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Tailwind CSS imports
├── public/                # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```

## Usage

1. **Set User ID**: Enter a numeric user ID (e.g., 1, 2, 3) to start
2. **Articles Tab**: 
   - Create new articles with title and content
   - View all articles for the current user
   - Delete articles with confirmation
3. **Webhook Settings Tab**:
   - Configure webhook URL for notifications
   - Test webhook with a sample article
   - View current webhook configuration

## API Endpoints

The frontend connects to these backend endpoints:

- `GET /api/articles/user/{userId}` - Fetch user's articles
- `POST /api/articles` - Create new article
- `DELETE /api/articles/{id}` - Delete article
- `POST /api/webhooks/subscribe` - Subscribe/update webhook
- `GET /api/webhooks/user/{userId}` - Get webhook config

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linter
```bash
npm run lint
```

## Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **PostCSS** - CSS processing

## Webhook Events

When configured, the webhook endpoint receives POST requests for:

- `ARTICLE_CREATED` - New article created
- `ARTICLE_UPDATED` - Article updated
- `ARTICLE_DELETED` - Article deleted

## Troubleshooting

- **CORS Issues**: Ensure backend has CORS configured for http://localhost:5173
- **Connection Failed**: Check if backend is running on port 8080
- **Styles Not Loading**: Run `npm install` to install Tailwind dependencies

## License

MIT