# SoulLink API Documentation

This document outlines the API endpoints and data structures for the SoulLink application.

## Base URL

```
https://api.soullink-app.com
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication.

### Headers

For authenticated requests, include the following header:

```
Authorization: Bearer <access_token>
```

### Authentication Flow

1. User logs in with phone number
2. Server sends verification code via SMS
3. User verifies code
4. Server returns access token and refresh token
5. Client includes access token in subsequent requests
6. When access token expires, use refresh token to get a new one

## Endpoints

### Authentication

#### Login

```
POST /auth/login
```

Request:
```json
{
  "phoneNumber": "string",
  "deviceId": "string"
}
```

Response:
```json
{
  "success": true,
  "verificationSent": true,
  "userId": "string",
  "message": "string"
}
```

#### Verify Code

```
POST /auth/verify
```

Request:
```json
{
  "phoneNumber": "string",
  "code": "string",
  "deviceId": "string"
}
```

Response:
```json
{
  "success": true,
  "accessToken": "string",
  "refreshToken": "string",
  "userId": "string",
  "message": "string"
}
```

#### Refresh Token

```
POST /auth/refresh
```

Request:
```json
{
  "refreshToken": "string"
}
```

Response:
```json
{
  "success": true,
  "accessToken": "string",
  "refreshToken": "string",
  "message": "string"
}
```

#### Logout

```
POST /auth/logout
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### User

#### Get Profile

```
GET /user/profile
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "phoneNumber": "string",
  "profilePicture": "string",
  "status": "string",
  "lastSeen": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update Profile

```
PUT /user/profile
```

Request:
```json
{
  "name": "string",
  "status": "string",
  "profilePicture": "string"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "phoneNumber": "string",
    "profilePicture": "string",
    "status": "string",
    "lastSeen": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "string"
}
```

#### Upload Profile Picture

```
POST /user/profile/picture
```

Request:
```
multipart/form-data
```

Response:
```json
{
  "success": true,
  "url": "string",
  "message": "string"
}
```

#### Delete Account

```
DELETE /user/account
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### Connection

#### Get Partner Connection

```
GET /connection/partner
```

