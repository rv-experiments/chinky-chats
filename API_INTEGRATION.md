# SoulLink API Integration Guide

This document provides guidance on how to integrate the SoulLink app with the backend API services.

## API Documentation

The complete API documentation can be found in the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file. This documentation outlines all the endpoints, request/response formats, and authentication mechanisms required for the app to function properly.

## API Integration Architecture

The SoulLink app uses a layered architecture for API integration:

1. **API Client Layer** (`src/api/apiClient.ts`): Handles HTTP requests, authentication, and token management.
2. **API Service Layer** (`src/api/*.ts`): Provides typed functions for interacting with specific API endpoints.
3. **Adapter Layer** (`src/services/adapters/*.ts`): Bridges the gap between the existing service interfaces and the new API implementation.
4. **Service Layer** (`src/services/*.ts`): Provides high-level business logic and maintains backward compatibility.

## Integration Strategy

The app uses an adapter pattern to ensure smooth integration with the backend API:

1. The original service classes (`AuthService`, `ChatService`, etc.) are preserved to maintain compatibility with existing code.
2. New adapter classes with identical interfaces are implemented in the `src/services/adapters` directory.
3. These adapters use the new API services under the hood while maintaining the same interface.
4. This approach allows for a gradual transition to the new API without breaking existing functionality.

## WebSocket Integration

Real-time features like chat messages, typing indicators, and presence updates use WebSockets:

1. The `websocketService` (`src/api/websocketService.ts`) handles the WebSocket connection and event dispatching.
2. It automatically reconnects if the connection is lost.
3. It provides a simple event-based API for subscribing to different types of events.

## Authentication Flow

The authentication flow is as follows:

1. User enters their phone number and their partner's phone number.
2. The app verifies that the partner's number exists in the user's contacts.
3. The app sends a verification code to the user's phone number.
4. User enters the verification code to complete authentication.
5. The app stores the authentication token securely using `EncryptedStorage`.
6. The token is automatically refreshed when it expires.

## Error Handling

The API integration includes robust error handling:

1. Network errors are caught and logged.
2. Authentication errors trigger a logout and redirect to the login screen.
3. API errors are handled gracefully with fallback mechanisms where appropriate.
4. Retry logic is implemented for critical operations.

## Offline Support

The app provides basic offline support:

1. Messages are stored locally and synchronized when the connection is restored.
2. The app can be used in offline mode with limited functionality.
3. The user is notified when the app is operating in offline mode.

## Testing the API Integration

To test the API integration:

1. Use the mock API implementation for development and testing.
2. Switch to the real API by updating the `API_BASE_URL` in `src/api/apiClient.ts`.
3. Run the app and verify that all features work as expected.
4. Test edge cases like network errors, token expiration, and offline mode.

## Security Considerations

The API integration includes several security measures:

1. All API requests use HTTPS.
2. Authentication tokens are stored securely using `EncryptedStorage`.
3. Sensitive data is never logged or stored in plain text.
4. The app verifies that the partner's number exists in the user's contacts before establishing a connection.

## Next Steps

To complete the API integration:

1. Implement the backend API according to the documentation.
2. Update the `API_BASE_URL` in `src/api/apiClient.ts` to point to the real API.
3. Test all features with the real API.
4. Add monitoring and error tracking to detect and fix issues in production.