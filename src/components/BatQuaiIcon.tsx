import React from 'react';
import { motion } from 'motion/react';

interface BatQuaiIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const BatQuaiIcon: React.FC<BatQuaiIconProps> = ({
  className = '',
  size = 32,
  animate = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow aura */}
      <div className="absolute inset-0 rounded-full bg-[#E9CE84]/30 blur-xs" />

      {/* Rotating Outer Trigram Ring */}
      <motion.div
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="w-full h-full relative"
      >
        <img
          src="/bat_quai_icon.jpg"
          alt="Bát Quái Magic Circle"
          className="w-full h-full object-cover rounded-full"
        />
      </motion.div>
    </div>
  );
};
