#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Webhook Receiver UI - Startup Script ${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

# Set up trap for cleanup
trap cleanup INT TERM

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Install server dependencies if needed
echo -e "\n${YELLOW}Checking server dependencies...${NC}"
cd server
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    npm install
fi

# Install client dependencies if needed
echo -e "\n${YELLOW}Checking client dependencies...${NC}"
cd ../client
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    npm install
fi

# Start the server
echo -e "\n${GREEN}Starting webhook receiver server...${NC}"
cd ../server
npm start &
SERVER_PID=$!
echo -e "${GREEN}Server started with PID: $SERVER_PID${NC}"

# Wait for server to start
sleep 3

# Start the client
echo -e "\n${GREEN}Starting webhook receiver client...${NC}"
cd ../client
npm run dev &
CLIENT_PID=$!
echo -e "${GREEN}Client started with PID: $CLIENT_PID${NC}"

# Wait a moment for services to fully start
sleep 3

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Services are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Server:${NC} http://localhost:3000"
echo -e "${YELLOW}Client:${NC} http://localhost:3001"
echo -e "${YELLOW}Webhook endpoint:${NC} http://localhost:3000/webhook"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Keep script running
wait