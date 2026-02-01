# 🚀 PulseQuiz - Deployment Guide

## Prerequisites

Before deploying, make sure you have:

1. ✅ Firebase project created
2. ✅ Firestore enabled
3. ✅ Firebase credentials in `.env.local`

## Step 1: Configure Firebase

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "PulseQuiz" (or any name you prefer)
4. Enable Google Analytics (optional)

### Enable Firestore

1. In your Firebase project, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region

### Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register your app
5. Copy the config values to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pulsequiz-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pulsequiz-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pulsequiz-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

### Deploy Firestore Rules

```bash
firebase login
firebase use --add
# Select your project
firebase deploy --only firestore:rules
```

## Step 2: Deploy to Vercel (Recommended)

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? pulsequiz
# - Directory? ./
# - Override settings? No
```

### Add Environment Variables

After deployment, add your Firebase config to Vercel:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
```

Or add them via the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all `NEXT_PUBLIC_FIREBASE_*` variables

### Redeploy

```bash
vercel --prod
```

Your app will be live at `https://pulsequiz.vercel.app` (or your custom domain).

## Step 3: Alternative - Deploy to Netlify

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Build for Static Export

Update `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### Deploy

```bash
# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod

# Follow prompts and select the 'out' directory
```

## Step 4: Alternative - Deploy to Firebase Hosting

### Configure Firebase Hosting

```bash
firebase init hosting

# Select:
# - Public directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds: No
# - Overwrite index.html: No
```

### Build and Deploy

```bash
# Build for static export
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live at `https://your-project-id.web.app`

## 🔒 Important Security Notes

1. **Firestore Rules**: The current rules allow anyone to read/write. For production, implement proper authentication.

2. **Rate Limiting**: Consider adding rate limiting to prevent abuse.

3. **Environment Variables**: Never commit `.env.local` to git (it's already in `.gitignore`).

## 🎯 Post-Deployment Checklist

- [ ] Test creating a host session
- [ ] Test joining as a player from mobile
- [ ] Test the buzzer functionality
- [ ] Verify YouTube videos play correctly
- [ ] Check real-time sync between devices
- [ ] Test on multiple devices simultaneously

## 🐛 Troubleshooting

### "Failed to create session"
- Check Firebase credentials in environment variables
- Verify Firestore is enabled
- Check Firestore rules are deployed

### "YouTube video not playing"
- Ensure video IDs are valid
- Check browser console for YouTube API errors
- Some videos may be restricted from embedding

### "Players not syncing"
- Check internet connection
- Verify Firestore real-time listeners are active
- Check browser console for connection errors

## 📞 Need Help?

- Check the [main README](README.md) for architecture details
- Review [Firebase documentation](https://firebase.google.com/docs)
- Create an issue on [GitHub](https://github.com/zeplintor/pulsequiz/issues)

---

**Ready to party? Let's go!** 🎉
