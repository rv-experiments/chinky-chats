# SoulLink API Documentation

This document outlines all the API endpoints required for the SoulLink application to function properly. These APIs will need to be implemented on the backend to support the frontend functionality.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.soullink.app/v1
```

## Authentication

### Register User

Register a new user with their phone number.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "deviceId": "unique-device-id"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user-123",
  "verificationSent": true
}
```

### Verify Phone Number

Verify the user's phone number with the code sent via SMS.

**Endpoint:** `POST /auth/verify`

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-auth-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "profilePicture": "https://..."
  }
}
```

### Login

Login with phone number and verification code.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "deviceId": "unique-device-id"
}
```

**Response:**
```json
{
  "success": true,
  "verificationSent": true
}
```

### Refresh Token

Refresh the authentication token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new-jwt-auth-token",
  "refreshToken": "new-refresh-token"
}
```

### Logout

Logout the user and invalidate their tokens.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "success": true
}
```

## User Management

### Get User Profile

Get the current user's profile.

**Endpoint:** `GET /users/me`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "profilePicture": "https://...",
  "status": "online",
  "lastSeen": "2025-04-19T05:00:00Z"
}
```

### Update User Profile

Update the current user's profile.

**Endpoint:** `PUT /users/me`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "name": "John Smith",
  "profilePicture": "base64-encoded-image"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "John Smith",
    "phoneNumber": "+1234567890",
    "profilePicture": "https://..."
  }
}
```

### Get User by Phone Number

Get a user by their phone number.

**Endpoint:** `GET /users/phone/{phoneNumber}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "id": "user-456",
  "name": "Jane Doe",
  "phoneNumber": "+0987654321",
  "profilePicture": "https://...",
  "status": "offline",
  "lastSeen": "2025-04-18T20:00:00Z"
}
```

### Get Contacts

Get all contacts from the user's phone that are registered on SoulLink.

**Endpoint:** `POST /users/contacts`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "contacts": [
    "+1234567890",
    "+0987654321",
    "+1122334455"
  ]
}
```

**Response:**
```json
{
  "users": [
    {
      "id": "user-456",
      "name": "Jane Doe",
      "phoneNumber": "+0987654321",
      "profilePicture": "https://...",
      "status": "offline",
      "lastSeen": "2025-04-18T20:00:00Z"
    }
  ]
}
```

## Connection Management

### Send Connection Request

Send a connection request to another user.

**Endpoint:** `POST /connections/request`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "targetUserId": "user-456",
  "message": "Hey, let's connect on SoulLink!"
}
```

**Response:**
```json
{
  "success": true,
  "connectionRequest": {
    "id": "request-123",
    "fromUserId": "user-123",
    "toUserId": "user-456",
    "status": "pending",
    "createdAt": "2025-04-19T06:00:00Z"
  }
}
```

### Accept Connection Request

Accept a connection request from another user.

**Endpoint:** `POST /connections/accept/{requestId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "success": true,
  "connection": {
    "id": "connection-123",
    "userId1": "user-123",
    "userId2": "user-456",
    "status": "active",
    "createdAt": "2025-04-19T06:30:00Z"
  }
}
```

### Reject Connection Request

Reject a connection request from another user.

**Endpoint:** `POST /connections/reject/{requestId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "success": true
}
```

### Get Connection Status

Get the connection status with another user.

**Endpoint:** `GET /connections/status/{userId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "status": "connected", // or "pending", "not_connected"
  "connectionId": "connection-123", // if connected
  "requestId": "request-123" // if pending
}
```

### Get Partner

Get the current user's partner information.

**Endpoint:** `GET /connections/partner`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "id": "user-456",
  "name": "Jane Doe",
  "phoneNumber": "+0987654321",
  "profilePicture": "https://...",
  "status": "online",
  "lastSeen": "2025-04-19T06:45:00Z",
  "connectionId": "connection-123"
}
```

## Messaging

### Get Conversation

Get the conversation with the partner.

**Endpoint:** `GET /messages/{connectionId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Query Parameters:**
```
limit: 50 (default)
before: message-id (for pagination)
```

**Response:**
```json
{
  "messages": [
    {
      "id": "message-123",
      "connectionId": "connection-123",
      "senderId": "user-123",
      "content": "Hello!",
      "type": "text",
      "status": "read",
      "createdAt": "2025-04-19T07:00:00Z",
      "readAt": "2025-04-19T07:01:00Z"
    },
    {
      "id": "message-124",
      "connectionId": "connection-123",
      "senderId": "user-456",
      "content": "Hi there!",
      "type": "text",
      "status": "read",
      "createdAt": "2025-04-19T07:02:00Z",
      "readAt": "2025-04-19T07:03:00Z"
    }
  ],
  "hasMore": false
}
```

### Send Message

Send a message to the partner.

**Endpoint:** `POST /messages`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "connectionId": "connection-123",
  "content": "How are you today?",
  "type": "text"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "message-125",
    "connectionId": "connection-123",
    "senderId": "user-123",
    "content": "How are you today?",
    "type": "text",
    "status": "sent",
    "createdAt": "2025-04-19T07:10:00Z"
  }
}
```

### Mark Message as Read

Mark a message as read.

**Endpoint:** `POST /messages/{messageId}/read`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "success": true
}
```

