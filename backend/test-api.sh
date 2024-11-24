#!/bin/bash

API_URL="https://addiction-recovery-toolbox.onrender.com/api"
EMAIL="test@example.com"
PASSWORD="Test123!"
NAME="Test User"

echo "1. Testing registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")
echo "Register Response: $REGISTER_RESPONSE"
echo

echo "2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Login Response: $LOGIN_RESPONSE"
echo

# Extract token from login response (this assumes the token is in the response)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "No token received. Exiting..."
  exit 1
fi

echo "3. Testing get user profile..."
curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo

echo "4. Testing create checklist item..."
CHECKLIST_RESPONSE=$(curl -s -X POST "$API_URL/checklist" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Item","description":"This is a test item","completed":false}')
echo "Create Checklist Response: $CHECKLIST_RESPONSE"
echo

# Extract checklist item ID from response
ITEM_ID=$(echo $CHECKLIST_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$ITEM_ID" ]; then
  echo "5. Testing update checklist item..."
  curl -s -X PATCH "$API_URL/checklist/$ITEM_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"completed":true}'
  echo

  echo "6. Testing get all checklist items..."
  curl -s -X GET "$API_URL/checklist" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json"
  echo

  echo "7. Testing delete checklist item..."
  curl -s -X DELETE "$API_URL/checklist/$ITEM_ID" \
    -H "Authorization: Bearer $TOKEN"
  echo
fi
