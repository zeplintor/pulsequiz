'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Radio, Trophy, LogOut } from 'lucide-react';
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
  }, [pin, playerId]);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || !playerName.trim()) return;

    setJoining(true);
    try {
      const id = await addPlayer(pin, playerName);
      setPlayerId(id);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game. Check the PIN and try again.');
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
        // Success - long vibration
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 100]);
        }
        setBuzzResult('success');
      } else {
        // Failed - short vibration
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
        setBuzzResult('failed');
      }

      setTimeout(() => {
        setBuzzResult(null);
        setBuzzing(false);
      }, 2000);
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

  // Not joined yet
  if (!playerId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 neon-glow-cyan text-[#00ffff]">
              PULSEGUIZ
            </h1>
            <p className="text-lg text-[#e0e0ff]">Enter the game PIN to join</p>
          </div>

          <form onSubmit={handleJoinGame} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-[#00ffff]">
                GAME PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-[#1a1a2e] border-2 border-[#00ffff] rounded-lg px-6 py-4 text-3xl font-mono text-center text-white focus:outline-none focus:border-[#ff00ff] neon-border-cyan transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[#ff00ff]">
                YOUR NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full bg-[#1a1a2e] border-2 border-[#ff00ff] rounded-lg px-6 py-4 text-xl text-center text-white focus:outline-none focus:border-[#00ffff] neon-border-magenta transition-all"
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={joining || pin.length !== 6 || !playerName.trim()}
              className="w-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff] hover:from-[#00cccc] hover:to-[#cc00cc] text-black font-bold py-5 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 text-xl"
            >
              {joining ? 'JOINING...' : 'JOIN GAME'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Joined - Game interface
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-[#2a2a4e]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[#888]">Playing as</div>
            <div className="text-xl font-bold text-[#00ffff] neon-glow-cyan">
              {playerName}
            </div>
          </div>
          <button
            onClick={handleLeaveGame}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Score Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md mb-8"
        >
          <div className="bg-[#1a1a2e] border-2 border-[#bd00ff] rounded-2xl p-6 text-center neon-border-magenta">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="text-[#ff00ff]" size={24} />
              <span className="text-sm text-[#888] uppercase">Your Score</span>
            </div>
            <div className="text-6xl font-bold text-[#ff00ff] neon-glow-magenta mb-2">
              {currentPlayer?.score || 0}
            </div>
            <div className="text-lg text-[#00ffff]">
              Rank: #{myRank > 0 ? myRank : '-'} / {players.length}
            </div>
          </div>
        </motion.div>

        {/* Buzz Button */}
        <div className="w-full max-w-md mb-8">
          <AnimatePresence mode="wait">
            {session?.state === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <Radio className="mx-auto mb-4 text-[#00ffff] animate-pulse" size={48} />
                <div className="text-2xl font-bold text-[#00ffff] neon-glow-cyan">
                  Waiting for host to start...
                </div>
              </motion.div>
            )}

            {session?.state === 'playing' && !session.activeBuzzer && (
              <motion.button
                key="buzz"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBuzz}
                disabled={buzzing}
                className="relative w-full aspect-square rounded-full bg-gradient-to-br from-[#ff00ff] via-[#bd00ff] to-[#ff006e] hover:from-[#ff33ff] hover:via-[#dd00ff] hover:to-[#ff3388] transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-2xl"
                style={{
                  boxShadow: '0 0 40px rgba(255, 0, 255, 0.6), 0 0 80px rgba(189, 0, 255, 0.4)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Zap size={80} className="text-white mb-4" />
                  <span className="text-4xl font-bold text-white neon-glow-magenta">
                    BUZZ!
                  </span>
                </div>
              </motion.button>
            )}

            {session?.activeBuzzer === playerId && (
              <motion.div
                key="you-buzzed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center p-12 bg-[#ff00ff]/20 border-4 border-[#ff00ff] rounded-3xl neon-border-magenta"
              >
                <Zap className="mx-auto mb-6 text-[#ff00ff] animate-pulse" size={80} />
                <div className="text-4xl font-bold text-[#ff00ff] neon-glow-magenta mb-4">
                  YOU BUZZED!
                </div>
                <div className="text-xl text-white">
                  Give your answer to the host
                </div>
              </motion.div>
            )}

            {session?.activeBuzzer && session.activeBuzzer !== playerId && (
              <motion.div
                key="other-buzzed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center p-12 bg-[#888]/10 border-2 border-[#888] rounded-3xl"
              >
                <div className="text-2xl font-bold text-[#888] mb-2">
                  Someone else buzzed first
                </div>
                <div className="text-lg text-[#666]">
                  {players.find(p => p.id === session.activeBuzzer)?.name}
                </div>
              </motion.div>
            )}

            {session?.state === 'paused' && (
              <motion.div
                key="paused"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-[#00ffff]">
                  Game Paused
                </div>
              </motion.div>
            )}

            {session?.state === 'ended' && (
              <motion.div
                key="ended"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center p-8 bg-[#00ffff]/20 border-2 border-[#00ffff] rounded-3xl neon-border-cyan"
              >
                <Trophy className="mx-auto mb-4 text-[#00ffff]" size={64} />
                <div className="text-3xl font-bold text-[#00ffff] neon-glow-cyan mb-4">
                  GAME OVER!
                </div>
                <div className="text-xl text-white">
                  Final Score: {currentPlayer?.score || 0}
                </div>
                <div className="text-lg text-[#888] mt-2">
                  You finished #{myRank}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buzz Feedback */}
        <AnimatePresence>
          {buzzResult === 'success' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center text-2xl font-bold text-green-400"
            >
              ✓ You got it first!
            </motion.div>
          )}
          {buzzResult === 'failed' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center text-2xl font-bold text-red-400"
            >
              ✗ Too late!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track Info */}
        {session?.currentTrack && session.state === 'playing' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md mt-8 text-center"
          >
            <div className="text-sm text-[#888] mb-1">NOW PLAYING</div>
            <div className="text-lg font-bold text-[#00ffff]">
              Track {session.currentTrackIndex + 1} / {session.playlist.length}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-[#2a2a4e] text-center text-sm text-[#666]">
        Game PIN: <span className="text-[#00ffff] font-mono font-bold">{pin}</span>
      </footer>
    </div>
  );
}
