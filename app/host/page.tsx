'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Check, X, Users, Search, Music, TrendingUp } from 'lucide-react';
import YouTubePlayer from '@/components/YouTubePlayer';
import { createSession, subscribeToSession, subscribeToPlayers, startNextTrack, awardPoints, rejectBuzz, updateSessionState } from '@/lib/firestore';
import type { GameSession, Player, Track } from '@/lib/types';

export default function HostPage() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState<string>('');

  // Search states
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
      if (data.success) {
        setTrendingVideos(data.results);
      }
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const initializeSession = async () => {
    try {
      // Créer une session vide au début
      const { createSession: createEmptySession } = await import('@/lib/firestore');
      const newPin = await createEmptySession([]);
      setPin(newPin);
      setLoading(false);
    } catch (error) {
      console.error('Failed to create session:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pin) return;

    const unsubSession = subscribeToSession(pin, (sessionData) => {
      setSession(sessionData);
    });

    const unsubPlayers = subscribeToPlayers(pin, (playersData) => {
      setPlayers(playersData);
    });

    return () => {
      unsubSession();
      unsubPlayers();
    };
  }, [pin]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
      }
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

    // Ajouter la vidéo à la playlist et la jouer immédiatement
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

    // Sélectionner une vidéo aléatoire parmi les tendances
    const randomVideo = trendingVideos[Math.floor(Math.random() * trendingVideos.length)];
    await handleSelectVideo(randomVideo);
  };

  const handlePlayPause = async () => {
    if (!pin || !session) return;
    await updateSessionState(pin, {
      state: session.state === 'playing' ? 'paused' : 'playing',
    });
  };

  const handleCorrect = async () => {
    if (!pin || !session?.activeBuzzer) return;
    await awardPoints(pin, session.activeBuzzer, 100);

    // Révéler la vidéo pendant 5 secondes avant de passer à la suivante
    setTimeout(() => {
      setShowSearchModal(true);
    }, 5000);
  };

  const handleIncorrect = async () => {
    if (!pin || !session?.activeBuzzer) return;
    await rejectBuzz(pin);
  };

  const buzzerPlayer = players.find(p => p.id === session?.activeBuzzer);
  const isRevealed = session?.activeBuzzer !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[#00ffff] text-4xl font-bold neon-glow-cyan"
        >
          Initializing PulseQuiz...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      {/* Header avec PIN et Recherche */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-5xl font-bold neon-glow-cyan text-[#00ffff]">
              PULSEGUIZ
            </h1>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 text-[#00ffff]">
              <Users size={20} />
              <span className="text-lg">{players.length} players</span>
            </div>

            <div className="bg-[#1a1a2e] border-2 border-[#ff00ff] rounded-lg px-6 py-2 neon-border-magenta">
              <span className="text-sm text-[#888]">PIN:</span>
              <span className="text-3xl font-mono font-bold text-[#ff00ff] neon-glow-magenta ml-2">
                {pin}
              </span>
            </div>

            <button
              onClick={() => setShowSearchModal(true)}
              className="bg-[#bd00ff] hover:bg-[#9900cc] text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            >
              <Search size={20} />
              Rechercher
            </button>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Player YouTube Central */}
        <div className="col-span-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {session?.currentTrack ? (
              <div className="space-y-4">
                {/* Player */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                  <YouTubePlayer
                    videoId={session.currentTrack.youtubeId}
                    isPlaying={session.state === 'playing'}
                    isRevealed={isRevealed}
                    showOverlay={session.state === 'playing' && !isRevealed}
                  />
                </div>

                {/* Titre et Artiste (révélés uniquement après buzz) */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="bg-[#1a1a2e] border-2 border-[#ff00ff] rounded-xl p-6 text-center neon-border-magenta"
                    >
                      <h2 className="text-4xl font-bold text-[#00ffff] neon-glow-cyan mb-2">
                        {session.currentTrack.title}
                      </h2>
                      <p className="text-2xl text-[#ff00ff] neon-glow-magenta">
                        {session.currentTrack.artist}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contrôles de lecture */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="bg-[#bd00ff] hover:bg-[#9900cc] text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
                  >
                    {session.state === 'playing' ? <Pause size={20} /> : <Play size={20} />}
                    {session.state === 'playing' ? 'PAUSE' : 'PLAY'}
                  </button>

                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="bg-[#ff006e] hover:bg-[#cc0058] text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
                  >
                    <SkipForward size={20} />
                    SUIVANT
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-[#1a1a2e] border-2 border-[#2a2a4e] rounded-2xl flex flex-col items-center justify-center">
                <Music className="w-24 h-24 text-[#00ffff] mb-6 opacity-50" />
                <h2 className="text-3xl font-bold text-[#00ffff] mb-4">
                  Aucune musique sélectionnée
                </h2>
                <button
                  onClick={handleUseTrending}
                  className="bg-[#00ffff] hover:bg-[#00cccc] text-black font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                >
                  <TrendingUp size={20} />
                  Utiliser les Tendances
                </button>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="mt-3 bg-[#bd00ff] hover:bg-[#9900cc] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                >
                  <Search size={20} />
                  Rechercher une Musique
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scoreboard */}
        <div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-[#1a1a2e] border-2 border-[#00ffff] rounded-xl p-6 neon-border-cyan mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-[#00ffff] neon-glow-cyan">
              SCOREBOARD
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      player.id === session?.activeBuzzer
                        ? 'bg-[#ff00ff]/20 border-[#ff00ff] neon-border-magenta animate-pulse'
                        : 'bg-[#0f0f1e] border-[#2a2a4e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-[#00ffff] w-6">
                        #{index + 1}
                      </div>
                      <div className="text-lg font-semibold text-white truncate">
                        {player.name}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#ff00ff] neon-glow-magenta">
                      {player.score}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {players.length === 0 && (
                <div className="text-center text-[#666] text-sm py-4">
                  En attente de joueurs...
                </div>
              )}
            </div>
          </motion.div>

          {/* Buzzer Response */}
          {buzzerPlayer && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#ff00ff]/20 border-2 border-[#ff00ff] rounded-xl p-6 neon-border-magenta"
            >
              <h3 className="text-xl font-bold mb-4 text-[#ff00ff] text-center neon-glow-magenta">
                {buzzerPlayer.name} A BUZZÉ!
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleCorrect}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} /> CORRECT
                </button>
                <button
                  onClick={handleIncorrect}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <X size={20} /> FAUX
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de Recherche */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowSearchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] border-2 border-[#00ffff] rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden neon-border-cyan"
            >
              <h2 className="text-3xl font-bold text-[#00ffff] neon-glow-cyan mb-6">
                Rechercher une Musique
              </h2>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titre, artiste..."
                    className="flex-1 bg-[#0a0a0f] border-2 border-[#00ffff] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff00ff] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-[#00ffff] hover:bg-[#00cccc] disabled:bg-[#333] text-black font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    {isSearching ? 'Recherche...' : 'Chercher'}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseTrending}
                    className="bg-[#ff00ff] hover:bg-[#cc00cc] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                  >
                    <TrendingUp size={20} />
                    Aléatoire
                  </button>
                </div>
              </form>

              <div className="overflow-y-auto max-h-[50vh] space-y-3">
                {searchResults.map((video) => (
                  <motion.button
                    key={video.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectVideo(video)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a4e] hover:border-[#00ffff] rounded-lg p-4 flex items-center gap-4 transition-all text-left"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-[#888] text-sm">{video.artist}</p>
                      <p className="text-[#666] text-xs">{video.duration}</p>
                    </div>
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
