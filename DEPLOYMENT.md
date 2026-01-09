# 🚀 OpsMind-AI Deployment Guide

## Overview
This application requires:
- **Backend** (Node.js/Express API)
- **Worker** (BullMQ background processor)
- **Frontend** (React/Vite SPA)
- **MongoDB Atlas** (Vector database)
- **Redis** (Queue management)

---

## 🎯 Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)
### Option 2: Railway.app
### Option 3: DigitalOcean App Platform
### Option 4: AWS/GCP/Azure

---

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup ✅
- [x] Already configured
- [x] Update vector index (see [MONGODB_INDEX_UPDATE.md](backend/MONGODB_INDEX_UPDATE.md))
- [ ] Whitelist deployment server IPs (or use `0.0.0.0/0` for any IP)

### 2. Get a Redis Instance
Choose one option:

#### Option A: Upstash Redis (Free Tier - Recommended)
1. Go to https://upstash.com
2. Create account → New Database
3. Select **Global** for best performance
4. Copy the **Redis URL** (format: `rediss://default:password@host:port`)

#### Option B: Redis Cloud
1. Go to https://redis.com/try-free
2. Create free database
3. Copy connection URL

#### Option C: Railway Redis
1. Add Redis service in Railway
2. Use provided `REDIS_URL`

---

## 🔧 Environment Variables

### Backend + Worker Environment Variables
```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opsmind?retryWrites=true&w=majority

# Redis (from Upstash or Redis Cloud)
REDIS_URL=rediss://default:your-password@your-redis-host:6379

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-domain.com/api
```

**Important:** The `VITE_API_URL` should include `/api` at the end.

Example values:
- Local: `http://localhost:5000/api`
- Production: `https://opsmind-backend.onrender.com/api`

---

## 🌐 Option 1: Deploy to Render.com (Recommended)

### Step 1: Deploy Backend API

1. **Create New Web Service**
   - Go to https://render.com → New → Web Service
   - Connect your GitHub repo
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or Starter for no spin-down)

2. **Add Environment Variables**
   - Go to Environment tab
   - Add all backend variables from above

3. **Note the Backend URL**
   - Example: `https://opsmind-backend.onrender.com`

### Step 2: Deploy Worker

1. **Create Background Worker**
   - Render → New → Background Worker
   - Same repo, `backend` directory
   - Build Command: `npm install`
   - Start Command: `npm run worker`
   - Use SAME environment variables as backend

### Step 3: Deploy Frontend

1. **Create Static Site**
   - Render → New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variables**
   ```
   VITE_API_URL=https://opsmind-backend.onrender.com/api
   ```

### Step 4: Update CORS

Update backend to allow your frontend domain:

```javascript
// backend/server.js
app.use(cors({
    origin: [
        'http://localhost:5173', // Local dev
        'https://your-frontend.onrender.com', // Production
        process.env.FRONTEND_URL
    ],
    credentials: true
}));
```

---

## 🚂 Option 2: Deploy to Railway.app

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Services

```bash
# Initialize Railway project
railway init

# Add Redis
railway add --plugin redis

# Deploy Backend
cd backend
railway up

# Deploy Worker (separate service)
railway service create worker
railway up

# Deploy Frontend
cd ../frontend
railway up
```

### Step 3: Set Environment Variables
```bash
railway variables set MONGO_URI="your-mongo-uri"
railway variables set GEMINI_API_KEY="your-key"
railway variables set JWT_SECRET="your-secret"
# Redis URL is auto-configured by Railway
```

---

## ☁️ Option 3: DigitalOcean App Platform

### Step 1: Create App

1. Go to https://cloud.digitalocean.com/apps
2. Create App → GitHub repo
3. Detect components automatically

### Step 2: Configure Components

**Backend Service:**
- Type: Web Service
- Source Directory: `/backend`
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: `5000`

**Worker Service:**
- Type: Worker
- Source Directory: `/backend`
- Build Command: `npm install`
- Run Command: `npm run worker`

**Frontend Service:**
- Type: Static Site
- Source Directory: `/frontend`
- Build Command: `npm install && npm run build`
- Output Directory: `dist`

