# SoulLink API Documentation v2.0

## Overview

This document outlines the API endpoints for the SoulLink application, which enables couples and friends to stay connected through an intuitive messaging platform. The API is designed with a focus on the Indian market while being accessible globally.

## Base URL

```
https://api.soullink.app/v2
```

## Authentication

SoulLink uses a multi-factor authentication system with OTP verification.

### Authentication Endpoints

#### Register User

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",  // Required, format: +91XXXXXXXXXX
  "email": "string",  // Optional
  "countryCode": "string",  // Default: "IN"
  "language": "string"  // Default: "en-IN"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "string",
  "message": "OTP sent to your phone number"
}
```

#### Verify Phone OTP

```
POST /auth/verify-phone
```

**Request Body:**
```json
{
  "phone": "string",
  "otp": "string",
  "deviceId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "profilePicture": "string",
    "status": "string",
    "lastSeen": "ISO timestamp"
  }
}
```

#### Login with Phone

```
POST /auth/login
```

**Request Body:**
```json
{
  "phone": "string",
  "countryCode": "string"  // Default: "IN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your phone number"
}
```

#### Request Email OTP

```
POST /auth/email-otp
```

**Request Body:**
```json
{
  "email": "string",
  "phone": "string"  // Required to link with phone
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

#### Verify Email OTP

```
POST /auth/verify-email
```

**Request Body:**
```json
{
  "email": "string",
  "otp": "string",
  "phone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Refresh Token

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "refreshToken": "string"
}
```

#### Logout

```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Management

### User Endpoints

#### Get User Profile

```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "profilePicture": "string",
  "status": "string",
  "lastSeen": "ISO timestamp",
  "preferences": {
    "notifications": true,
    "theme": "light",
    "language": "en-IN",
    "privacySettings": {
      "lastSeen": "everyone",
      "profilePhoto": "contacts",
      "status": "everyone"
    }
  }
}
```

#### Update User Profile

```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "string",
  "status": "string",
  "email": "string",
  "preferences": {
    "notifications": true,
    "theme": "light",
    "language": "en-IN",
    "privacySettings": {
      "lastSeen": "everyone",
      "profilePhoto": "contacts",
      "status": "everyone"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### Upload Profile Picture

```
POST /users/profile-picture
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response:**
```json
{
  "success": true,
  "profilePicture": "string"
}
```

#### Get User Contacts

```
GET /users/contacts
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "contacts": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "profilePicture": "string",
      "status": "string",
      "isOnline": true,
      "lastSeen": "ISO timestamp",
      "isFavorite": true
    }
  ]
}
```

#### Sync Contacts

```
POST /users/sync-contacts
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "contacts": [
    {
      "name": "string",
      "phone": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "registeredContacts": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "profilePicture": "string"
    }
  ]
}
```

#### Add to Favorites

```
POST /users/favorites/{userId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

#### Remove from Favorites

```
DELETE /users/favorites/{userId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

## Messaging

### Chat Endpoints

#### Get All Chats

```
GET /chats
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "chats": [
    {
      "id": "string",
      "type": "individual",
      "participants": [
        {
          "id": "string",
          "name": "string",
          "profilePicture": "string"
        }
      ],
      "lastMessage": {
        "id": "string",
        "senderId": "string",
        "text": "string",
        "type": "text",
        "timestamp": "ISO timestamp",
        "status": "read"
      },
      "unreadCount": 0,
      "isPinned": false
    }
  ]
}
```

#### Get Chat by ID

```
GET /chats/{chatId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "type": "individual",
  "participants": [
    {
      "id": "string",
      "name": "string",
      "profilePicture": "string",
      "isOnline": true,
      "lastSeen": "ISO timestamp"
    }
  ],
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "text": "string",
      "type": "text",
      "timestamp": "ISO timestamp",
      "status": "read",
      "replyTo": {
        "id": "string",
        "text": "string"
      },
      "reactions": [
        {
          "userId": "string",
          "reaction": "string"
        }
      ]
    }
  ],
  "isPinned": false
}
```

#### Create New Chat

```
POST /chats
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "participantIds": ["string"],
  "type": "individual"
}
```

**Response:**
```json
{
  "success": true,
  "chatId": "string"
}
```

#### Pin Chat

```
PUT /chats/{chatId}/pin
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat pinned successfully"
}
```

#### Unpin Chat

```
PUT /chats/{chatId}/unpin
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat unpinned successfully"
}
```

### Message Endpoints

#### Send Message

```
POST /chats/{chatId}/messages
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "text": "string",
  "type": "text",
  "replyToMessageId": "string",
  "attachments": [
    {
      "type": "image",
      "url": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "string",
    "senderId": "string",
    "text": "string",
    "type": "text",
    "timestamp": "ISO timestamp",
    "status": "sent",
    "replyTo": {
      "id": "string",
      "text": "string"
    }
  }
}
```

#### Get Messages

```
GET /chats/{chatId}/messages
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
limit: number (default: 50)
before: string (message ID to get messages before)
```

**Response:**
```json
{
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "text": "string",
      "type": "text",
      "timestamp": "ISO timestamp",
      "status": "read",
      "replyTo": {
        "id": "string",
        "text": "string"
      },
      "reactions": [
        {
          "userId": "string",
          "reaction": "string"
        }
      ]
    }
  ],
  "hasMore": true
}
```

#### React to Message

```
POST /chats/{chatId}/messages/{messageId}/reactions
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reaction": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reaction added successfully"
}
```

#### Remove Reaction

```
DELETE /chats/{chatId}/messages/{messageId}/reactions
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Reaction removed successfully"
}
```

#### Mark Messages as Read

```
PUT /chats/{chatId}/read
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "messageIds": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

