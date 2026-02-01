'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Check, X, Users, Search, Music, TrendingUp, Star, Trophy, Sparkles } from 'lucide-react';
import YouTubePlayer from '@/components/YouTubePlayer';
import { createSession, subscribeToSession, subscribeToPlayers, awardPoints, rejectBuzz, updateSessionState } from '@/lib/firestore';
import type { GameSession, Player, Track } from '@/lib/types';

export default function HostPage() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [trendingVideos, setTrendingVideos] = useState<Track[]>([]);

  useEffect(() => {
    initializeSession();
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await fetch('/api/trending');
      const data = await response.json();
      if (data.success) setTrendingVideos(data.results);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const initializeSession = async () => {
    try {
      const newPin = await createSession([]);
      setPin(newPin);
      setLoading(false);
    } catch (error) {
      console.error('Failed to create session:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pin) return;
    const unsubSession = subscribeToSession(pin, setSession);
    const unsubPlayers = subscribeToPlayers(pin, setPlayers);
    return () => { unsubSession(); unsubPlayers(); };
  }, [pin]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success) setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectVideo = async (video: any) => {
    if (!pin) return;
    const track: Track = {
      id: video.id,
      youtubeId: video.youtubeId,
      title: video.title,
      artist: video.artist,
    };
    await updateSessionState(pin, {
      currentTrack: track,
      currentTrackIndex: 0,
      state: 'playing',
      activeBuzzer: null,
      buzzerLockedAt: null,
      playlist: [track],
    });
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUseTrending = async () => {
    if (!pin || trendingVideos.length === 0) return;
    const randomVideo = trendingVideos[Math.floor(Math.random() * trendingVideos.length)];
    await handleSelectVideo(randomVideo);
  };

  const handlePlayPause = async () => {
    if (!pin || !session) return;
    await updateSessionState(pin, { state: session.state === 'playing' ? 'paused' : 'playing' });
  };

  const handleCorrect = async () => {
    if (!pin || !session?.activeBuzzer) return;
    await awardPoints(pin, session.activeBuzzer, 100);
    setTimeout(() => setShowSearchModal(true), 5000);
  };

  const handleIncorrect = async () => {
    if (!pin || !session?.activeBuzzer) return;
    await rejectBuzz(pin);
  };

  const buzzerPlayer = players.find(p => p.id === session?.activeBuzzer);
  const isRevealed = session?.activeBuzzer !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl font-black gold-text text-3d"
        >
          CHARGEMENT...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tv-noise p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <Star className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-black gold-text text-3d">
              PULSEQUIZ
            </h1>
          </motion.div>

          {/* PIN Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 game-panel px-4 py-2">
              <Users className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{players.length}</span>
              <span className="text-white/60">joueurs</span>
            </div>

            <div className="pin-display animated-border">
              {pin}
            </div>

            <button
              onClick={() => setShowSearchModal(true)}
              className="retro-btn px-6 py-3 flex items-center gap-2"
            >
              <Search size={20} />
              RECHERCHER
            </button>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Player YouTube Central */}
        <div className="col-span-2">
          {session?.currentTrack ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              {/* TV Frame */}
              <div className="tv-frame rounded-3xl overflow-hidden">
                <div className="aspect-video bg-black relative scanlines">
                  <YouTubePlayer
                    videoId={session.currentTrack.youtubeId}
                    isPlaying={session.state === 'playing'}
                    isRevealed={isRevealed}
                    showOverlay={session.state === 'playing' && !isRevealed}
                  />
                </div>
              </div>

              {/* Song Info - Only when revealed */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ y: 30, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    className="game-panel p-6 text-center winner-glow"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                      <span className="text-yellow-400 text-xl uppercase tracking-wider">La réponse était</span>
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h2 className="text-4xl font-black gold-text text-3d mb-2">
                      {session.currentTrack.title}
                    </h2>
                    <p className="text-2xl text-white/80">
                      {session.currentTrack.artist}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="flex gap-4 justify-center">
                <button onClick={handlePlayPause} className="retro-btn px-8 py-4 flex items-center gap-3 text-xl">
                  {session.state === 'playing' ? <Pause size={24} /> : <Play size={24} />}
                  {session.state === 'playing' ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="px-8 py-4 flex items-center gap-3 text-xl font-bold uppercase"
                  style={{
                    background: 'linear-gradient(180deg, #FF0040 0%, #CC0030 100%)',
                    border: '4px solid #FFD700',
                    borderRadius: '15px',
                    boxShadow: '0 6px 0 #990020',
                  }}
                >
                  <SkipForward size={24} />
                  SUIVANT
                </button>
              </div>
            </motion.div>
          ) : (
            /* No song selected */
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="aspect-video game-panel flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Music className="w-32 h-32 text-yellow-400/50 mb-6" />
              </motion.div>
              <h2 className="text-4xl font-black gold-text mb-6">CHOISISSEZ UNE MUSIQUE</h2>
              <div className="flex gap-4">
                <button onClick={handleUseTrending} className="retro-btn px-8 py-4 flex items-center gap-3 text-xl">
                  <TrendingUp size={24} />
                  TENDANCES
                </button>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="px-8 py-4 flex items-center gap-3 text-xl font-bold uppercase"
                  style={{
                    background: 'linear-gradient(180deg, #9400D3 0%, #6B00A3 100%)',
                    border: '4px solid #FFD700',
                    borderRadius: '15px',
                    boxShadow: '0 6px 0 #4B0073',
                  }}
                >
                  <Search size={24} />
                  RECHERCHER
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="space-y-6">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="game-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-black gold-text">SCORES</h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-4 ${
                      player.id === session?.activeBuzzer
                        ? 'border-red-500 bg-red-500/20 winner-glow'
                        : index === 0 && player.score > 0
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-purple-500/50 bg-purple-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-black ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-600' : 'text-white/50'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="text-xl font-bold text-white">{player.name}</div>
                    </div>
                    <div className="score-display px-4 py-2 text-3xl font-bold">
                      {player.score}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {players.length === 0 && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl text-white/50"
                  >
                    En attente de joueurs...
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Buzzer Alert */}
          {buzzerPlayer && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="game-panel p-6 winner-glow"
              style={{ borderColor: '#FF0040' }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-center"
              >
                <div className="text-6xl mb-2">🚨</div>
                <h3 className="text-2xl font-black text-red-400 flash-text mb-2">
                  {buzzerPlayer.name}
                </h3>
                <p className="text-white/80 mb-4">A BUZZÉ !</p>
              </motion.div>

              <div className="flex gap-3">
                <button
                  onClick={handleCorrect}
                  className="flex-1 py-4 font-bold text-xl rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(180deg, #00FF7F 0%, #00CC66 100%)',
                    border: '4px solid #FFD700',
                    boxShadow: '0 4px 0 #009944',
                  }}
                >
                  <Check size={24} /> CORRECT
                </button>
                <button
                  onClick={handleIncorrect}
                  className="flex-1 py-4 font-bold text-xl rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(180deg, #FF0040 0%, #CC0030 100%)',
                    border: '4px solid #FFD700',
                    boxShadow: '0 4px 0 #990020',
                  }}
                >
                  <X size={24} /> FAUX
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
            onClick={() => setShowSearchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="game-panel p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <Music className="w-10 h-10 text-yellow-400" />
                <h2 className="text-4xl font-black gold-text">RECHERCHER</h2>
              </div>

              <form onSubmit={handleSearch} className="mb-6 flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titre, artiste..."
                  className="flex-1 bg-black/50 border-4 border-yellow-400 rounded-xl px-6 py-4 text-xl text-white focus:outline-none focus:border-orange-400"
                />
                <button type="submit" disabled={isSearching} className="retro-btn px-8 py-4 text-xl">
                  {isSearching ? '...' : 'GO!'}
                </button>
                <button type="button" onClick={handleUseTrending} className="retro-btn px-6 py-4">
                  <TrendingUp size={24} />
                </button>
              </form>

              <div className="overflow-y-auto max-h-[50vh] space-y-3">
                {searchResults.map((video) => (
                  <motion.button
                    key={video.id}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectVideo(video)}
                    className="w-full bg-purple-900/50 border-2 border-purple-500/50 hover:border-yellow-400 rounded-xl p-4 flex items-center gap-4 text-left"
                  >
                    <img src={video.thumbnail} alt={video.title} className="w-28 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg line-clamp-1">{video.title}</h3>
                      <p className="text-yellow-400/80">{video.artist}</p>
                      <p className="text-white/50 text-sm">{video.duration}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400/50" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
