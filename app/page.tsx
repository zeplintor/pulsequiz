'use client';

import { motion } from 'framer-motion';
import { Tv, Smartphone, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="mb-8"
        >
          <Zap className="w-24 h-24 mx-auto text-[#ff00ff] mb-6" />
          <h1 className="text-7xl md:text-8xl font-bold mb-4 neon-glow-cyan text-[#00ffff]">
            PULSEGUIZ
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl text-[#e0e0ff] mb-4"
        >
          Real-Time Musical Blind Test
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-[#888] mb-12 max-w-2xl mx-auto"
        >
          The ultimate party game. One screen, multiple phones, instant buzzer battles.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {/* Host Button */}
          <Link href="/host">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-[#00ffff] to-[#0080ff] p-8 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <Tv className="w-16 h-16 mx-auto mb-4 text-black" />
              <h2 className="text-3xl font-bold text-black mb-2">HOST GAME</h2>
              <p className="text-black/70">
                Display on TV/Computer
              </p>
            </motion.div>
          </Link>

          {/* Play Button */}
          <Link href="/play">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-[#ff00ff] to-[#ff006e] p-8 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-white" />
              <h2 className="text-3xl font-bold text-white mb-2">JOIN GAME</h2>
              <p className="text-white/70">
                Use your phone as controller
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <div className="text-[#00ffff] text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-[#00ffff] mb-2">Lightning Fast</h3>
            <p className="text-[#888]">
              Real-time buzzer system. First to buzz wins the right to answer.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <div className="text-[#ff00ff] text-4xl mb-3">🎵</div>
            <h3 className="text-xl font-bold text-[#ff00ff] mb-2">YouTube Powered</h3>
            <p className="text-[#888]">
              Play audio from YouTube while keeping the video hidden.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl p-6">
            <div className="text-[#bd00ff] text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-[#bd00ff] mb-2">Live Scoreboard</h3>
            <p className="text-[#888]">
              Track scores in real-time with dynamic animations.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