### Media Endpoints

#### Upload Media

```
POST /media/upload
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
type: "image" | "video" | "audio" | "document"
```

**Response:**
```json
{
  "success": true,
  "mediaId": "string",
  "url": "string",
  "type": "image",
  "size": 1024,
  "name": "string"
}
```

#### Get Media

```
GET /media/{mediaId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
Binary data with appropriate Content-Type header

## Stickers and GIFs

### Sticker Endpoints

#### Get Sticker Packs

```
GET /stickers/packs
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stickerPacks": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "thumbnail": "string",
      "stickers": [
        {
          "id": "string",
          "url": "string"
        }
      ]
    }
  ]
}
```

#### Get Popular Stickers

```
GET /stickers/popular
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "stickers": [
    {
      "id": "string",
      "url": "string",
      "packId": "string"
    }
  ]
}
```

### GIF Endpoints

#### Search GIFs

```
GET /gifs/search
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
query: string
limit: number (default: 20)
```

**Response:**
```json
{
  "gifs": [
    {
      "id": "string",
      "url": "string",
      "previewUrl": "string"
    }
  ]
}
```

#### Get Trending GIFs

```
GET /gifs/trending
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "gifs": [
    {
      "id": "string",
      "url": "string",
      "previewUrl": "string"
    }
  ]
}
```

## Love Sparks

### Love Sparks Endpoints

#### Get Love Sparks Suggestions

```
GET /love-sparks
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
category: string (optional: "flirty", "romantic", "thoughtful", "spiritual")
language: string (default: "en-IN")
```

**Response:**
```json
{
  "suggestions": [
    {
      "id": "string",
      "text": "string",
      "category": "flirty"
    }
  ]
}
```

#### Get Regional Love Sparks

```
GET /love-sparks/regional
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
language: string (e.g., "hi-IN", "ta-IN", "te-IN", "mr-IN")
```

**Response:**
```json
{
  "suggestions": [
    {
      "id": "string",
      "text": "string",
      "category": "regional",
      "language": "hi-IN"
    }
  ]
}
```

## Notifications

### Notification Endpoints

#### Get Notifications

```
GET /notifications
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "message",
      "title": "string",
      "body": "string",
      "data": {
        "chatId": "string",
        "senderId": "string"
      },
      "timestamp": "ISO timestamp",
      "isRead": false
    }
  ]
}
```

#### Mark Notification as Read

```
PUT /notifications/{notificationId}/read
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### Update Notification Settings

```
PUT /notifications/settings
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "messageNotifications": true,
  "connectionNotifications": true,
  "loveSparkNotifications": true,
  "soundEnabled": true,
  "vibrationEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings updated"
}
```

## Real-time Communication

### WebSocket Connection

```
WSS://api.soullink.app/v2/ws
```

**Query Parameters:**
```
token: string (JWT token)
```

### WebSocket Events

#### Connection Established

```json
{
  "type": "connection_established",
  "data": {
    "userId": "string"
  }
}
```

#### User Status Update

```json
{
  "type": "user_status",
  "data": {
    "userId": "string",
    "isOnline": true,
    "lastSeen": "ISO timestamp"
  }
}
```

#### New Message

```json
{
  "type": "new_message",
  "data": {
    "chatId": "string",
    "message": {
      "id": "string",
      "senderId": "string",
      "text": "string",
      "type": "text",
      "timestamp": "ISO timestamp",
      "status": "sent",
      "replyTo": {
        "id": "string",
        "text": "string"
      }
    }
  }
}
```

#### Message Status Update

```json
{
  "type": "message_status",
  "data": {
    "chatId": "string",
    "messageId": "string",
    "status": "read"
  }
}
```

#### Typing Indicator

```json
{
  "type": "typing",
  "data": {
    "chatId": "string",
    "userId": "string",
    "isTyping": true
  }
}
```

#### Message Reaction

```json
{
  "type": "message_reaction",
  "data": {
    "chatId": "string",
    "messageId": "string",
    "userId": "string",
    "reaction": "string"
  }
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Rate Limiting

API requests are rate-limited to protect the service. The current limits are:

- Authentication endpoints: 10 requests per minute
- General API endpoints: 60 requests per minute
- Media upload: 20 requests per hour

When rate limited, the API will respond with a 429 status code and headers indicating the rate limit and when it resets.

## Localization

The API supports multiple Indian languages including:

- Hindi (hi-IN)
- Tamil (ta-IN)
- Telugu (te-IN)
- Marathi (mr-IN)
- Bengali (bn-IN)
- Gujarati (gu-IN)
- Kannada (kn-IN)
- Malayalam (ml-IN)
- Punjabi (pa-IN)
- Urdu (ur-IN)

Set the preferred language in the user profile to receive content in that language.