# Development Setup Guide

## Fake User Testing Configuration

This guide helps you set up fake user authentication for seamless testing of the MERN blog application.

### Frontend Configuration

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Fake User Configuration for Development
# Set to 'true' to enable fake user mode for testing
VITE_USE_FAKE_USER=true

# Fake User ID (must match backend FAKE_USER_ID)
VITE_FAKE_USER_ID=507f1f77bcf86cd799439011
```

### Backend Configuration

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-blog

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Fake Authentication for Development
# Set to 'true' to enable fake user authentication
USE_FAKE_AUTH=true

# Fake User ID (must match frontend VITE_FAKE_USER_ID)
FAKE_USER_ID=507f1f77bcf86cd799439011
```

### How It Works

1. **Frontend**: When `VITE_USE_FAKE_USER=true`, the AuthContext automatically sets a fake user
2. **Backend**: When `USE_FAKE_AUTH=true`, the fakeAuth middleware creates/uses a fake user for API calls
3. **Seamless Testing**: You can create posts, edit posts, and test all functionality without real authentication

### Testing Features

With fake user enabled, you can:

- ✅ Create new posts without logging in
- ✅ Edit existing posts
- ✅ View all posts
- ✅ Test the complete application flow
- ✅ Bypass authentication requirements

### Switching to Real Authentication

To use real authentication:

1. Set `VITE_USE_FAKE_USER=false` in frontend .env
2. Set `USE_FAKE_AUTH=false` in backend .env
3. Restart both frontend and backend servers

### API Endpoints That Work with Fake User

- `POST /api/posts` - Create posts (uses fake user as author)
- `PUT /api/posts/:id` - Update posts (uses fake user as author)
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post
- `GET /api/categories` - Get categories

### Troubleshooting

1. **User ID Mismatch**: Ensure `VITE_FAKE_USER_ID` and `FAKE_USER_ID` are identical
2. **API Calls Failing**: Check that both frontend and backend are using fake auth
3. **Database Issues**: The fake user will be created automatically in the database
