# TengaPesa Survey - Offline & Caching Solution

This document explains the offline functionality and caching mechanisms implemented to ensure your survey is always available, even when the Render service is spinning up.

## 🚀 Features Implemented

### 1. Service Worker (Offline Caching)
- **File**: `public/sw.js`
- **Purpose**: Caches static assets and enables offline functionality
- **Features**:
  - Caches all static files (CSS, JS, images) for offline access
  - Implements background sync for survey submissions
  - Provides fallback for failed network requests
  - Automatically updates when new versions are deployed

### 2. Keep-Alive Mechanism
- **File**: `server.cjs`
- **Purpose**: Prevents Render from spinning down due to inactivity
- **Features**:
  - Self-pinging every 4 minutes when no activity detected
  - Enhanced health check endpoint with detailed metrics
  - Graceful shutdown handling
  - Memory and uptime monitoring

### 3. Offline Survey Submission
- **Files**: `src/services/feedbackService.ts`, `src/hooks/use-offline.ts`
- **Purpose**: Allows users to complete surveys even when offline
- **Features**:
  - Local storage fallback for survey responses
  - Automatic retry with exponential backoff
  - Background sync when connection is restored
  - Visual indicators for online/offline status
  - Pending submissions counter

### 4. Enhanced Caching Headers
- **File**: `server.cjs`
- **Purpose**: Optimizes loading speed and reduces server load
- **Features**:
  - 1-year cache for static assets (CSS, JS, images)
  - 5-minute cache for HTML files
  - Immutable cache for versioned assets
  - Gzip compression for faster loading

## 🔧 How It Works

### For Survey Takers

1. **Online Experience**:
   - Survey loads instantly from cache
   - Responses submitted immediately to Supabase
   - Real-time feedback on submission status

2. **Offline Experience**:
   - Survey still fully functional
   - Responses saved locally in browser storage
   - Visual indicator shows offline status
   - Automatic submission when connection restored

3. **Mixed Experience**:
   - If server is spinning up, responses are queued
   - Background sync processes pending submissions
   - No data loss even during server transitions

### For Administrators

1. **Service Monitoring**:
   - Health check endpoint: `/healthz`
   - Keep-alive endpoint: `/keep-alive`
   - Detailed metrics including uptime and memory usage

2. **External Monitoring**:
   - Use `keep-alive.js` script for external monitoring
   - Can be run on any server to ping your service
   - Configurable ping intervals

## 📱 User Interface Updates

### Offline Status Indicator
- Shows current connection status
- Displays number of pending submissions
- Color-coded (green for online, orange for offline)

### Enhanced Feedback Messages
- Different messages for online vs offline submissions
- Clear indication when responses are saved locally
- Automatic processing notifications

## 🛠️ Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=8080
SERVICE_URL=https://your-app.onrender.com  # For external monitoring
```

### Render Configuration
- Health check grace period: 300s
- Health check timeout: 30s
- Automatic deployment enabled

## 📊 Monitoring & Maintenance

### Health Check Endpoints
- `GET /healthz` - Basic health check for Render
- `GET /keep-alive` - Detailed service status
- `POST /api/submit-feedback` - API endpoint for submissions

### External Monitoring
Run the keep-alive script on any server:
```bash
node keep-alive.js
```

Or set up a cron job:
```bash
# Ping every 4 minutes
*/4 * * * * curl -s https://your-app.onrender.com/keep-alive > /dev/null
```

## 🔄 Background Sync Process

1. **When Offline**:
   - Survey responses stored in localStorage
   - Service worker queues submissions
   - Visual indicator shows pending count

2. **When Online**:
   - Service worker processes queued submissions
   - Retry logic with exponential backoff
   - Successful submissions removed from queue
   - UI updates to reflect current status

3. **Error Handling**:
   - Failed submissions remain in queue
   - Automatic retry on next connection
   - User notification of submission status

## 🚨 Troubleshooting

### Common Issues

1. **Service Still Spinning Down**:
   - Check if keep-alive mechanism is working
   - Verify health check endpoint responds
   - Consider external monitoring

2. **Offline Mode Not Working**:
   - Check if service worker is registered
   - Verify browser supports service workers
   - Check console for errors

3. **Submissions Not Syncing**:
   - Check network connectivity
   - Verify Supabase configuration
   - Check browser storage limits

### Debug Commands
```bash
# Check service status
curl https://your-app.onrender.com/healthz

# Test keep-alive
curl https://your-app.onrender.com/keep-alive

# Check service worker registration
# Open browser dev tools > Application > Service Workers
```

## 📈 Performance Benefits

1. **Faster Loading**:
   - Static assets cached for 1 year
   - Gzip compression reduces file sizes
   - Service worker provides instant loading

2. **Reduced Server Load**:
   - Cached responses reduce database queries
   - Background sync spreads load over time
   - Keep-alive prevents unnecessary spin-ups

3. **Better User Experience**:
   - Survey works offline
   - No data loss during connectivity issues
   - Clear status indicators

## 🔒 Security Considerations

1. **Data Protection**:
   - Local storage is browser-specific
   - No sensitive data in service worker
   - Encrypted transmission to Supabase

2. **CORS Configuration**:
   - Proper headers for API requests
   - Secure content type handling
   - XSS protection enabled

## 📝 Next Steps

1. **Monitor Performance**:
   - Track submission success rates
   - Monitor service uptime
   - Analyze user behavior patterns

2. **Optimize Further**:
   - Implement push notifications for sync completion
   - Add more detailed error reporting
   - Consider implementing app-like features

3. **Scale Considerations**:
   - Monitor database performance
   - Consider CDN for static assets
   - Implement rate limiting if needed

This solution ensures your survey is always accessible and provides a seamless experience for users, regardless of server status or connectivity issues.
