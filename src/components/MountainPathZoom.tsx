import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

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

export function MountainPathZoom({ progress, isChristmas }: MountainPathProps) {
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
    return { x, y };
  }, [progress, totalLength, segments]);

  // ViewBox Logic
  // Default: 0 0 300 400
  // Zoomed: Centered on currentPos, width/height smaller (e.g., 150 200)
  // Interpolate between Default and Zoomed based on holding state? Or just always follow?
  // Let's make it zoom in as you climb higher to see the "summit approach"
  
  const [viewBox, setViewBox] = useState("0 0 300 400");
  
  useEffect(() => {
      // Base zoom level increases with progress
      // At 0%: 0 0 300 400 (Full view)
      // At 100%: centered on top, zoom factor 2x (width 150, height 200)
      
      const zoomFactor = 1 - (progress / 100) * 0.5; // 1.0 -> 0.5
      const w = 300 * zoomFactor;
      const h = 400 * zoomFactor;
      
      // Center point target is currentPos
      // But we must clamp so we don't go out of bounds of the SVG 300x400 coordinate space too much (or let it, for effect)
      // Let's try centering on climber
      let x = currentPos.x - w / 2;
      let y = currentPos.y - h / 2;
      
      // Smooth clamping? No, let camera follow freely
      setViewBox(`${x} ${y} ${w} ${h}`);
  }, [progress, currentPos]);


  const pathString = POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const mountainShape = `${pathString} L 280 380 L 20 380 Z`;
  const strokeColor = isChristmas ? '#166534' : '#3b82f6';
  const trackColor = isChristmas ? '#bbf7d0' : '#e2e8f0';

  return (
    <div className="mountain-container" style={{ position: 'relative', width: '300px', height: '400px', margin: '0 auto', overflow: 'hidden', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <motion.svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        // Animate viewBox change smoothly
        animate={{ viewBox }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
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
        
        <path d={mountainShape} fill="url(#mountainGradient)" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
        <path d={pathString} fill="none" stroke={trackColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" />

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

        {/* Climber inside SVG for Zoom variation so it scales with viewbox */}
        <g transform={`translate(${currentPos.x - 12}, ${currentPos.y - 12})`}> 
            {/* Native SVG climber replacement or wrap HTML? Wrapping HTML in foreignObject is tricky with scaling.
                Let's use a simple circle/group for the zoomed view or map the Climber component carefully.
                Actually, simpler: Just use a scaled group. 
             */}
             <circle cx="12" cy="12" r="16" fill="white" stroke={strokeColor} strokeWidth="2" />
             <text x="12" y="16" fontSize="16" textAnchor="middle">{isChristmas ? '🎅' : '🧗'}</text>
        </g>
      </motion.svg>
    </div>
  );
}

export default MountainPathZoom;
