# ⚙️ Environment Configuration Guide

## Overview
All API URLs in the frontend are now configured through environment variables. This makes it easy to switch between development and production environments.

## What Changed

### ✅ Before (Hardcoded URLs)
```javascript
// URLs were hardcoded throughout the app
axios.post('http://localhost:5000/api/auth/login', data);
axios.get('http://localhost:5000/api/chat', config);
```

### ✅ After (Environment Variables)
```javascript
// Centralized configuration
import api from '../config/axios';
api.post('/auth/login', data);
api.get('/chat', config);
```

## Files Created

### 1. `frontend/.env`
Contains the API URL for your environment:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. `frontend/.env.example`
Template for other developers:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. `frontend/src/config/axios.js`
Centralized axios configuration with:
- Automatic base URL from environment
- Token injection for all requests
- Global error handling (401 redirects)
- Support for EventSource (SSE streaming)

## Updated Components

All components now use the configured `api` instance:

- ✅ `AuthContext.jsx` - Login/Register
- ✅ `ChatHistory.jsx` - Conversation history
- ✅ `Dashboard.jsx` - Main dashboard
- ✅ `UnifiedChat.jsx` - Chat with streaming
- ✅ `ChatWithHistory.jsx` - Chat with history
- ✅ `StreamingChat.jsx` - Streaming responses
- ✅ `AskForm.jsx` - Ask questions
- ✅ `UploadForm.jsx` - File uploads

## Environment Setup

### Local Development
```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### Production (Render)
```env
# frontend/.env
VITE_API_URL=https://opsmind-backend.onrender.com/api
```

### Production (Railway)
```env
# frontend/.env
VITE_API_URL=https://opsmind-backend.up.railway.app/api
```

### Production (Custom Domain)
```env
# frontend/.env
VITE_API_URL=https://api.opsmind.com/api
```

## How It Works

### 1. API Instance Creation
```javascript
// config/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
```

### 2. Request Interceptor (Auto Token)
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Response Interceptor (Auto Logout)
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. SSE Streaming Support
```javascript
// Exported for EventSource (needs absolute URL)
export const STREAM_URL = `${baseURL.replace('/api', '')}/api/stream`;

// Usage in components
const eventSource = new EventSource(`${STREAM_URL}?query=${query}&token=${token}`);
```

## Benefits

### 🎯 Single Configuration Point
Change the API URL once in `.env`, it updates everywhere.

### 🔐 Automatic Authentication
Token is automatically added to all requests via interceptor.

### 🚫 Automatic Error Handling
401 errors automatically redirect to login.

### 🌍 Environment-Specific URLs
Different URLs for dev, staging, and production.

### 📦 No Manual Token Management
No need to manually add `Authorization` headers.

## Deployment Steps

### 1. Update Frontend Environment
On your deployment platform (Render, Railway, etc.), set:
```
VITE_API_URL=https://your-backend-url.com/api
```

### 2. Rebuild Frontend
The environment variable is embedded at build time:
```bash
npm run build
```

### 3. Deploy
The built files will use the production API URL.

## Important Notes

⚠️ **Vite Environment Variables:**
- Must start with `VITE_` to be exposed to the browser
- Are embedded at **build time**, not runtime
- Must rebuild after changing `.env`

⚠️ **API URL Format:**
- Always include `/api` at the end
- Don't include trailing slash
- Example: `http://localhost:5000/api` ✅
- Example: `http://localhost:5000/api/` ❌

⚠️ **EventSource (SSE):**
- Requires absolute URL (not relative)
- Uses `STREAM_URL` export from axios config
- Token passed as query parameter (EventSource doesn't support headers)

## Testing

### Test Local Setup
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start worker
cd backend
npm run worker

# 3. Start frontend
cd frontend
npm run dev
```

### Test Production Build Locally
```bash
cd frontend
npm run build
npm run preview
```

### Verify API Connection
Open browser console and check:
- Network tab shows requests to correct URL
- No CORS errors
- Authorization header is present
- 401 errors redirect to login

## Troubleshooting

### Issue: API calls fail with CORS error
**Solution:** Check backend CORS configuration allows your frontend URL

### Issue: 401 errors don't redirect
**Solution:** Clear localStorage and cookies, then try again

### Issue: Environment variable not updating
**Solution:** 
1. Stop dev server
2. Update `.env`
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Production build uses wrong URL
**Solution:**
1. Set `VITE_API_URL` in deployment platform
2. Trigger new build
3. Verify in deployed files

---

**You're all set!** 🎉 Your frontend now uses environment variables for all API endpoints.
