import { useEffect, useState } from 'react';
import type { Gift } from '../data/gifts';
import MountainPath from './MountainPath';
import MountainPathParticles from './MountainPathParticles'; 
import RevealUnwrap from './RevealUnwrap';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type GiftRevealProps = {
  gift: Gift;
  onComplete: () => void;
};

const CLIMB_DURATION_MS = 1500; // Reduced to 1500 for much faster climb

export function GiftReveal({ gift, onComplete }: GiftRevealProps) {
  // Legacy climb state
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const isChristmas = gift.isChristmas;
  
  // Variation state logic
  // 0: Climb (Classic)
  // 1: Scratch Card
  // 2: Unwrap
  // 3: Balloons
  
  // Determine variation based on gift.revealType
  const getInitialVariation = () => {
      if (gift.revealType === 'unwrap') return 2;
      if (gift.revealType === 'climb') return 1; // Sparkle variation
      return 0; // Default
  };

  const [variation] = useState<0 | 1 | 2 | 3>(getInitialVariation()); 

  // Helper to trigger confetti and complete
  const handleRevealComplete = () => {
      if (isChristmas) {
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
      setTimeout(onComplete, 1200);
  };

  // --- Logic for Climb (Variation 0 or 1) ---
  useEffect(() => {
    if (variation !== 0 && variation !== 1) return;

    if (progress >= 100) {
        handleRevealComplete();
    }
  }, [progress, variation]);

  useEffect(() => {
    if (variation !== 0 && variation !== 1) return;

    let frame: number;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (isHolding && progress < 100) {
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
  }, [isHolding, variation, progress]);

  const handleHoldStart = () => { if(variation === 0 || variation === 1) setIsHolding(true); };
  const handleHoldEnd = () => { if(variation === 0 || variation === 1) setIsHolding(false); };
  
  // --- Text Helper ---
  const getInstructions = () => {
      if (variation === 2) return isChristmas ? "Tap to unwrap your present! 🎁" : "Tap to open!";
      
      // Default Climb
      return isChristmas 
        ? 'Press and hold to scale the snowy peak. Your Christmas surprise awaits at the top.'
        : 'Press and hold to start your ascent. Reach the peak to reveal your surprise.';
  };

  const getTitle = () => {
      if (variation === 2) return "Unwrap Gift";
      return isChristmas ? 'Climb to Reveal! 🎅' : 'Hold to climb';
  }

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
      whileTap={(variation === 0 || variation === 1) ? { scale: 0.99 } : undefined}
    >
      <div className="reveal-content">
        <div className="reveal-text">
          <p className="eyebrow-enhanced">
            {isChristmas ? `🎄 A Christmas Gift for ${gift.recipientName}` : `A gift for ${gift.recipientName}`}
          </p>
          <h1 className="title-enhanced">{getTitle()}</h1>
          <p className="subtitle-enhanced">
            {getInstructions()}
          </p>
        </div>
        
        <div className="mountain-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {variation === 0 && <MountainPath progress={progress} isChristmas={isChristmas} climberImage={gift.climberImage} />}
          {variation === 1 && <MountainPathParticles progress={progress} isChristmas={isChristmas} climberImage={gift.climberImage} />}
          {variation === 2 && <RevealUnwrap onComplete={handleRevealComplete} isChristmas={isChristmas} />}
        </div>
      </div>

      <AnimatePresence>
        {(variation === 0 || variation === 1) && !isHolding && progress < 100 && progress > 0 && (
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
