import { useEffect, useRef, useState } from 'react';
import type { Gift } from '../data/gifts';
import MountainPath from './MountainPath';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type GiftRevealProps = {
  gift: Gift;
  onComplete: () => void;
};

const CLIMB_DURATION_MS = 4000; // Increased for a slightly longer experience

export function GiftReveal({ gift, onComplete }: GiftRevealProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const hasFinished = useRef(false);
  const isChristmas = gift.isChristmas;

  useEffect(() => {
    if (progress >= 100 && !hasFinished.current) {
      hasFinished.current = true;
      if (isChristmas) {
        // Red, Green, Gold, White confetti
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#dc2626', '#166534', '#fbbf24', '#ffffff'],
            disableForReducedMotion: true
          });
      } else {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#1d4ed8', '#60a5fa', '#ffffff'],
            disableForReducedMotion: true
          });
      }
      // Delay completion slightly to let confetti pop
      setTimeout(onComplete, 1200);
    }
  }, [progress, onComplete, isChristmas]);

  useEffect(() => {
    let frame: number;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (isHolding && !hasFinished.current) {
        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        setProgress((current) => Math.min(100, current + (delta / CLIMB_DURATION_MS) * 100));
      } else {
        lastTimestamp = null;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isHolding]);

  const handleHoldStart = () => {
    if (!hasFinished.current) {
      setIsHolding(true);
    }
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  return (
    <motion.div
      className="reveal-card-enhanced"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      onPointerDown={handleHoldStart}
      onPointerUp={handleHoldEnd}
      onPointerLeave={handleHoldEnd}
      onPointerCancel={handleHoldEnd}
      whileTap={{ scale: 0.99 }}
    >
      <div className="reveal-content">
        <div className="reveal-text">
          <p className="eyebrow-enhanced">
            {isChristmas ? `🎄 A Christmas Gift for ${gift.recipientName}` : `A gift for ${gift.recipientName}`}
          </p>
          <h1 className="title-enhanced">
              {isChristmas ? 'Climb to Reveal! 🎅' : 'Hold to climb'}
          </h1>
          <p className="subtitle-enhanced">
            {isChristmas 
                ? 'Press and hold to scale the snowy peak. Your Christmas surprise awaits at the top.'
                : 'Press and hold to start your ascent. Reach the peak to reveal your surprise.'
            }
          </p>
        </div>
        
        <div className="mountain-wrapper">
          <MountainPath progress={progress} isChristmas={isChristmas} />
        </div>
      </div>

      <AnimatePresence>
        {!isHolding && progress < 100 && progress > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="hint-text"
          >
            {isChristmas ? 'Keep climbing, Santa is waiting! 🎅' : 'Keep holding!'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default GiftReveal;
