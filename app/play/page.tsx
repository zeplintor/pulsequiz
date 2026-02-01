'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, LogOut, Star, Music } from 'lucide-react';
import { addPlayer, subscribeToSession, attemptBuzz, subscribeToPlayers } from '@/lib/firestore';
import type { GameSession, Player } from '@/lib/types';

export default function PlayPage() {
  const [pin, setPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [buzzing, setBuzzing] = useState(false);
  const [buzzResult, setBuzzResult] = useState<'success' | 'failed' | null>(null);
  const [joining, setJoining] = useState(false);

  const currentPlayer = players.find(p => p.id === playerId);
  const myRank = players.findIndex(p => p.id === playerId) + 1;

  useEffect(() => {
    if (!pin || !playerId) return;
    const unsubSession = subscribeToSession(pin, setSession);
    const unsubPlayers = subscribeToPlayers(pin, setPlayers);
    return () => { unsubSession(); unsubPlayers(); };
  }, [pin, playerId]);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !playerName.trim()) return;
    setJoining(true);
    try {
      const id = await addPlayer(pin, playerName);
      setPlayerId(id);
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Impossible de rejoindre. Vérifiez le PIN.');
    } finally {
      setJoining(false);
    }
  };

  const handleBuzz = async () => {
    if (!pin || !playerId || buzzing || session?.state !== 'playing') return;
    setBuzzing(true);
    setBuzzResult(null);
    try {
      const success = await attemptBuzz(pin, playerId);
      if (success) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
        setBuzzResult('success');
      } else {
        if (navigator.vibrate) navigator.vibrate(100);
        setBuzzResult('failed');
      }
      setTimeout(() => { setBuzzResult(null); setBuzzing(false); }, 2000);
    } catch (error) {
      console.error('Buzz failed:', error);
      setBuzzing(false);
    }
  };

  const handleLeaveGame = () => {
    setPlayerId(null);
    setPin('');
    setPlayerName('');
    setSession(null);
    setPlayers([]);
  };

  // Join screen
  if (!playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 tv-noise">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h1 className="text-5xl font-black gold-text text-3d mb-2">
                PULSEQUIZ
              </h1>
            </motion.div>
            <p className="text-yellow-400 text-lg">Rejoins la partie !</p>
          </div>

          <form onSubmit={handleJoinGame} className="space-y-6">
            {/* PIN Input */}
            <div className="game-panel p-6">
              <label className="block text-yellow-400 font-bold mb-3 text-lg">
                <Star className="inline w-5 h-5 mr-2" />
                CODE PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-black border-4 border-yellow-400 rounded-xl px-6 py-4 text-4xl font-mono text-center text-red-400 focus:outline-none focus:border-orange-400"
                style={{ textShadow: '0 0 20px #FF0040', letterSpacing: '10px' }}
                required
              />
            </div>

            {/* Name Input */}
            <div className="game-panel p-6">
              <label className="block text-yellow-400 font-bold mb-3 text-lg">
                <Trophy className="inline w-5 h-5 mr-2" />
                TON PSEUDO
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 15))}
                placeholder="Ton nom"
                maxLength={15}
                className="w-full bg-black border-4 border-orange-400 rounded-xl px-6 py-4 text-2xl text-center text-white focus:outline-none focus:border-yellow-400"
                required
              />
            </div>

            {/* Join Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={joining || pin.length !== 6 || !playerName.trim()}
              className="w-full retro-btn py-5 text-2xl disabled:opacity-50"
            >
              {joining ? 'CONNEXION...' : "C'EST PARTI !"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen flex flex-col tv-noise">
      {/* Header */}
      <header className="p-4 border-b-4 border-yellow-400/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-yellow-400/60 text-sm uppercase">Joueur</div>
            <div className="text-2xl font-black gold-text">{playerName}</div>
          </div>
          <button onClick={handleLeaveGame} className="text-red-400 hover:text-red-300 p-2">
            <LogOut size={28} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Score Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm mb-8"
        >
          <div className="game-panel p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="text-yellow-400" size={28} />
              <span className="text-yellow-400 uppercase font-bold">Ton Score</span>
            </div>
            <div className="score-display inline-block px-8 py-4 text-5xl font-black mb-3">
              {currentPlayer?.score || 0}
            </div>
            <div className="text-white/60">
              Classement: <span className="text-yellow-400 font-bold">#{myRank > 0 ? myRank : '-'}</span> / {players.length}
            </div>
          </div>
        </motion.div>

        {/* Buzzer Area */}
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {/* Waiting state */}
            {session?.state === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center game-panel p-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Music className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <div className="text-2xl font-bold gold-text">
                  En attente de l'animateur...
                </div>
              </motion.div>
            )}

            {/* Playing - Can Buzz */}
            {session?.state === 'playing' && !session.activeBuzzer && (
              <motion.button
                key="buzz"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBuzz}
                disabled={buzzing}
                className="w-full aspect-square buzzer-btn flex flex-col items-center justify-center disabled:opacity-50"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Zap size={80} className="text-white mb-2" />
                </motion.div>
                <span className="text-4xl font-black text-white" style={{ textShadow: '2px 2px 0 #000' }}>
                  BUZZ !
                </span>
              </motion.button>
            )}

            {/* You buzzed! */}
            {session?.activeBuzzer === playerId && (
              <motion.div
                key="you-buzzed"
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center game-panel p-8 winner-glow"
                style={{ borderColor: '#00FF7F' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <div className="text-3xl font-black text-green-400 flash-text mb-2">
                  TU AS BUZZÉ !
                </div>
                <div className="text-white/80 text-lg">
                  Donne ta réponse à l'animateur
                </div>
              </motion.div>
            )}

            {/* Someone else buzzed */}
            {session?.activeBuzzer && session.activeBuzzer !== playerId && (
              <motion.div
                key="other-buzzed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center game-panel p-8"
                style={{ borderColor: '#FF0040' }}
              >
                <div className="text-6xl mb-4">😅</div>
                <div className="text-2xl font-bold text-red-400 mb-2">
                  Trop tard !
                </div>
                <div className="text-white/60">
                  {players.find(p => p.id === session.activeBuzzer)?.name} a buzzé en premier
                </div>
              </motion.div>
            )}

            {/* Paused */}
            {session?.state === 'paused' && (
              <motion.div
                key="paused"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center game-panel p-8"
              >
                <div className="text-6xl mb-4">⏸️</div>
                <div className="text-2xl font-bold gold-text">
                  PAUSE
                </div>
              </motion.div>
            )}

            {/* Game Over */}
            {session?.state === 'ended' && (
              <motion.div
                key="ended"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center game-panel p-8 winner-glow"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🏆
                </motion.div>
                <div className="text-3xl font-black gold-text text-3d mb-4">
                  FIN DU JEU !
                </div>
                <div className="score-display inline-block px-6 py-3 text-4xl font-bold mb-2">
                  {currentPlayer?.score || 0}
                </div>
                <div className="text-white/80">
                  Tu termines #{myRank} !
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buzz Feedback */}
        <AnimatePresence>
          {buzzResult === 'success' && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 20 }}
              className="mt-6 text-2xl font-bold text-green-400"
            >
              ✓ PREMIER !
            </motion.div>
          )}
          {buzzResult === 'failed' && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 20 }}
              className="mt-6 text-2xl font-bold text-red-400"
            >
              ✗ TROP LENT !
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t-4 border-yellow-400/30 text-center">
        <span className="text-yellow-400/50 text-sm">PIN: </span>
        <span className="text-yellow-400 font-mono font-bold text-lg">{pin}</span>
      </footer>
    </div>
  );
}
