import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Climber from './Climber';

interface MountainPathProps {
  progress: number; // 0 to 100
  isChristmas?: boolean;
}

const POINTS = [
  { x: 20, y: 380 },
  { x: 80, y: 250 },
  { x: 120, y: 290 },
  { x: 180, y: 120 },
  { x: 220, y: 160 },
  { x: 280, y: 20 },
];

export function MountainPathLiquid({ progress, isChristmas }: MountainPathProps) {
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

  const pathString = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const mountainShape = `${pathString} L 280 380 L 20 380 Z`;

  const liquidColor = isChristmas ? '#166534' : '#3b82f6';

  return (
    <div className="mountain-container" style={{ position: 'relative', width: '300px', height: '400px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
            {/* Liquid Gradient */}
            <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={liquidColor} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={liquidColor} stopOpacity={0.4}/>
            </linearGradient>

            {/* Clip path defined by mountain shape */}
            <clipPath id="mountainClip">
                <path d={mountainShape} />
            </clipPath>
        </defs>

        {/* Outline */}
        <path d={mountainShape} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />

        {/* Liquid Fill masked by mountain */}
        <g clipPath="url(#mountainClip)">
             <motion.rect
                x="0" 
                y="0" 
                width="300" 
                height="400" 
                fill="url(#liquidGradient)"
                initial={{ y: 400 }}
                animate={{ y: 400 - (progress / 100) * 400 }} // Moves UP
                transition={{ duration: 0.1, ease: "linear" }}
             />
             {/* Wave effect at top of liquid */}
             <motion.path 
                d="M 0 0 Q 75 10 150 0 T 300 0 V 10 H 0 Z"
                fill={liquidColor}
                initial={{ y: 400 }}
                animate={{ y: 400 - (progress / 100) * 400 - 5 }}
                transition={{ duration: 0.1, ease: "linear" }}
                style={{ x: -10 }} // Creating a wave movement could be complex with just CSS x transform, keep simple for now
             />
        </g>

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
         {/* Just for reference of where they are on the mountain face, we keep the climber but maybe less emphasized? */}
         {/* Actually, let's keep the climber floating on top of the liquid level roughly? Or just stick to the path */}
          {/* Sticking to path logic is safer for "climbing" metaphor */}
      </div>

      </svg>
      
       <div
          style={{
            position: 'absolute',
            left: `${(currentPos.x / 300) * 100}%`,
            top: `${(currentPos.y / 400) * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.1s linear, top 0.1s linear',
            pointerEvents: 'none'
          }}
        >
          <Climber isChristmas={isChristmas} />
        </div>
    </div>
  );
}

export default MountainPathLiquid;
