import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Climber from './Climber';

interface MountainPathProps {
  progress: number; // 0 to 100
  isChristmas?: boolean;
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

export function MountainPath({ progress, isChristmas }: MountainPathProps) {
  // Calculate total length and segments for positioning
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

  // Calculate current climber position
  const currentPos = useMemo(() => {
    const currentDist = (progress / 100) * totalLength;
    
    // Find active segment
    const segment = segments.find(s => currentDist >= s.start && currentDist <= s.start + s.length) || segments[segments.length - 1];
    
    if (!segment) return POINTS[0];

    const segmentProgress = (currentDist - segment.start) / segment.length;
    const x = segment.p1.x + (segment.p2.x - segment.p1.x) * segmentProgress;
    const y = segment.p1.y + (segment.p2.y - segment.p1.y) * segmentProgress;

    // Clamp to start/end if out of bounds (though progress should be clamped 0-100)
    if (currentDist <= 0) return POINTS[0];
    if (currentDist >= totalLength) return POINTS[POINTS.length - 1];

    return { x, y };
  }, [progress, totalLength, segments]);

  const pathString = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const mountainShape = `${pathString} L 280 380 L 20 380 Z`;

  // Christmas styling overrides
  const strokeColor = isChristmas ? '#166534' : '#3b82f6';
  const trackColor = isChristmas ? '#bbf7d0' : '#e2e8f0';

  return (
    <div className="mountain-container" style={{ position: 'relative', width: '300px', height: '400px', margin: '0 auto' }}>
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
           <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Mountain */}
        <path
          d={mountainShape}
          fill="url(#mountainGradient)"
          stroke={isChristmas ? '#cbd5e1' : '#cbd5e1'}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* The Track Line */}
        <path
          d={pathString}
          fill="none"
          stroke={trackColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 8"
        />

        {/* The Active Progress Line */}
        <motion.path
          d={pathString}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
          filter="url(#glow)"
        />
      </svg>

      {/* Climber Positioned Absolute */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${(currentPos.x / 300) * 100}%`,
            top: `${(currentPos.y / 400) * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.1s linear, top 0.1s linear',
          }}
        >
          <Climber isChristmas={isChristmas} />
        </div>
      </div>
    </div>
  );
}

export default MountainPath;
