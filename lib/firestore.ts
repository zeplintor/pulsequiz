import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  runTransaction,
  Timestamp,
  DocumentReference
} from 'firebase/firestore';
import { db } from './firebase';
import type { GameSession, Player, Track } from './types';

// Generate unique 6-digit PIN
export const generatePin = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a new game session
export const createSession = async (playlist: Track[]): Promise<string> => {
  const pin = generatePin();
  const sessionRef = doc(db, 'sessions', pin);

  const session: GameSession = {
    pin,
    state: 'waiting',
    currentTrack: null,
    currentTrackIndex: -1,
    activeBuzzer: null,
    buzzerLockedAt: null,
    createdAt: Date.now(),
    playlist,
  };

  await setDoc(sessionRef, session);
  return pin;
};

// Get session data
export const getSession = async (pin: string): Promise<GameSession | null> => {
  const sessionRef = doc(db, 'sessions', pin);
  const sessionSnap = await getDoc(sessionRef);

  if (sessionSnap.exists()) {
    return sessionSnap.data() as GameSession;
  }
  return null;
};

// Subscribe to session changes
export const subscribeToSession = (
  pin: string,
  callback: (session: GameSession | null) => void
) => {
  const sessionRef = doc(db, 'sessions', pin);
  return onSnapshot(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as GameSession);
    } else {
      callback(null);
    }
  });
};

// Subscribe to players
export const subscribeToPlayers = (
  pin: string,
  callback: (players: Player[]) => void
) => {
  const playersRef = collection(db, 'sessions', pin, 'players');
  return onSnapshot(playersRef, (snapshot) => {
    const players = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Player[];
    callback(players.sort((a, b) => b.score - a.score));
  });
};

// Add player to session
export const addPlayer = async (pin: string, playerName: string): Promise<string> => {
  const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const playerRef = doc(db, 'sessions', pin, 'players', playerId);

  const player: Player = {
    id: playerId,
    name: playerName,
    score: 0,
    joinedAt: Date.now(),
  };

  await setDoc(playerRef, player);
  return playerId;
};

// Update session state
export const updateSessionState = async (
  pin: string,
  updates: Partial<GameSession>
) => {
  const sessionRef = doc(db, 'sessions', pin);
  await updateDoc(sessionRef, updates as any);
};

// Start next track
export const startNextTrack = async (pin: string) => {
  const session = await getSession(pin);
  if (!session) return;

  const nextIndex = session.currentTrackIndex + 1;
  if (nextIndex >= session.playlist.length) {
    await updateSessionState(pin, { state: 'ended' });
    return;
  }

  await updateSessionState(pin, {
    currentTrackIndex: nextIndex,
    currentTrack: session.playlist[nextIndex],
    state: 'playing',
    activeBuzzer: null,
    buzzerLockedAt: null,
  });
};

// CRITICAL: Buzzer transaction - only first player wins
export const attemptBuzz = async (pin: string, playerId: string): Promise<boolean> => {
  const sessionRef = doc(db, 'sessions', pin);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const sessionDoc = await transaction.get(sessionRef);

      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const session = sessionDoc.data() as GameSession;

      // Check if buzzer is already locked
      if (session.activeBuzzer !== null) {
        return false; // Someone already buzzed
      }

      // Check if game is in playing state
      if (session.state !== 'playing') {
        return false; // Can't buzz when not playing
      }

      // Lock the buzzer for this player
      transaction.update(sessionRef, {
        activeBuzzer: playerId,
        buzzerLockedAt: Date.now(),
      });

      return true; // This player won the buzz
    });

    return result;
  } catch (error) {
    console.error('Buzz transaction failed:', error);
    return false;
  }
};

// Award points to player
export const awardPoints = async (pin: string, playerId: string, points: number) => {
  const playerRef = doc(db, 'sessions', pin, 'players', playerId);
  const playerSnap = await getDoc(playerRef);

  if (playerSnap.exists()) {
    const player = playerSnap.data() as Player;
    await updateDoc(playerRef, {
      score: player.score + points,
    });
  }

  // Reset buzzer
  await updateSessionState(pin, {
    activeBuzzer: null,
    buzzerLockedAt: null,
  });
};

// Reject buzz (wrong answer)
export const rejectBuzz = async (pin: string) => {
  await updateSessionState(pin, {
    activeBuzzer: null,
    buzzerLockedAt: null,
  });
};
