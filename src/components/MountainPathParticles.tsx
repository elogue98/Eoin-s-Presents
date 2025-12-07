import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';
import Climber from './Climber';

interface MountainPathProps {
  progress: number; // 0 to 100
  isChristmas?: boolean;
  climberImage?: string;
}

// Path points definition
const POINTS = [
  { x: 20, y: 380 },
  { x: 80, y: 250 },
  { x: 120, y: 290 },
  { x: 180, y: 120 },
  { x: 220, y: 160 },
  { x: 280, y: 20 },
];

export function MountainPathParticles({ progress, isChristmas, climberImage }: MountainPathProps) {
  const { totalLength, segments } = useMemo(() => {
    let len = 0;
    const segs = [];
    for (let i = 0; i < POINTS.length - 1; i++) {
      const p1 = POINTS[i];
      const p2 = POINTS[i + 1];
      const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      segs.push({ start: len, length: dist, p1, p2 });
      len += dist;
    }
    return { totalLength: len, segments: segs };
  }, []);

  const currentPos = useMemo(() => {
    const currentDist = (progress / 100) * totalLength;
    const segment = segments.find(s => currentDist >= s.start && currentDist <= s.start + s.length) || segments[segments.length - 1];
    
    if (!segment) return POINTS[0];

    const segmentProgress = (currentDist - segment.start) / segment.length;
    const x = segment.p1.x + (segment.p2.x - segment.p1.x) * segmentProgress;
    const y = segment.p1.y + (segment.p2.y - segment.p1.y) * segmentProgress;

    if (currentDist <= 0) return POINTS[0];
    if (currentDist >= totalLength) return POINTS[POINTS.length - 1];

    return { x, y };
  }, [progress, totalLength, segments]);

  const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const newParticle = { id: Date.now(), x: currentPos.x, y: currentPos.y };
      setParticles(prev => [...prev.slice(-20), newParticle]);
    } else if (progress === 0) {
        setParticles([]);
    }
  }, [progress, currentPos]);

  const pathString = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const mountainShape = `${pathString} L 280 380 L 20 380 Z`;

  const strokeColor = isChristmas ? '#166534' : '#3b82f6';
  const trackColor = isChristmas ? '#bbf7d0' : '#e2e8f0';

  return (
    <div className="mountain-container" style={{ position: 'relative', width: '100%', maxWidth: '300px', aspectRatio: '300/400', margin: '0 auto' }}>
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="mountainGradient" x1="150" y1="0" x2="150" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity={0.2} />
          </linearGradient>
           <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <path d={mountainShape} fill="url(#mountainGradient)" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />

        {/* The Track Line - Hidden/Faint */}
        <path d={pathString} fill="none" stroke={trackColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" opacity={0.5} />

        {/* Magic Glowing Path */}
        <motion.path
          d={pathString}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
          filter="url(#glow-strong)"
          style={{ opacity: 0.8 }}
        />
        
        {/* Core of path */}
        <motion.path
          d={pathString}
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>

      {/* Particles Layer */}
       <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {particles.map(p => (
            <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1, x: (p.x / 300) * 300, y: (p.y / 400) * 400 }}
                animate={{ opacity: 0, scale: 0, y: ((p.y / 400) * 400) + 20 }} // Fall down slightly
                transition={{ duration: 0.8 }}
                style={{
                    position: 'absolute',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: isChristmas ? '#fbbf24' : '#60a5fa',
                    boxShadow: '0 0 4px rgba(255,255,255,0.8)',
                    transform: 'translate(-50%, -50%)' // Center anchor
                }}
            />
        ))}
       </div>

      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{
            position: 'absolute',
            left: `${(currentPos.x / 300) * 100}%`,
            top: `${(currentPos.y / 400) * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.1s linear, top 0.1s linear',
          }}
        >
          <Climber isChristmas={isChristmas} imageSrc={climberImage} />
        </div>
      </div>
    </div>
  );
}

export default MountainPathParticles;
