#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:8080/api"
WEBHOOK_URL="http://localhost:3000/webhook"

echo -e "${BLUE}======================================"
echo -e "   WEBHOOK POC TEST SCRIPT"
echo -e "======================================${NC}\n"

# Function to make requests and display results
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}$description${NC}"
    echo -e "${GREEN}Request:${NC} $method $endpoint"
    
    if [ -n "$data" ]; then
        echo -e "${GREEN}Payload:${NC}"
        echo "$data" | jq '.' 2>/dev/null || echo "$data"
        response=$(curl -s -X $method "$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -X $method "$endpoint")
    fi
    
    echo -e "${GREEN}Response:${NC}"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo -e "--------------------------------------\n"
    sleep 2
}

# Test 1: Subscribe webhook for user 1
echo -e "${BLUE}Step 1: Subscribe Webhook for User 1${NC}"
make_request POST "${API_URL}/webhooks/subscribe" \
    '{"userId": 1, "webhookUrl": "'$WEBHOOK_URL'"}' \
    "Registering webhook URL for user 1"

# Test 2: Create an article (triggers ARTICLE_CREATED webhook)
echo -e "${BLUE}Step 2: Create Article (triggers ARTICLE_CREATED)${NC}"
make_request POST "${API_URL}/articles" \
    '{"title": "Introduction to Webhooks", "content": "Webhooks are user-defined HTTP callbacks that are triggered by specific events.", "userId": 1}' \
    "Creating new article for user 1"

# Test 3: Get the created article
echo -e "${BLUE}Step 3: Get Article by ID${NC}"
make_request GET "${API_URL}/articles/1" "" \
    "Fetching article with ID 1"

# Test 4: Update the article (triggers ARTICLE_UPDATED webhook)
echo -e "${BLUE}Step 4: Update Article (triggers ARTICLE_UPDATED)${NC}"
make_request PUT "${API_URL}/articles/1" \
    '{"title": "Advanced Webhooks Guide", "content": "Webhooks are powerful tools for real-time event notifications in distributed systems.", "userId": 1}' \
    "Updating article 1"

# Test 5: Create another article
echo -e "${BLUE}Step 5: Create Second Article${NC}"
make_request POST "${API_URL}/articles" \
    '{"title": "REST API Best Practices", "content": "Learn about REST API design patterns and best practices.", "userId": 1}' \
    "Creating second article for user 1"

# Test 6: Get all articles for user 1
echo -e "${BLUE}Step 6: Get All Articles for User 1${NC}"
make_request GET "${API_URL}/articles/user/1" "" \
    "Fetching all articles for user 1"

# Test 7: Subscribe webhook for user 2
echo -e "${BLUE}Step 7: Subscribe Webhook for User 2${NC}"
make_request POST "${API_URL}/webhooks/subscribe" \
    '{"userId": 2, "webhookUrl": "http://localhost:3000/webhook"}' \
    "Registering webhook URL for user 2"

# Test 8: Create article for user 2
echo -e "${BLUE}Step 8: Create Article for User 2${NC}"
make_request POST "${API_URL}/articles" \
    '{"title": "Microservices Architecture", "content": "Introduction to microservices and distributed systems.", "userId": 2}' \
    "Creating article for user 2"

# Test 9: Try to update article with wrong user (should fail)
echo -e "${BLUE}Step 9: Try to Update Article with Wrong User (should fail)${NC}"
make_request PUT "${API_URL}/articles/1" \
    '{"title": "Unauthorized Update", "content": "This should fail", "userId": 2}' \
    "Attempting unauthorized update"

# Test 10: Delete article (triggers ARTICLE_DELETED webhook)
echo -e "${BLUE}Step 10: Delete Article (triggers ARTICLE_DELETED)${NC}"
make_request DELETE "${API_URL}/articles/1?userId=1" "" \
    "Deleting article 1"

# Test 11: Verify deletion
echo -e "${BLUE}Step 11: Verify Deletion${NC}"
make_request GET "${API_URL}/articles/user/1" "" \
    "Verifying article 1 is deleted"

echo -e "${BLUE}======================================"
echo -e "   TEST SCRIPT COMPLETED"
echo -e "======================================${NC}"
echo -e "${YELLOW}Check the webhook receiver console for received webhooks!${NC}"
