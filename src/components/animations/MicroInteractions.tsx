import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_TOKENS } from '@/lib/animations';

// Haptic-style button feedback
interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };

  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: ANIMATION_TOKENS.duration.micro }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: ANIMATION_TOKENS.duration.micro }
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      <motion.span
        animate={{
          scale: isPressed ? 0.95 : 1,
          transition: { duration: ANIMATION_TOKENS.duration.micro }
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// Floating action button with ripple effect
interface FloatingActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  className,
  size = 'md'
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg',
        'flex items-center justify-center',
        sizes[size],
        className
      )}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.3)',
        transition: { duration: ANIMATION_TOKENS.duration.fast }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ rotate: 15 }}
        whileTap={{ rotate: -15 }}
        transition={{ duration: ANIMATION_TOKENS.duration.fast }}
      >
        {icon}
      </motion.div>
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ 
              width: 100, 
              height: 100, 
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeOut' }
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

// Magnetic hover effect
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 20
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Tilt effect on hover
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  maxTilt = 15
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * maxTilt;
    
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      className={cn('transform-gpu', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      }}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
};

// Morphing icon button
interface MorphingIconProps {
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  isToggled: boolean;
  onToggle: () => void;
  className?: string;
}

export const MorphingIcon: React.FC<MorphingIconProps> = ({
  icon1,
  icon2,
  isToggled,
  onToggle,
  className
}) => {
  return (
    <motion.button
      className={cn(
        'relative p-2 rounded-full hover:bg-accent transition-colors',
        className
      )}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isToggled ? 'icon2' : 'icon1'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: ANIMATION_TOKENS.duration.fast }}
        >
          {isToggled ? icon2 : icon1}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

// Pulse effect for notifications
interface PulseProps {
  children: React.ReactNode;
  isActive?: boolean;
  color?: string;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  isActive = true,
  color = 'rgb(59, 130, 246)',
  className
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
};

// Elastic scale on interaction
interface ElasticProps {
  children: React.ReactNode;
  className?: string;
}

export const Elastic: React.FC<ElasticProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.05,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10
        }
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Breathing animation for loading states
interface BreathingProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const Breathing: React.FC<BreathingProps> = ({
  children,
  className,
  duration = 2
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};
