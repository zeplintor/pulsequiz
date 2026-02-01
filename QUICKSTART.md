# ⚡ Quick Start Guide

Get PulseQuiz running in 5 minutes!

## 1. Configure Firebase (Required)

You need Firebase credentials to use PulseQuiz. Here's how:

### Option A: Use Your Own Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**
4. Get your config from Project Settings
5. Update `.env.local` with your credentials

### Option B: Test with Mock Data (Development Only)

For quick local testing without Firebase:

```bash
# Install Firebase emulator
npm install -g firebase-tools
firebase init emulators

# Start emulator
firebase emulators:start
```

Then update `lib/firebase.ts` to use emulator (for dev only).

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Copy your Firebase credentials to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Deploy Firestore Rules

```bash
firebase login
firebase deploy --only firestore:rules
```

## 5. Start Development Server

```bash
npm run dev
```

Open:
- **Host View**: http://localhost:3000/host
- **Player View**: http://localhost:3000/play (on your phone)

## 🎮 Test the Game

### On Your Computer:
1. Open http://localhost:3000/host
2. Note the 6-digit PIN

### On Your Phone:
1. Connect to same WiFi
2. Open http://YOUR_COMPUTER_IP:3000/play
3. Enter the PIN and your name
4. Hit that BUZZ button!

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment.

## 💡 Tips

- Use your computer's local IP for phone testing
- Make sure both devices are on the same network
- YouTube videos need internet connection
- Test with 2-4 players for best experience

## 🎵 Customize Playlist

Edit `lib/dataset.ts` to add your own songs!

---

**Let's get the party started!** 🎉
