# Quick Command Reference - GitHub & Deployment

## Push to GitHub (First Time)

```bash
cd d:\FINAL FRONTEND\nucareer-frontend-A5 edit\frontend

# Initialize and commit
git init
git add .
git commit -m "Initial commit: NUCareer frontend"

# Set main branch and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nucareer-frontend.git
git push -u origin main
```

## Regular Updates (After First Push)

```bash
# After making changes:
git add .
git commit -m "Describe your changes here"
git push
```

## Test Locally Before Deploying

```bash
npm install
npm run build
npm start
# Visit http://localhost:3000
```

## Generate NEXTAUTH_SECRET

```bash
# Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32)))

# Or use OpenSSL (if installed):
openssl rand -base64 32
```

## Environment Variables to Set (on Vercel)

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_value
GOOGLE_CLIENT_SECRET=your_value
NEXTAUTH_SECRET=your_value
BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_GEMINI_API_KEY=your_value
```

## Production Checklist

- [ ] Removed hardcoded localhost URLs
- [ ] Set correct BACKEND_URL for production
- [ ] Updated Google OAuth authorized URIs
- [ ] Generated new NEXTAUTH_SECRET
- [ ] Tested build locally: `npm run build`
- [ ] All environment variables in `.env.example`
- [ ] `.env.local` in `.gitignore`
- [ ] README.md has setup instructions

## Deployment Platform Links

- **Vercel**: https://vercel.com (Recommended)
- **Netlify**: https://app.netlify.com
- **GitHub Pages**: https://pages.github.com
- **Heroku**: https://www.heroku.com

## Files Prepared for GitHub

✅ `.env.example` - Environment template
✅ `.gitignore` - Git ignore rules  
✅ `.vercelignore` - Vercel optimization
✅ `next.config.js` - Production config
✅ `package.json` - Build scripts
✅ `README.md` - Project documentation
✅ `DEPLOYMENT.md` - Setup guide
✅ `GITHUB_DEPLOYMENT_GUIDE.md` - Full deployment steps
✅ `READY_FOR_GITHUB.md` - Quickstart summary
✅ `.github/workflows/deploy.yml` - CI/CD pipeline

## Troubleshooting

**Build fails locally?**
```bash
rm -r node_modules package-lock.json
npm install
npm run build
```

**Port 3000 in use?**
```bash
npm start -- -p 3001
```

**Environment variables not working?**
- Restart dev server
- Check variable names for typos
- Ensure `NEXT_PUBLIC_` prefix for client-side vars

## Support

See `GITHUB_DEPLOYMENT_GUIDE.md` for comprehensive deployment help.
