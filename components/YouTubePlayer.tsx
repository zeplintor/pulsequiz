'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  isRevealed?: boolean;
  onReady?: () => void;
  showOverlay?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({
  videoId,
  isPlaying,
  isRevealed = false,
  onReady,
  showOverlay = false
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const currentVideoRef = useRef<string>(videoId);

  // Charger l'API YouTube
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Charger le script YouTube IFrame API
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      // Callback quand l'API est prête
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    function initPlayer() {
      if (!containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            currentVideoRef.current = videoId;
            if (isPlaying) {
              event.target.playVideo();
            }
            onReady?.();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              console.log('YouTube: Playing');
            }
          },
          onError: (event: any) => {
            console.error('YouTube Error:', event.data);
          },
        },
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
        setIsReady(false);
      }
    };
  }, []);

  // Gérer Play/Pause
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.error('Play/Pause error:', e);
    }
  }, [isPlaying, isReady]);

  // Changer de vidéo quand l'ID change
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    if (currentVideoRef.current === videoId) return;

    try {
      currentVideoRef.current = videoId;
      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: 0,
      });
    } catch (e) {
      console.error('Load video error:', e);
    }
  }, [videoId, isReady]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
      {/* Container pour le blur - wrapper autour du player */}
      <div
        className="w-full h-full transition-all duration-700"
        style={{
          filter: isRevealed ? 'blur(0px)' : 'blur(40px)',
          transform: isRevealed ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        {/* YouTube Player - div standard pour l'API */}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Overlay "En attente de buzz" */}
      <AnimatePresence>
        {showOverlay && !isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 pointer-events-none z-10"
          >
            {/* Animation d'onde sonore */}
            <div className="relative w-32 h-32 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-4 border-[#00ffff] rounded-full"
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{
                    scale: [0.5, 1.5],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-6xl"
                >
                  🎵
                </motion.div>
              </div>
            </div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-bold text-[#00ffff] neon-glow-cyan"
            >
              Devinez la chanson...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl z-20"
        style={{
          boxShadow: isRevealed
            ? '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)'
            : '0 0 20px rgba(0, 255, 255, 0.3)',
        }}
      />
    </div>
  );
}