### Step 3: Add Redis
- Add DigitalOcean Managed Redis
- Or use external Redis from Upstash

---

## 🐳 Option 4: Docker Deployment

### Create Docker Files

**backend/Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**backend/Dockerfile.worker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "worker"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml (for local testing):**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis

  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.worker
    environment:
      - MONGO_URI=${MONGO_URI}
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis
      - backend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## ✅ Post-Deployment Verification

### 1. Check Backend Health
```bash
curl https://your-backend-url.com/api/health
```

### 2. Test Redis Connection
- Upload a PDF
- Check worker logs for processing

### 3. Test Full Flow
1. Register a new user
2. Login
3. Upload a PDF
4. Wait for processing (check job status)
5. Ask a question about the document
6. Verify response uses RAG

### 4. Check User Isolation
- Create 2nd user account
- Upload different document
- Verify users can't see each other's documents

---

## 🔒 Security Checklist

- [ ] Use strong `JWT_SECRET` (min 32 random characters)
- [ ] Enable MongoDB IP whitelist (or firewall rules)
- [ ] Use HTTPS for all production URLs
- [ ] Set secure CORS origins (no wildcards `*`)
- [ ] Rotate API keys regularly
- [ ] Use Redis password/TLS (Upstash includes this)
- [ ] Review MongoDB Atlas security settings
- [ ] Set up monitoring and alerts

---

## 📊 Monitoring

### Recommended Tools

**Backend Logs:**
- Render: Built-in logs viewer
- Railway: `railway logs`
- Self-hosted: Winston/Pino → Loki/ELK

**Redis Queue Monitoring:**
```bash
cd backend
node scripts/check-queue.js
```

**Application Monitoring:**
- Sentry.io (errors)
- LogRocket (user sessions)
- Datadog/New Relic (APM)

---

## 🐛 Troubleshooting

### Worker not processing files

**Check:**
1. Worker service is running (separate from API)
2. `REDIS_URL` is identical in both backend and worker
3. Redis connection works: `redis-cli -u $REDIS_URL ping`

### MongoDB connection issues

**Solutions:**
1. Whitelist deployment IPs in Atlas
2. Check connection string format
3. Verify database user permissions

### CORS errors

**Fix:**
1. Update `FRONTEND_URL` in backend env
2. Add frontend domain to CORS whitelist
3. Check browser console for exact origin

### Files not uploading

**Check:**
1. Disk space on server
2. File upload limits in Render/Railway
3. Check `uploads/` directory permissions

---

## 💰 Cost Estimates

### Free Tier (All Free Services)
- **MongoDB Atlas**: Free M0 (512MB)
- **Upstash Redis**: Free (10k commands/day)
- **Render**: Free (3 services, spin down after 15 min)
- **Total**: $0/month
- **Limitation**: Backend cold starts (15s delay)

### Recommended Production Setup
- **MongoDB Atlas**: M2 ($9/month)
- **Upstash Redis**: Free tier sufficient
- **Render**: Starter plan ($7/month per service × 2 = $14)
- **Total**: ~$23/month
- **Benefit**: No cold starts, always-on

### Enterprise Scale
- **MongoDB Atlas**: M10+ ($57+/month)
- **Redis Enterprise**: $5+/month
- **App Platform**: $12+/month
- **Total**: $75+/month

---

## 🔄 Updates and Maintenance

### Update Backend Code
```bash
# Render auto-deploys on git push
git add .
git commit -m "Update backend"
git push origin main
```

### Manual Restart (if needed)
- Render: Dashboard → Manual Deploy
- Railway: `railway up --detach`

### Database Backups
- MongoDB Atlas: Automated backups (configure in Atlas)
- Redis: Use AOF persistence or RDB snapshots

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Upstash Redis**: https://docs.upstash.com/redis

---

## 🎉 Quick Start Commands

After deployment:

```bash
# Check backend
curl https://your-backend.onrender.com/api/auth/health

# Check worker logs
# (in Render dashboard → Background Worker → Logs)

# Test upload
# Use frontend at https://your-frontend.onrender.com
```

**You're ready to deploy! 🚀**
