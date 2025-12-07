import { motion } from 'framer-motion';

interface ClimberProps {
  isChristmas?: boolean;
  imageSrc?: string;
}

export function Climber({ isChristmas, imageSrc }: ClimberProps) {
  return (
    <motion.div
      className="climber-avatar"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={isChristmas ? { color: '#dc2626', borderColor: '#bbf7d0' } : undefined}
    >
      <div className="climber-inner" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%' }}>
        {isChristmas && (
            <div 
                style={{ 
                    position: 'absolute', 
                    top: -12, 
                    left: -4, 
                    fontSize: '18px', 
                    transform: 'rotate(-15deg)',
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
                    zIndex: 10
                }}
            >
                🎅
            </div>
        )}
        
        {imageSrc ? (
            <img 
                src={imageSrc} 
                alt="Climber" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        ) : (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="climber-icon"
            >
            <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
            />
            </svg>
        )}
      </div>
    </motion.div>
  );
}

export default Climber;
