export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  joinedAt: number;
}

export interface GameSession {
  pin: string;
  state: 'waiting' | 'playing' | 'paused' | 'ended';
  currentTrack: Track | null;
  currentTrackIndex: number;
  activeBuzzer: string | null; // Player ID who buzzed first
  buzzerLockedAt: number | null;
  createdAt: number;
  playlist: Track[];
}
