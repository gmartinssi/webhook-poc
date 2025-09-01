const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
});

// Store webhooks in memory (in production, use a database)
let webhooks = [];
const MAX_WEBHOOKS = 100; // Keep only last 100 webhooks

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`${colors.green}✅ Client connected:${colors.reset} ${socket.id}`);
    
    // Send existing webhooks to new client
    socket.emit('initial-webhooks', webhooks);
    
    socket.on('disconnect', () => {
        console.log(`${colors.yellow}👋 Client disconnected:${colors.reset} ${socket.id}`);
    });
    
    // Handle webhook clearing
    socket.on('clear-webhooks', () => {
        webhooks = [];
        io.emit('webhooks-cleared');
        console.log(`${colors.cyan}🗑️  Webhooks cleared by client${colors.reset}`);
    });
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const timestamp = new Date().toISOString();
    const webhookId = uuidv4();
    
    // Create webhook object
    const webhook = {
        id: webhookId,
        timestamp,
        eventType: req.body.eventType || 'UNKNOWN',
        data: req.body.data || req.body,
        headers: {
            'content-type': req.headers['content-type'],
            'user-agent': req.headers['user-agent'],
            'content-length': req.headers['content-length']
        },
        sourceIp: req.ip || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
        fullPayload: req.body
    };
    
    // Add to webhooks array (maintain max size)
    webhooks.unshift(webhook);
    if (webhooks.length > MAX_WEBHOOKS) {
        webhooks = webhooks.slice(0, MAX_WEBHOOKS);
    }
    
    // Log to console
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.green}🎯 WEBHOOK RECEIVED${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.yellow}ID:${colors.reset} ${webhookId}`);
    console.log(`${colors.yellow}Timestamp:${colors.reset} ${timestamp}`);
    console.log(`${colors.yellow}Event Type:${colors.reset} ${colors.magenta}${webhook.eventType}${colors.reset}`);
    console.log(`${colors.yellow}Source IP:${colors.reset} ${webhook.sourceIp}`);
    console.log(`${colors.yellow}Payload:${colors.reset}`);
    console.log(JSON.stringify(req.body, null, 2));
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
    
    // Emit to all connected clients
    io.emit('new-webhook', webhook);
    
    // Send success response
    res.status(200).json({ 
        status: 'success', 
        message: 'Webhook received successfully',
        webhookId,
        receivedAt: timestamp
    });
});

// GET endpoint to retrieve all webhooks
app.get('/webhooks', (req, res) => {
    res.json({
        count: webhooks.length,
        webhooks: webhooks
    });
});

// GET endpoint to retrieve a specific webhook
app.get('/webhooks/:id', (req, res) => {
    const webhook = webhooks.find(w => w.id === req.params.id);
    if (webhook) {
        res.json(webhook);
    } else {
        res.status(404).json({ error: 'Webhook not found' });
    }
});

// DELETE endpoint to clear all webhooks
app.delete('/webhooks', (req, res) => {
    const count = webhooks.length;
    webhooks = [];
    io.emit('webhooks-cleared');
    res.json({ 
        status: 'success', 
        message: `Cleared ${count} webhooks` 
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'webhook-receiver',
        uptime: process.uptime(),
        webhookCount: webhooks.length,
        connectedClients: io.engine.clientsCount
    });
});

// Statistics endpoint
app.get('/stats', (req, res) => {
    const eventTypes = {};
    webhooks.forEach(w => {
        eventTypes[w.eventType] = (eventTypes[w.eventType] || 0) + 1;
    });
    
    res.json({
        totalWebhooks: webhooks.length,
        eventTypes,
        oldestWebhook: webhooks[webhooks.length - 1]?.timestamp,
        newestWebhook: webhooks[0]?.timestamp,
        connectedClients: io.engine.clientsCount
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`${colors.bright}${colors.green}✅ Enhanced Webhook Receiver Server Started${colors.reset}`);
    console.log(`${colors.yellow}📍 Server:${colors.reset} http://localhost:${PORT}`);
    console.log(`${colors.yellow}🎯 Webhook endpoint:${colors.reset} http://localhost:${PORT}/webhook`);
    console.log(`${colors.yellow}📊 Get webhooks:${colors.reset} http://localhost:${PORT}/webhooks`);
    console.log(`${colors.yellow}📈 Statistics:${colors.reset} http://localhost:${PORT}/stats`);
    console.log(`${colors.yellow}❤️  Health check:${colors.reset} http://localhost:${PORT}/health`);
    console.log(`${colors.blue}🔌 WebSocket:${colors.reset} Enabled for real-time updates`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Shutting down webhook receiver...${colors.reset}`);
    io.close();
    server.close();
    process.exit(0);
});