### Get Typing Status

Get the typing status of the partner.

**Endpoint:** `GET /messages/typing/{connectionId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "isTyping": true,
  "userId": "user-456",
  "timestamp": "2025-04-19T07:15:00Z"
}
```

### Set Typing Status

Set the typing status for the partner.

**Endpoint:** `POST /messages/typing/{connectionId}`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "isTyping": true
}
```

**Response:**
```json
{
  "success": true
}
```

## Love Sparks

### Get Love Sparks

Get love spark suggestions.

**Endpoint:** `GET /lovesparks`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Query Parameters:**
```
category: "flirty" | "thoughtful" | "playful" | "spiritual" | "gratitude"
limit: 5 (default)
```

**Response:**
```json
{
  "sparks": [
    {
      "id": "spark-123",
      "content": "What's your favorite memory of us together?",
      "category": "thoughtful"
    },
    {
      "id": "spark-124",
      "content": "I'm thinking about you right now. What are you up to?",
      "category": "flirty"
    },
    {
      "id": "spark-125",
      "content": "Let's play truth or dare! You go first.",
      "category": "playful"
    }
  ]
}
```

### Rate Love Spark

Rate a love spark suggestion.

**Endpoint:** `POST /lovesparks/{sparkId}/rate`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "rating": 5 // 1-5 scale
}
```

**Response:**
```json
{
  "success": true
}
```

## Presence

### Update Presence

Update the user's online presence.

**Endpoint:** `POST /presence`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "status": "online" // or "offline", "away"
}
```

**Response:**
```json
{
  "success": true
}
```

### Get Partner Presence

Get the partner's online presence.

**Endpoint:** `GET /presence/partner`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "status": "online",
  "lastSeen": "2025-04-19T07:30:00Z"
}
```

## Notifications

### Register Device

Register a device for push notifications.

**Endpoint:** `POST /notifications/devices`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "deviceToken": "firebase-device-token",
  "platform": "android" // or "ios"
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": "device-123"
}
```

### Update Notification Settings

Update notification settings.

**Endpoint:** `PUT /notifications/settings`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Request Body:**
```json
{
  "partnerOnline": true,
  "messages": true,
  "connectionRequests": true,
  "dailyReminders": true
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "partnerOnline": true,
    "messages": true,
    "connectionRequests": true,
    "dailyReminders": true
  }
}
```

### Get Notification Settings

Get notification settings.

**Endpoint:** `GET /notifications/settings`

**Headers:**
```
Authorization: Bearer jwt-auth-token
```

**Response:**
```json
{
  "settings": {
    "partnerOnline": true,
    "messages": true,
    "connectionRequests": true,
    "dailyReminders": true
  }
}
```

## Real-time Communication

For real-time features like instant messaging, typing indicators, and presence updates, the app will use WebSockets.

### WebSocket Connection

**Endpoint:** `wss://api.soullink.app/v1/ws`

**Query Parameters:**
```
token=jwt-auth-token
```

### WebSocket Events

#### Connection Status

```json
{
  "type": "connection_status",
  "data": {
    "status": "connected"
  }
}
```

#### Partner Presence

```json
{
  "type": "partner_presence",
  "data": {
    "userId": "user-456",
    "status": "online",
    "timestamp": "2025-04-19T08:00:00Z"
  }
}
```

#### New Message

```json
{
  "type": "new_message",
  "data": {
    "message": {
      "id": "message-126",
      "connectionId": "connection-123",
      "senderId": "user-456",
      "content": "I miss you!",
      "type": "text",
      "status": "delivered",
      "createdAt": "2025-04-19T08:05:00Z"
    }
  }
}
```

#### Message Status Update

```json
{
  "type": "message_status",
  "data": {
    "messageId": "message-125",
    "status": "read",
    "timestamp": "2025-04-19T08:06:00Z"
  }
}
```

#### Typing Status

```json
{
  "type": "typing_status",
  "data": {
    "connectionId": "connection-123",
    "userId": "user-456",
    "isTyping": true,
    "timestamp": "2025-04-19T08:07:00Z"
  }
}
```

#### Connection Request

```json
{
  "type": "connection_request",
  "data": {
    "request": {
      "id": "request-124",
      "fromUserId": "user-789",
      "fromUserName": "Alex Smith",
      "fromUserProfilePicture": "https://...",
      "message": "Let's connect!",
      "createdAt": "2025-04-19T08:10:00Z"
    }
  }
}
```

#### Connection Update

```json
{
  "type": "connection_update",
  "data": {
    "connectionId": "connection-123",
    "status": "active",
    "timestamp": "2025-04-19T08:15:00Z"
  }
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "invalid_credentials",
    "message": "The provided credentials are invalid."
  }
}
```

Common error codes:
- `unauthorized`: Authentication required
- `forbidden`: Insufficient permissions
- `not_found`: Resource not found
- `invalid_request`: Invalid request parameters
- `rate_limited`: Too many requests
- `server_error`: Internal server error

## API Versioning

The API version is included in the URL path (`/v1/`). When breaking changes are introduced, a new version will be created (e.g., `/v2/`).