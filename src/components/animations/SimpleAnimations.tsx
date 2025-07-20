import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Simple fade in animation
interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  delay = 0, 
  duration = 0.5, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Simple slide up animation
interface SlideUpProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
}

export const SlideUp: React.FC<SlideUpProps> = ({ 
  delay = 0, 
  duration = 0.5, 
  distance = 20,
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Simple scale animation
interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  delay?: number;
  duration?: number;
  scale?: number;
  children: React.ReactNode;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ 
  delay = 0, 
  duration = 0.5, 
  scale = 0.9,
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for animating children in sequence
interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants'> {
  staggerDelay?: number;
  children: React.ReactNode;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  staggerDelay = 0.1, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: React.ReactNode;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover scale effect
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  scale?: number;
  children: React.ReactNode;
}

export const HoverScale: React.FC<HoverScaleProps> = ({ 
  scale = 1.02, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated card with hover effects
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverScale?: number;
  hoverY?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  hoverScale = 1.02,
  hoverY = -4,
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={cn(
        'bg-card text-card-foreground rounded-lg border shadow-sm transition-shadow',
        className
      )}
      whileHover={{ 
        scale: hoverScale,
        y: hoverY,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for loading or attention
interface PulseProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  scale?: [number, number];
  duration?: number;
}

export const Pulse: React.FC<PulseProps> = ({ 
  scale = [1, 1.05],
  duration = 2,
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Bounce animation
interface BounceProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  delay?: number;
  children: React.ReactNode;
}

export const Bounce: React.FC<BounceProps> = ({ 
  delay = 0,
  className, 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.3, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 10,
        delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
