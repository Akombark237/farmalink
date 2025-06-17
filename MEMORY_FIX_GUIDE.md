# 🚀 Memory Allocation Error Fix Guide

## Error: `memory allocation of 90864192 bytes failed`

This error occurs when Next.js runs out of memory during compilation. Here are multiple solutions to fix this issue:

## ✅ **Solutions Applied**

### 1. **Updated Package.json Scripts**
```json
{
  "scripts": {
    "dev": "node --max-old-space-size=4096 node_modules/next/dist/bin/next dev",
    "dev-safe": "cross-env NODE_OPTIONS=\"--max-old-space-size=4096\" next dev",
    "dev-memory-safe": "node --max-old-space-size=2048 --max-semi-space-size=64 node_modules/next/dist/bin/next dev"
  }
}
```

### 2. **Environment Variables Added (.env.local)**
```bash
NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=128"
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=true
FAST_REFRESH=true
```

### 3. **Next.js Configuration Optimized**
- Created `next.config.js` with memory optimizations
- Disabled unnecessary features in development
- Optimized webpack configuration

## 🔧 **Try These Commands (In Order)**

### Option 1: Memory-Safe Development
```bash
npm run dev-memory-safe
```

### Option 2: Cross-Platform Safe
```bash
npm run dev-safe
```

### Option 3: Manual with Lower Memory
```bash
node --max-old-space-size=1024 node_modules/next/dist/bin/next dev
```

### Option 4: Minimal Memory Usage
```bash
node --max-old-space-size=512 --max-semi-space-size=16 node_modules/next/dist/bin/next dev
```

## 🛠️ **Additional Fixes**

### 1. **Clear Cache and Rebuild**
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try starting again
npm run dev-memory-safe
```

### 2. **Reduce Project Size**
```bash
# Remove unnecessary files
rm -rf .next
rm -rf dist
rm -rf build

# Clean up large files
node scripts/memory-fix.js
```

### 3. **System-Level Fixes**

#### Windows:
```cmd
# Increase virtual memory
# Go to: System Properties > Advanced > Performance Settings > Advanced > Virtual Memory
# Set custom size: Initial 4096 MB, Maximum 8192 MB

# Close unnecessary applications
# Restart your computer
```

#### macOS/Linux:
```bash
# Check available memory
free -h

# Close unnecessary applications
# Restart terminal
```

### 4. **Alternative Development Approaches**

#### A. Use Development Mode with Reduced Features
```bash
# Create a minimal dev script
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=1024" next dev
```

#### B. Use Production Build for Testing
```bash
# Build once
npm run build

# Start production server (uses less memory)
npm start
```

#### C. Use Incremental Development
```bash
# Work on one page at a time
# Comment out unused imports
# Reduce component complexity temporarily
```

## 🎯 **Specific Fixes for Your Project**

### 1. **Reduce OpenStreetMap Bundle Size**
```javascript
// In src/components/OpenStreetMap.tsx
// Use dynamic imports to reduce initial bundle
const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});
```

### 2. **Optimize API Routes**
```javascript
// Reduce mock data size in API routes
// Load data on-demand instead of all at once
```

### 3. **Component Optimization**
```javascript
// Use React.memo for heavy components
// Implement lazy loading for large lists
// Reduce re-renders with useMemo and useCallback
```

## 🚨 **Emergency Solutions**

### 1. **Minimal Development Server**
Create a simple server for testing:
```bash
# Install serve globally
npm install -g serve

# Build the project
npm run build

# Serve the built files
serve -s .next/static
```

### 2. **Use Different Port**
```bash
# Sometimes port conflicts cause memory issues
npm run dev -- -p 3001
```

### 3. **Disable Hot Reload**
```bash
# Add to .env.local
FAST_REFRESH=false
```

## 📊 **Memory Usage Monitoring**

### Check Current Usage:
```bash
node scripts/memory-fix.js
```

### Monitor During Development:
```bash
# Windows
tasklist | findstr node

# macOS/Linux
ps aux | grep node
```

## 🔄 **Step-by-Step Troubleshooting**

1. **First, try the memory-safe script:**
   ```bash
   npm run dev-memory-safe
   ```

2. **If that fails, clear everything:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev-memory-safe
   ```

3. **If still failing, use minimal settings:**
   ```bash
   node --max-old-space-size=512 node_modules/next/dist/bin/next dev
   ```

4. **Last resort - use production build:**
   ```bash
   npm run build
   npm start
   ```

## ✅ **Success Indicators**

You'll know it's working when you see:
```
✓ Ready in 2.3s
✓ Local: http://localhost:3000
✓ Network: http://192.168.x.x:3000
```

## 🎉 **After It's Working**

1. Test the search functionality
2. Test the OpenStreetMap integration
3. Verify Cameroon pharmacy data
4. Check mobile responsiveness

## 📞 **If Nothing Works**

Consider these alternatives:
1. Use a different development machine with more RAM
2. Use GitHub Codespaces or similar cloud development environment
3. Develop in smaller chunks (comment out large components temporarily)
4. Use a simpler development setup without heavy dependencies

---

**Remember:** This is a common issue with large Next.js projects. The solutions above should resolve the memory allocation error and get your PharmaLink project running smoothly! 🚀
