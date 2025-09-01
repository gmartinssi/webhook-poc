const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

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

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const timestamp = new Date().toISOString();
    
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.green}🎯 WEBHOOK RECEIVED${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.yellow}Timestamp:${colors.reset} ${timestamp}`);
    console.log(`${colors.yellow}Event Type:${colors.reset} ${colors.magenta}${req.body.eventType}${colors.reset}`);
    console.log(`${colors.yellow}Payload:${colors.reset}`);
    console.log(JSON.stringify(req.body, null, 2));
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
    
    // Send success response
    res.status(200).json({ 
        status: 'success', 
        message: 'Webhook received successfully',
        receivedAt: timestamp
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'webhook-receiver' });
});

// Start server
app.listen(PORT, () => {
    console.log(`${colors.bright}${colors.green}✅ Webhook Receiver Server Started${colors.reset}`);
    console.log(`${colors.yellow}📍 Listening on:${colors.reset} http://localhost:${PORT}`);
    console.log(`${colors.yellow}🎯 Webhook endpoint:${colors.reset} http://localhost:${PORT}/webhook`);
    console.log(`${colors.yellow}❤️  Health check:${colors.reset} http://localhost:${PORT}/health`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Shutting down webhook receiver...${colors.reset}`);
    process.exit(0);
});
