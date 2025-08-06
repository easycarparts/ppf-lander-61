# Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Prepare your environment variables

## Environment Variables Setup

Your application uses the following environment variables that need to be configured in Vercel:

### Required Environment Variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project

### 2. Configure Project Settings

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 3. Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anonymous key

### 4. Deploy

1. Click **Deploy**
2. Vercel will build and deploy your application
3. Your app will be available at `https://your-project-name.vercel.app`

## Custom Domain (Optional)

1. In your Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### 404 Errors on Routes
- The `vercel.json` file is configured to handle client-side routing
- All routes (including `/admin`) should work correctly
- If you still get 404 errors, check that the `vercel.json` file is in your repository root

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that the build command works locally: `npm run build`
- Review build logs in Vercel dashboard

### Environment Variables
- Make sure all `VITE_` prefixed variables are set in Vercel
- Environment variables are only available at build time for Vite
- Restart deployment after adding new environment variables

## File Structure

```
/
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── src/
│   ├── App.tsx         # Main app component
│   └── pages/          # Route components
└── public/             # Static assets
```

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Preview deployments are created for pull requests
- You can configure branch protection rules in GitHub

## Performance Optimization

The `vercel.json` includes:
- Asset caching headers for better performance
- Proper routing configuration for SPA
- Build optimization settings

## Monitoring

- View deployment status in Vercel dashboard
- Check function logs for serverless functions
- Monitor performance with Vercel Analytics (optional) 