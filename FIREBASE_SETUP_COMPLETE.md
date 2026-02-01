# 🔥 Firebase Setup Complete!

## ✅ Configuration Terminée

Ton projet **PulseQuiz** est maintenant entièrement configuré et opérationnel avec Firebase !

## 📋 Informations du Projet

**Project ID**: `pulsequiz-1769969796`

**Console Firebase**: https://console.firebase.google.com/project/pulsequiz-1769969796

**Firestore Database**: ✅ Activé et configuré (région: us-central1)

**Web App**: ✅ Créé et configuré

## 🔐 Variables d'Environnement

Ton fichier `.env.local` a été automatiquement configuré avec :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBdrI9WERI1XziTNSUZ0RXUd8yZ__QAO3w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pulsequiz-1769969796.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pulsequiz-1769969796
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pulsequiz-1769969796.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=301410203744
NEXT_PUBLIC_FIREBASE_APP_ID=1:301410203744:web:36b01bb8f6b21eeb836b05
```

⚠️ **Note**: Le fichier `.env.local` est déjà dans `.gitignore` - ne le commit jamais !

## 🎮 Comment Tester

### 1. Le serveur de développement est déjà lancé

Accède à l'application :
- **Landing Page**: http://localhost:3000
- **Host (Écran TV)**: http://localhost:3000/host
- **Play (Mobile)**: http://localhost:3000/play

### 2. Test en Local

#### Sur ton ordinateur:
1. Ouvre http://localhost:3000/host
2. Note le **PIN à 6 chiffres** affiché à l'écran

#### Sur ton téléphone (même WiFi):
1. Trouve l'IP de ton ordinateur :
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. Sur ton téléphone, ouvre : `http://TON_IP:3000/play`
3. Entre le PIN et ton nom
4. Appuie sur BUZZ quand la musique joue !

## 🚀 Structure Firestore Créée

```
sessions/{pin}
  ├── state: 'waiting' | 'playing' | 'paused' | 'ended'
  ├── currentTrack: Track
  ├── currentTrackIndex: number
  ├── activeBuzzer: string | null
  ├── buzzerLockedAt: number | null
  ├── playlist: Track[]
  └── players/{playerId}
      ├── name: string
      ├── score: number
      └── joinedAt: number
```

## 📊 Firestore Rules Déployées

Les règles de sécurité ont été déployées automatiquement :
- ✅ Lecture/écriture autorisée pour les sessions
- ✅ Lecture/écriture autorisée pour les joueurs
- ❌ Suppression interdite (pour éviter les abus)

## 🎵 Playlist de Test

5 chansons populaires sont déjà configurées dans `lib/dataset.ts`:
1. Never Gonna Give You Up - Rick Astley
2. Despacito - Luis Fonsi
3. Gangnam Style - PSY
4. Uptown Funk - Mark Ronson
5. Waka Waka - Shakira

## 🌐 Prêt pour le Déploiement

### Option 1: Vercel (Recommandé)

```bash
# Install Vercel CLI si nécessaire
npm install -g vercel

# Deploy
vercel

# Configure les variables d'environnement dans Vercel Dashboard
# Puis redéploie en production
vercel --prod
```

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📂 Fichiers Importants

- `lib/firebase.ts` - Configuration Firebase
- `lib/firestore.ts` - Services Firestore + Transaction Buzzer
- `lib/dataset.ts` - Playlist de chansons
- `firestore.rules` - Règles de sécurité Firestore
- `firebase.json` - Configuration Firebase
- `.firebaserc` - Projet Firebase sélectionné

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Build pour production
npm run build

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Voir la console Firebase
open https://console.firebase.google.com/project/pulsequiz-1769969796

# Lancer le script de setup
./setup-firebase.sh
```

## 🎯 Prochaines Étapes Suggérées

1. **Teste le jeu en local** avec plusieurs devices
2. **Personnalise la playlist** dans `lib/dataset.ts`
3. **Déploie sur Vercel** pour tester en production
4. **Partage avec tes amis** et organise une soirée blind test !

## 🐛 Debug

Si tu rencontres des problèmes :

1. **Vérifie la console du navigateur** (F12)
2. **Vérifie la console Firebase** pour les erreurs Firestore
3. **Assure-toi que les deux devices sont sur le même réseau**
4. **Vérifie que le serveur de dev tourne** (`npm run dev`)

## 📞 Ressources

- **GitHub Repo**: https://github.com/zeplintor/pulsequiz
- **Firebase Console**: https://console.firebase.google.com/project/pulsequiz-1769969796
- **Documentation**: Voir README.md et DEPLOYMENT.md

---

## 🎉 C'est Prêt !

Ton application PulseQuiz est **100% fonctionnelle** et prête à être utilisée !

**Le serveur de développement est déjà lancé sur http://localhost:3000**

Ouvre simplement ton navigateur et commence à jouer ! 🎵⚡🏆

---

*Créé avec ❤️ par Claude Code*
