import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'tilt';
  hover?: 'lift' | 'scale' | 'glow' | 'tilt' | 'none';
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = 'lift',
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || (variant !== 'tilt' && hover !== 'tilt')) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseClasses = cn(
    'relative overflow-hidden transition-all duration-300',
    {
      'bg-card border border-border rounded-lg shadow-sm': variant === 'default',
      'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-xl shadow-lg': variant === 'glass',
      'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl shadow-lg': variant === 'gradient',
      'bg-card border border-border rounded-xl shadow-lg': variant === 'tilt',
    },
    {
      'cursor-pointer': onClick,
    },
    className
  );

  const cardVariants = {
    initial: { 
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: hover === 'scale' ? 1.03 : 1,
      y: hover === 'lift' ? -8 : 0,
      boxShadow: hover === 'lift' 
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        : hover === 'glow'
        ? '0 0 20px rgba(139, 92, 246, 0.3)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const tiltVariants = {
    initial: {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
    hover: {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: hover === 'glow' ? 0.6 : 0,
      transition: { duration: 0.3 }
    },
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    hover: {
      x: '100%',
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      variants={variant === 'tilt' || hover === 'tilt' ? tiltVariants : cardVariants}
      initial="initial"
      whileHover="hover"
      style={
        variant === 'tilt' || hover === 'tilt'
          ? {
              perspective: 1000,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary/20 to-accent/20 blur-xl"
        variants={glowVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      />

      {/* Border gradient */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary to-accent p-[1px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-background rounded-inherit" />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Floating particles for glass variant */}
      {variant === 'glass' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedCard;
