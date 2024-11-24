#!/bin/bash

API_URL="https://addiction-recovery-toolbox.onrender.com/api"
EMAIL="test@example.com"
PASSWORD="Test123!@"  # Updated to meet Firebase password requirements
NAME="Test User"

echo "0. Testing server health..."
curl -s "$API_URL/../" | jq .
echo

echo "1. Testing registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")
echo "Register Response:"
echo "$REGISTER_RESPONSE" | jq .
echo

echo "2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq .
echo

# Note: In a real frontend app, you would get the token from Firebase Auth
# For testing, we'll skip the token-protected endpoints since we can't get a real Firebase token here
echo "Note: Skipping token-protected endpoints as they require Firebase Authentication from the frontend."
