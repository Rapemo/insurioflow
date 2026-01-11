#!/bin/bash

# Admin User Creation Script
# This script creates an admin user using curl and Supabase API

# Configuration
SUPABASE_URL="https://zberkdnwjkzqjfvzgxkv.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXJrZG53amt6cWpmdnpneGt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM2Nzc0OCwiZXhwIjoyMDgwOTQzNzQ4fQ.pM5qL-5gQ2RJwGhXqzYXqL2jQ6x7J3Q8R4d2K1mF3Y"

ADMIN_EMAIL="admin@insurio.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"

echo "🚀 Creating admin user..."

# Step 1: Create auth user
echo "📝 Creating auth user..."
AUTH_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"${ADMIN_EMAIL}"'",
    "password": "'"${ADMIN_PASSWORD}"'",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "'"${ADMIN_NAME}"'",
      "role": "admin"
    }
  }')

# Check if user was created or already exists
if echo "$AUTH_RESPONSE" | grep -q "already registered"; then
    echo "ℹ️  User already exists, getting user ID..."
    
    # Get existing user ID
    USER_ID=$(curl -s -X GET "${SUPABASE_URL}/auth/v1/admin/users" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "apikey: ${SERVICE_ROLE_KEY}" | \
      grep -o '"id":"[^"]*","email":"'"${ADMIN_EMAIL}"'"' | \
      grep -o '"id":"[^"]*"' | \
      cut -d'"' -f4)
      
    if [ -z "$USER_ID" ]; then
        echo "❌ Could not find existing user"
        exit 1
    fi
    
    echo "✅ Found existing user with ID: $USER_ID"
else
    # Extract user ID from creation response
    USER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$USER_ID" ]; then
        echo "❌ Failed to create user: $AUTH_RESPONSE"
        exit 1
    fi
    
    echo "✅ New auth user created with ID: $USER_ID"
fi

# Step 2: Create user profile
echo "👤 Creating user profile..."
PROFILE_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/user_profiles" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{
    "user_id": "'"${USER_ID}"'",
    "role": "admin",
    "full_name": "'"${ADMIN_NAME}"'",
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "updated_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }')

if echo "$PROFILE_RESPONSE" | grep -q "error"; then
    echo "❌ Profile creation failed: $PROFILE_RESPONSE"
    exit 1
fi

echo "✅ Admin user profile created successfully!"
echo ""
echo "📋 Admin User Details:"
echo "   Email: ${ADMIN_EMAIL}"
echo "   Password: ${ADMIN_PASSWORD}"
echo "   Name: ${ADMIN_NAME}"
echo "   Role: admin"
echo ""
echo "🔗 Login URLs:"
echo "   Main: http://localhost:3000"
echo "   Admin Login: http://localhost:3000/admin/login"
echo "   Dashboard: http://localhost:3000/dashboard"
