# Yield Desk Website Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Project Root
```bash
cd /Users/dominikzhang/tokenised-fixed-income
vercel --prod
```

### Step 4: Configure Domain
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Domains
4. Add `yield-desk.com`
5. Add `www.yield-desk.com` (optional)

### Step 5: Update DNS Records
In your domain registrar (where you bought yield-desk.com):

**For yield-desk.com:**
- Type: A
- Name: @
- Value: 76.76.19.61

**For www.yield-desk.com:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

## 🌐 Alternative: Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm i -g netlify-cli
```

### Step 2: Build and Deploy
```bash
cd /Users/dominikzhang/tokenised-fixed-income/apps/web
npm run build
netlify deploy --prod --dir=.next
```

## 🔧 Environment Variables

Create `.env.production` file:
```env
NEXT_PUBLIC_APP_URL=https://yield-desk.com
NEXT_PUBLIC_PRICE_SERVICE_URL=https://your-price-service-url.com
```

## 📁 Project Structure for Deployment

```
tokenised-fixed-income/
├── vercel.json                 # Vercel configuration
├── apps/
│   ├── web/                   # Next.js app
│   └── price-service/         # Backend API
└── packages/
    ├── sdk/                   # TypeScript SDK
    └── contracts/             # Smart contracts
```

## 🎯 Production Checklist

- [ ] Test build locally: `npm run build`
- [ ] Verify all pages load correctly
- [ ] Check responsive design on mobile
- [ ] Test API endpoints
- [ ] Verify logo displays correctly
- [ ] Check all social links work
- [ ] Test portfolio functionality
- [ ] Verify markets page loads

## 🔒 SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## 📊 Monitoring

- Vercel provides built-in analytics
- Monitor performance and uptime
- Set up error tracking if needed

## 🚨 Troubleshooting

### Build Errors
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

### Domain Issues
- Verify DNS propagation (can take 24-48 hours)
- Check domain configuration in Vercel dashboard
- Ensure domain is properly verified

### Performance Issues
- Optimize images
- Check bundle size
- Monitor Core Web Vitals
