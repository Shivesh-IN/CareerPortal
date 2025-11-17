# GitHub & Hosting Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Setup
- [x] `.env.example` created with all required variables
- [x] `.gitignore` configured to exclude sensitive files
- [x] `.env.local` is in `.gitignore` (won't be committed)
- [x] `node_modules/` is in `.gitignore`
- [x] `.next/` build folder is in `.gitignore`

### Code Quality
- [ ] Remove console.log() statements from production code
- [ ] Fix any TypeScript/ESLint errors: `npm run lint`
- [ ] Test build locally: `npm run build`
- [ ] Test production server: `npm start`

### Configuration
- [x] `next.config.js` updated with security headers
- [x] `package.json` has all deployment scripts
- [x] `README.md` has setup instructions
- [ ] `DEPLOYMENT.md` reviewed for your platform choice

---

## 🚀 Quick Start: Upload to GitHub

### Step 1: Initialize Git Repository
```bash
cd d:\FINAL FRONTEND\nucareer-frontend-A5 edit\frontend
git init
git add .
git commit -m "Initial commit: NUCareer frontend setup"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `nucareer-frontend`
3. Choose **Private** or **Public**
4. Don't initialize with README (we have one)
5. Click "Create repository"

### Step 3: Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nucareer-frontend.git
git push -u origin main
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free for Next.js)
**Best for:** Next.js applications, automatic deployments, zero-config

**Steps:**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your GitHub repo
5. Set environment variables in dashboard
6. Click "Deploy"
7. Your site will be at `https://yourdomain.vercel.app`

**Advantages:**
- ✅ Free tier available
- ✅ Automatic deployments on git push
- ✅ Built-in CDN & SSL
- ✅ Preview URLs for pull requests

---

### Option 2: Netlify (Free Alternative)
**Best for:** Static sites, but works with Next.js SSR

**Steps:**
1. Go to https://app.netlify.com
2. Connect GitHub account
3. Select repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy

---

### Option 3: GitHub Pages (SSG Only)
⚠️ **Requires static export** - needs changes to your code

```bash
# Add to package.json scripts:
"export": "next build && next export"
```

**Steps:**
1. `npm run export`
2. Deploy `out/` folder to GitHub Pages
3. Settings → Pages → Deploy from branch

---

### Option 4: Docker + Self-Hosted

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t nucareer-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx \
  -e BACKEND_URL=https://api.yourdomain.com \
  nucareer-frontend
```

---

## 🔐 Critical: Environment Variables Setup

### Before Pushing to GitHub
1. ✅ Make sure `.env.local` is in `.gitignore`
2. ✅ Never commit real API keys
3. ✅ Use `.env.example` as template only

### After Deploying
**For Vercel:**
1. Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Select which environments (Production, Preview, Development)

**For Netlify:**
1. Site Settings → Build & Deploy → Environment
2. Add as Key=Value pairs

---

## 📝 Environment Variables Needed

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=generate_random_string_here
BACKEND_URL=https://your-backend-api.com
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### How to Generate NEXTAUTH_SECRET
```bash
# Run in terminal
openssl rand -base64 32
```

---

## 🧪 Testing Before Deployment

```bash
# 1. Install dependencies
npm install

# 2. Check for errors
npm run lint

# 3. Build for production
npm run build

# 4. Start production server
npm start

# 5. Visit http://localhost:3000
```

If no errors appear, you're ready to deploy!

---

## 🐛 Troubleshooting

**Issue:** "Environment variable not found"
- **Solution:** Restart your build/server after adding variables

**Issue:** "Port 3000 already in use"
- **Solution:** `npm start -- -p 3001`

**Issue:** Google OAuth not working
- **Solution:** Check authorized redirect URIs in Google Cloud Console

**Issue:** API calls failing in production
- **Solution:** Ensure `BACKEND_URL` is correct production URL

---

## ✨ After Deployment

1. **Test all features:**
   - Login/signup
   - API calls
   - File uploads
   - Third-party integrations

2. **Monitor:**
   - Check Vercel Analytics
   - Monitor error logs
   - Track performance

3. **Update GitHub repo settings:**
   - Add description
   - Add topics/tags
   - Link to live site

---

## 📞 Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
