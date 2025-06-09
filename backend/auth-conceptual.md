# Conceptual Authentication Flow

This document outlines the conceptual authentication mechanism for the RWA Management App.

## User Model (`backend/data/users.js`)

The user data, stored in `backend/data/users.js`, now includes a `password` field for each user object.

**Example User Object:**
```javascript
{
  id: '1',
  mobile: '1234567890',
  role: 'superAdmin',
  name: 'Admin User',
  apartmentId: 'apt1',
  isApproved: true,
  tenantId: 'default-tenant',
  password: 'superadminpass' // In a real application, this MUST be securely hashed and salted.
}
```
For a production environment, passwords should never be stored in plaintext. They must be hashed using a strong algorithm (e.g., bcrypt or Argon2).

## Login Endpoint (`POST /api/auth/login` - Hypothetical)

A dedicated login endpoint would handle user authentication.

*   **Route:** `POST /api/auth/login`
*   **Request Body:** Expects user credentials, typically `mobile` (as username) and `password`.
    ```json
    {
      "mobile": "1234567890",
      "password": "superadminpass"
    }
    ```
*   **Process:**
    1.  Find the user by `mobile` number in the `users` array from `backend/data/users.js`.
    2.  If the user is found, compare the provided `password` with the stored `password`. (In a real system, compare the hash of the provided password with the stored hash).
    3.  If credentials are valid:
        *   Generate a secure token (e.g., JWT - JSON Web Token) or create a server-side session.
        *   The token/session payload should include essential user identifiers: `userId` (user's `id`), `role`, and `tenantId`.
        *   Return the token to the client or set a session cookie.
    4.  If credentials are invalid or the user is not found, return an appropriate error (e.g., 401 Unauthorized).

## Authentication Middleware (Hypothetical)

This middleware component would protect all restricted API routes.

*   **Purpose:** To verify the authenticity of incoming requests.
*   **Mechanism:**
    1.  For each request to a protected route, the middleware inspects for a token (e.g., in the `Authorization` header for JWT) or a session identifier (e.g., in cookies).
    2.  It validates the token/session (e.g., checks signature, expiry for JWT; verifies session ID against a session store).
    3.  If valid, it decodes/retrieves the user information (`userId`, `role`, `tenantId`).
    4.  It then populates the `req.user` object with this information: `req.user = { id: 'someUserId', role: 'userRole', tenantId: 'userTenantId' };`.
    5.  If the token/session is invalid, missing, or expired, the middleware returns a `401 Unauthorized` error, preventing access to the route.

## `req.user` Object

All API routes that require authentication and perform tenant-aware or role-based operations (as implemented in Step 3 of the overall plan) rely on the `req.user` object. This object is expected to be populated by the Authentication Middleware *before* the request handlers in `backend/routes/*.js` are executed. The `req.user.id`, `req.user.role`, and `req.user.tenantId` properties are crucial for authorization and data filtering logic within these routes.

**Example `req.user` object:**
```javascript
// Populated by authentication middleware
req.user = {
  id: '1', // Corresponds to the user's id
  role: 'superAdmin',
  tenantId: 'default-tenant'
};
```
