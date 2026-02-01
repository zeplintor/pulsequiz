# 🎵 PulseQuiz

**Real-Time Musical Blind Test Platform** - The ultimate party game with instant buzzer battles.

## 🌟 Features

- ⚡ **Lightning-Fast Buzzer System** - Firestore transactions ensure only the first player to buzz wins
- 🎬 **YouTube Integration** - Play audio from YouTube videos while keeping video hidden
- 📱 **Multi-Device Support** - One host screen (TV/computer) + multiple mobile controllers
- 🏆 **Live Scoreboard** - Real-time score tracking with smooth animations
- 🎨 **Neon Cyberpunk Theme** - Stunning dark UI with vibrant neon accents
- 🔄 **Real-Time Sync** - Firebase Firestore powers instant state synchronization

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase Firestore
- **Media**: YouTube IFrame API
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/zeplintor/pulsequiz.git
cd pulsequiz
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

4. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

### For the Host (TV/Computer):

1. Navigate to `/host` or click "HOST GAME" on the homepage
2. Display the **6-digit PIN** on the screen for players to join
3. Wait for players to connect
4. Click **START GAME** when ready
5. Control playback with **PLAY/PAUSE** and **NEXT TRACK** buttons
6. When a player buzzes, validate their answer with **CORRECT** or **WRONG**

### For Players (Mobile):

1. Navigate to `/play` or click "JOIN GAME" on the homepage
2. Enter the **6-digit PIN** and your name
3. Wait for the host to start the game
4. When you recognize the song, **tap the BUZZ button**
5. First player to buzz gets to answer
6. Track your score on the live scoreboard

## 🏗️ Project Structure

```
pulsequiz/
├── app/
│   ├── host/          # TV/Host view
│   ├── play/          # Mobile player view
│   ├── page.tsx       # Landing page
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles + Neon theme
├── components/
│   └── YouTubePlayer.tsx  # YouTube IFrame API wrapper
├── lib/
│   ├── firebase.ts    # Firebase initialization
│   ├── firestore.ts   # Firestore services & buzzer transaction
│   ├── types.ts       # TypeScript interfaces
│   └── dataset.ts     # Default playlist
├── firestore.rules    # Firestore security rules
└── firebase.json      # Firebase configuration
```

## 🔥 Firebase Architecture

### Collections Structure

```
sessions/{pin}
  - state: 'waiting' | 'playing' | 'paused' | 'ended'
  - currentTrack: Track
  - currentTrackIndex: number
  - activeBuzzer: string | null
  - buzzerLockedAt: number | null
  - playlist: Track[]

  players/{playerId}
    - name: string
    - score: number
    - joinedAt: number
```

### Buzzer Transaction Logic

The buzzer uses Firestore transactions to ensure **only the first player wins**:

```typescript
runTransaction(db, async (transaction) => {
  const session = await transaction.get(sessionRef);

  // Check if buzzer is already locked
  if (session.data().activeBuzzer !== null) {
    return false; // Someone already buzzed
  }

  // Lock the buzzer for this player
  transaction.update(sessionRef, {
    activeBuzzer: playerId,
    buzzerLockedAt: Date.now(),
  });

  return true; // This player won!
});
```

## 🎨 Customization

### Adding Your Own Playlist

Edit [lib/dataset.ts](lib/dataset.ts) to customize the song list:

```typescript
export const DEFAULT_PLAYLIST: Track[] = [
  {
    id: 'track_1',
    youtubeId: 'YOUR_YOUTUBE_VIDEO_ID',
    title: 'Song Title',
    artist: 'Artist Name',
  },
  // Add more tracks...
];
```

### Theme Customization

Modify [app/globals.css](app/globals.css) to change neon colors:

```css
:root {
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00ff;
  --neon-purple: #bd00ff;
  /* Customize your colors */
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📝 License

MIT License - feel free to use this project for your own parties and events!

## 🙏 Credits

Built with ❤️ using Claude Code and the latest web technologies.

---

**Have fun and let the music battles begin!** 🎵⚡🏆
