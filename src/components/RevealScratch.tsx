import { useRef, useEffect, useState } from 'react';

type RevealScratchProps = {
  onComplete: () => void;
  isChristmas?: boolean;
};

export function RevealScratch({ onComplete, isChristmas }: RevealScratchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Fill with scratchable coating
      ctx.fillStyle = isChristmas ? '#d1d5db' : '#cbd5e1'; // Silver/Gray
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text or pattern to the coating
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isChristmas ? 'Scratch to Reveal! 🎄' : 'Scratch Here!', canvas.width / 2, canvas.height / 2);
      
      // Add some speckles/noise for texture
      for (let i = 0; i < 200; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#e5e7eb' : '#9ca3af';
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isChristmas]);

  const calculateProgress = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Sample pixels to check transparency
      // Optimisation: check every 10th pixel
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparentPixels = 0;
      
      // Check alpha channel (every 4th value)
      // Sampling every 32nd pixel for performance (step += 32 * 4)
      let sampleCount = 0;
      for (let i = 3; i < data.length; i += 128) {
          sampleCount++;
          if (data[i] === 0) {
              transparentPixels++;
          }
      }
      
      const percent = (transparentPixels / sampleCount) * 100;
      
      if (percent > 50) { // Threshold to auto-complete
          onComplete();
      }
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Throttle calculation
    if (Math.random() > 0.8) {
        calculateProgress();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  return (
    <div className="scratch-card-container" ref={containerRef} style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', cursor: 'grab' }}>
        {/* Placeholder for "underneath" content visualization */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #f3f4f6, #fff)', zIndex: 0 }}>
             <h2 style={{ opacity: 0.3 }}>Keep Scratching...</h2>
        </div>
        
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, touchAction: 'none' }}
        onMouseDown={(e) => { setIsDrawing(true); scratch(e.clientX, e.clientY); }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => { setIsDrawing(true); scratch(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}

export default RevealScratch;
