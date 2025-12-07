import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type RevealBalloonsProps = {
  onComplete: () => void;
  isChristmas?: boolean;
};

export function RevealBalloons({ onComplete, isChristmas }: RevealBalloonsProps) {
  // Generate random balloons
  const generateBalloons = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      size: Math.random() * 40 + 60, // 60px to 100px
      color: isChristmas 
        ? ['#ef4444', '#22c55e', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)]
        : ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.5
    }));
  };

  const [balloons, setBalloons] = useState(generateBalloons(15));

  const popBalloon = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    
    // Play pop sound? (Optional)
  };

  useEffect(() => {
      if (balloons.length === 0) {
          setTimeout(onComplete, 500);
      }
  }, [balloons.length, onComplete]);

  return (
    <div className="balloons-container" style={{ position: 'relative', width: '100%', height: '350px', overflow: 'hidden', borderRadius: '16px', background: 'rgba(255,255,255,0.5)' }}>
       {/* Background hint */}
       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
           <h2 style={{ opacity: 0.3 }}>Pop them all!</h2>
       </div>

      <AnimatePresence>
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={{ 
                scale: 1, 
                y: [0, -10, 0], // Bobbing effect
                opacity: 1
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ 
                y: { repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" },
                default: { duration: 0.3 }
            }}
            onClick={() => popBalloon(balloon.id)}
            style={{
              position: 'absolute',
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              width: balloon.size,
              height: balloon.size * 1.2, // Oval shape
              backgroundColor: balloon.color,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Balloon shape
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1), 2px 5px 10px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
             {/* String */}
             <div style={{ position: 'absolute', bottom: -20, left: '50%', width: 2, height: 20, background: 'rgba(0,0,0,0.2)' }} />
             {/* Shine */}
             <div style={{ position: 'absolute', top: '15%', left: '20%', width: '20%', height: '10%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'rotate(-45deg)' }} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#64748b', pointerEvents: 'none' }}>
          Pop the balloons! ({balloons.length} remaining)
      </div>
    </div>
  );
}

export default RevealBalloons;