Response:
```json
{
  "connectionId": "string",
  "partnerId": "string",
  "partnerName": "string",
  "partnerPhoneNumber": "string",
  "partnerProfilePicture": "string",
  "status": "online | offline | away",
  "lastSeen": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Send Connection Request

```
POST /connection/request
```

Request:
```json
{
  "phoneNumber": "string",
  "message": "string"
}
```

Response:
```json
{
  "success": true,
  "connection": {
    "connectionId": "string",
    "partnerId": "string",
    "partnerName": "string",
    "partnerPhoneNumber": "string",
    "partnerProfilePicture": "string",
    "status": "online | offline | away",
    "lastSeen": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "string"
}
```

#### Get Connection Requests

```
GET /connection/requests
```

Response:
```json
{
  "success": true,
  "requests": [
    {
      "id": "string",
      "senderId": "string",
      "senderName": "string",
      "senderPhoneNumber": "string",
      "senderProfilePicture": "string",
      "message": "string",
      "status": "pending | accepted | rejected",
      "createdAt": "string"
    }
  ],
  "message": "string"
}
```

#### Accept Connection Request

```
POST /connection/request/{requestId}/accept
```

Response:
```json
{
  "success": true,
  "connection": {
    "connectionId": "string",
    "partnerId": "string",
    "partnerName": "string",
    "partnerPhoneNumber": "string",
    "partnerProfilePicture": "string",
    "status": "online | offline | away",
    "lastSeen": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "string"
}
```

#### Reject Connection Request

```
POST /connection/request/{requestId}/reject
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Remove Connection

```
DELETE /connection/{connectionId}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### Message

#### Send Message

```
POST /message/send
```

Request:
```json
{
  "connectionId": "string",
  "content": "string",
  "type": "text | image | audio | video | file",
  "replyToId": "string",
  "attachments": [
    {
      "type": "image | audio | video | file",
      "url": "string",
      "thumbnail": "string",
      "name": "string",
      "size": 0
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": {
    "id": "string",
    "connectionId": "string",
    "senderId": "string",
    "receiverId": "string",
    "content": "string",
    "type": "text | image | audio | video | file",
    "status": "sent | delivered | read",
    "replyToId": "string",
    "attachments": [
      {
        "id": "string",
        "type": "image | audio | video | file",
        "url": "string",
        "thumbnail": "string",
        "name": "string",
        "size": 0
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Get Messages

```
GET /message/{connectionId}?cursor={cursor}&limit={limit}
```

Response:
```json
{
  "success": true,
  "messages": [
    {
      "id": "string",
      "connectionId": "string",
      "senderId": "string",
      "receiverId": "string",
      "content": "string",
      "type": "text | image | audio | video | file",
      "status": "sent | delivered | read",
      "replyToId": "string",
      "attachments": [
        {
          "id": "string",
          "type": "image | audio | video | file",
          "url": "string",
          "thumbnail": "string",
          "name": "string",
          "size": 0
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "hasMore": true,
  "nextCursor": "string"
}
```

#### Mark Message as Read

```
POST /message/{messageId}/read
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Set Typing Status

```
POST /message/{connectionId}/typing
```

Request:
```json
{
  "isTyping": true
}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Upload Attachment

```
POST /message/attachment
```

Request:
```
multipart/form-data
```

Response:
```json
{
  "success": true,
  "url": "string",
  "thumbnail": "string",
  "message": "string"
}
```

#### Delete Message

```
DELETE /message/{messageId}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### Love Spark

#### Get Love Sparks

```
GET /lovespark?category={category}
```

Response:
```json
{
  "success": true,
  "sparks": [
    {
      "id": "string",
      "content": "string",
      "category": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "message": "string"
}
```

#### Get Personalized Sparks

```
GET /lovespark/personalized
```

Response:
```json
{
  "success": true,
  "sparks": [
    {
      "id": "string",
      "content": "string",
      "category": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "message": "string"
}
```

#### Rate Love Spark

```
POST /lovespark/{sparkId}/rate
```

Request:
```json
{
  "rating": 5
}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Create Love Spark

```
POST /lovespark
```

Request:
```json
{
  "content": "string",
  "category": "string"
}
```

Response:
```json
{
  "success": true,
  "spark": {
    "id": "string",
    "content": "string",
    "category": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "string"
}
```

#### Delete Love Spark

```
DELETE /lovespark/{sparkId}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### Notification

#### Register Device

```
POST /notification/device
```

Request:
```json
{
  "deviceToken": "string",
  "platform": "ios | android"
}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Update Notification Settings

```
PUT /notification/settings
```

Request:
```json
{
  "partnerOnline": true,
  "messages": true,
  "connectionRequests": true,
  "dailyReminders": true
}
```

Response:
```json
{
  "success": true,
  "settings": {
    "partnerOnline": true,
    "messages": true,
    "connectionRequests": true,
    "dailyReminders": true
  },
  "message": "string"
}
```

#### Get Notification Settings

```
GET /notification/settings
```

Response:
```json
{
  "success": true,
  "settings": {
    "partnerOnline": true,
    "messages": true,
    "connectionRequests": true,
    "dailyReminders": true
  },
  "message": "string"
}
```

#### Unregister Device

```
DELETE /notification/device/{deviceToken}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Send Test Notification

```
POST /notification/test
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

### Presence

#### Update Presence

```
POST /presence
```

Request:
```json
{
  "status": "online | offline | away"
}
```

Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Get Partner Presence

```
GET /presence/{partnerId}
```

Response:
```json
{
  "success": true,
  "status": "online | offline | away",
  "lastSeen": "string",
  "message": "string"
}
```

## WebSocket Events

The app uses WebSockets for real-time communication. Connect to:

```
wss://api.soullink-app.com/socket
```

Authentication is done by including the access token in the connection:

```javascript
io('wss://api.soullink-app.com/socket', {
  auth: {
    token: 'your_access_token'
  }
});
```

### Events from Server

#### Partner Presence

```json
{
  "userId": "string",
  "status": "online | offline | away",
  "timestamp": "string"
}
```

#### New Message

```json
{
  "message": {
    "id": "string",
    "connectionId": "string",
    "senderId": "string",
    "receiverId": "string",
    "content": "string",
    "type": "text | image | audio | video | file",
    "status": "sent | delivered | read",
    "replyToId": "string",
    "attachments": [
      {
        "id": "string",
        "type": "image | audio | video | file",
        "url": "string",
        "thumbnail": "string",
        "name": "string",
        "size": 0
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Message Status

```json
{
  "messageId": "string",
  "status": "sent | delivered | read"
}
```

#### Typing Status

```json
{
  "connectionId": "string",
  "userId": "string",
  "isTyping": true
}
```

#### Connection Request

```json
{
  "request": {
    "id": "string",
    "senderId": "string",
    "senderName": "string",
    "senderPhoneNumber": "string",
    "senderProfilePicture": "string",
    "message": "string",
    "status": "pending",
    "createdAt": "string"
  }
}
```

#### Connection Accepted

```json
{
  "connection": {
    "connectionId": "string",
    "partnerId": "string",
    "partnerName": "string",
    "partnerPhoneNumber": "string",
    "partnerProfilePicture": "string",
    "status": "online | offline | away",
    "lastSeen": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Connection Rejected

```json
{
  "requestId": "string"
}
```

#### Connection Removed

```json
{
  "connectionId": "string"
}
```

### Events to Server

#### Set Typing Status

```json
{
  "connectionId": "string",
  "isTyping": true
}
```

#### Set Presence

```json
{
  "status": "online | offline | away"
}
```

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Common error codes:

- `auth_required`: Authentication required
- `invalid_token`: Invalid or expired token
- `invalid_request`: Invalid request parameters
- `not_found`: Resource not found
- `permission_denied`: Permission denied
- `rate_limited`: Too many requests
- `server_error`: Internal server error