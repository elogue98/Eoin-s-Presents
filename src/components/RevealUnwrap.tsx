import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type RevealUnwrapProps = {
  onComplete: () => void;
  isChristmas?: boolean;
};

export function RevealUnwrap({ onComplete, isChristmas }: RevealUnwrapProps) {
  const [layers, setLayers] = useState([
    { id: 'ribbon-bow', color: isChristmas ? '#ef4444' : '#3b82f6', type: 'ribbon' },
    { id: 'paper-top', color: isChristmas ? '#166534' : '#60a5fa', type: 'paper' },
    { id: 'paper-left', color: isChristmas ? '#15803d' : '#93c5fd', type: 'paper' },
    { id: 'paper-right', color: isChristmas ? '#16a34a' : '#bfdbfe', type: 'paper' },
    // 'box-lid' removed as requested
  ]);

  const handleTap = () => {
    if (!layers || layers.length === 0) return;
    
    const newLayers = [...layers];
    newLayers.shift(); 
    setLayers(newLayers);

    if (newLayers.length === 0) {
      onComplete();
    }
  };

  return (
    <div className="unwrap-container" style={{ width: '100%', height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
       <motion.div 
         className="gift-box"
         style={{ width: 200, height: 200, position: 'relative', cursor: 'pointer', marginBottom: '40px' }}
         whileTap={{ scale: 0.95 }}
         onClick={handleTap}
       >
          <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: '#fff', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
              borderRadius: '12px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
          }}>
              <span style={{ fontSize: '3rem', opacity: 0.5 }}>🎁</span>
          </div>

          <AnimatePresence>
            {layers.map((layer, index) => (
                <motion.div
                    key={layer.id}
                    initial={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ 
                        opacity: 0, 
                        scale: 1.5, 
                        rotate: Math.random() * 90 - 45, // More dramatic rotation
                        x: Math.random() * 400 - 200, // Fly further horizontally
                        y: Math.random() * 400 - 200, // Fly further vertically
                        transition: { duration: 0.6, ease: "backIn" }
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        inset: index * -2, 
                        background: layer.type === 'ribbon' ? 'transparent' : layer.color,
                        borderRadius: '12px',
                        zIndex: layers.length - index,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: layer.type === 'paper' ? '2px solid rgba(255,255,255,0.2)' : 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        pointerEvents: 'none',
                        // Add slight random rotation to stacked layers for organic look
                        transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)` 
                    }}
                >
                    {layer.type === 'ribbon' && (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                             <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '40px', background: layer.color, transform: 'translateY(-50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                             <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '40px', background: layer.color, transform: 'translateX(-50%)', boxShadow: '2px 0 4px rgba(0,0,0,0.2)' }} />
                             <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ position: 'absolute', top: '50%', left: '50%', width: '70px', height: '70px', borderRadius: '50%', background: isChristmas ? '#b91c1c' : '#1d4ed8', transform: 'translate(-50%, -50%)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10 }} 
                             />
                        </div>
                    )}
                    {layer.type === 'paper' && isChristmas && (
                        <div style={{ width: '100%', height: '100%', opacity: 0.15, backgroundImage: 'radial-gradient(circle, #fff 3px, transparent 3px)', backgroundSize: '24px 24px' }} />
                    )}
                </motion.div>
            ))}
          </AnimatePresence>
       </motion.div>
       
       <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b', width: '100%', maxWidth: '240px' }}>
          Tap to Unwrap! ({layers.length} layers left)
       </div>
    </div>
  );
}

export default RevealUnwrap;
