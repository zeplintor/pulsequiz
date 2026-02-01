'use client';

import { motion } from 'framer-motion';
import { Tv, Smartphone, Star, Sparkles, Music, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

// Stars background component
function StarsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 10 + 5}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ★
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden tv-noise">
      <StarsBackground />

      {/* Spotlight effect */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Main Title */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
          className="text-center mb-8"
        >
          {/* Decorative stars */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-10 -left-10 text-6xl text-yellow-400"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-5 -right-10 text-4xl text-orange-400"
          >
            ★
          </motion.div>

          {/* Logo */}
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px #FFD700',
                '0 0 40px #FF6B00',
                '0 0 20px #FFD700',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <h1 className="text-7xl md:text-9xl font-black text-3d gold-text tracking-tight">
              PULSE
            </h1>
            <h1 className="text-7xl md:text-9xl font-black text-3d gold-text tracking-tight -mt-4">
              QUIZ
            </h1>
          </motion.div>

          {/* Subtitle banner */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="title-banner mt-6 inline-block"
          >
            <span className="text-black font-bold text-xl md:text-2xl tracking-widest">
              LE BLIND TEST MUSICAL
            </span>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl text-white text-center mb-12 max-w-2xl"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          <span className="text-yellow-400">★</span> Un écran, plusieurs téléphones, des battles de buzzer instantanés ! <span className="text-yellow-400">★</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid md:grid-cols-2 gap-8 max-w-3xl w-full px-4"
        >
          {/* Host Button */}
          <Link href="/host">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="game-panel p-8 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Tv className="w-20 h-20 text-yellow-400 mb-4" />
                </motion.div>
                <h2 className="text-3xl font-black gold-text mb-2">
                  ANIMATEUR
                </h2>
                <p className="text-white/80 text-center">
                  Afficher sur TV / Ordinateur
                </p>
                <motion.div
                  className="mt-4 retro-btn px-6 py-2"
                  whileHover={{ scale: 1.1 }}
                >
                  CRÉER UNE PARTIE
                </motion.div>
              </div>
            </motion.div>
          </Link>

          {/* Play Button */}
          <Link href="/play">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="game-panel p-8 cursor-pointer group"
              style={{ borderColor: '#FF0040' }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Smartphone className="w-20 h-20 text-red-400 mb-4" />
                </motion.div>
                <h2 className="text-3xl font-black text-red-400 mb-2" style={{ textShadow: '0 0 20px #FF0040' }}>
                  JOUEUR
                </h2>
                <p className="text-white/80 text-center">
                  Utiliser ton téléphone comme buzzer
                </p>
                <motion.div
                  className="mt-4 px-6 py-2 font-bold uppercase tracking-wider"
                  style={{
                    background: 'linear-gradient(180deg, #FF0040 0%, #CC0030 100%)',
                    border: '4px solid #FFD700',
                    borderRadius: '15px',
                    boxShadow: '0 6px 0 #990020, 0 10px 20px rgba(0,0,0,0.4)',
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  REJOINDRE
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4"
        >
          <div className="game-panel p-6 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-yellow-400 mb-2">ULTRA RAPIDE</h3>
            <p className="text-white/70 text-sm">
              Premier à buzzer gagne le droit de répondre !
            </p>
          </div>

          <div className="game-panel p-6 text-center" style={{ borderColor: '#FF6B00' }}>
            <Music className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-orange-400 mb-2">YOUTUBE INTÉGRÉ</h3>
            <p className="text-white/70 text-sm">
              Des millions de chansons à deviner
            </p>
          </div>

          <div className="game-panel p-6 text-center" style={{ borderColor: '#FF0040' }}>
            <Trophy className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-400 mb-2">SCOREBOARD LIVE</h3>
            <p className="text-white/70 text-sm">
              Suivez les scores en temps réel
            </p>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex items-center gap-4 text-yellow-400/50"
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-sm uppercase tracking-widest">Le jeu qui enflamme vos soirées</span>
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </main>
    </div>
  );
}
