# Production Environment Configuration Guide

This file documents how to set production environment variables when deploying.

## Deployment Platform Instructions

### Vercel (Recommended)
1. Go to your project settings → Environment Variables
2. Add each variable from `.env.example`:
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXTAUTH_SECRET
   - BACKEND_URL (production backend)
   - NEXT_PUBLIC_GEMINI_API_KEY

3. Set which environments they apply to: Production, Preview, Development

### Netlify
1. Build settings → Environment
2. Add variables in Key/Value format

### Docker/Self-Hosted
Use `docker run -e NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx ...`

## Important Security Notes

⚠️ **NEVER** commit real API keys to Git
✓ Always use platform environment variable management
✓ Rotate secrets regularly
✓ Use different keys for dev/staging/production

## Backend URL for Different Environments

- **Development**: `http://localhost:5000`
- **Staging**: `https://staging-api.youromain.com`
- **Production**: `https://api.yourdomain.com`

## Google OAuth Setup

1. Create OAuth credentials in Google Cloud Console
2. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
3. Copy credentials to environment variables
