import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  fadeVariants,
  scaleVariants,
  slideVariants,
  bounceVariants,
  rotateVariants,
  glassVariants,
  staggerContainer,
  staggerItem,
  ANIMATION_TOKENS
} from '@/lib/animations';

type AnimationType = 
  | 'fade'
  | 'scale'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'bounce'
  | 'rotate'
  | 'glass'
  | 'stagger'
  | 'staggerItem';

interface AnimatedContainerProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  animation?: AnimationType;
  delay?: number;
  duration?: keyof typeof ANIMATION_TOKENS.duration;
  className?: string;
  children: React.ReactNode;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: number | 'some' | 'all';
  };
  customVariants?: Variants;
}

const getVariants = (animation: AnimationType): Variants => {
  switch (animation) {
    case 'fade':
      return fadeVariants;
    case 'scale':
      return scaleVariants;
    case 'slideUp':
      return slideVariants.up;
    case 'slideDown':
      return slideVariants.down;
    case 'slideLeft':
      return slideVariants.left;
    case 'slideRight':
      return slideVariants.right;
    case 'bounce':
      return bounceVariants;
    case 'rotate':
      return rotateVariants;
    case 'glass':
      return glassVariants;
    case 'stagger':
      return staggerContainer;
    case 'staggerItem':
      return staggerItem;
    default:
      return fadeVariants;
  }
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  animation = 'fade',
  delay = 0,
  duration = 'normal',
  className,
  children,
  viewport = { once: true, margin: '-50px' },
  customVariants,
  ...props
}) => {
  const variants = customVariants || getVariants(animation);
  
  // Apply duration override if specified
  const modifiedVariants = React.useMemo(() => {
    if (duration === 'normal') return variants;
    
    const durationValue = ANIMATION_TOKENS.duration[duration];
    const newVariants = { ...variants };
    
    // Apply duration to all states
    Object.keys(newVariants).forEach(key => {
      if (typeof newVariants[key] === 'object' && newVariants[key].transition) {
        newVariants[key] = {
          ...newVariants[key],
          transition: {
            ...newVariants[key].transition,
            duration: durationValue,
            delay: delay
          }
        };
      }
    });
    
    return newVariants;
  }, [variants, duration, delay]);

  return (
    <motion.div
      className={cn(className)}
      variants={modifiedVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={viewport}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specialized animated components
export const AdvancedFadeIn: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="fade" {...props} />
);

export const AdvancedScaleIn: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="scale" {...props} />
);

export const AdvancedSlideUp: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="slideUp" {...props} />
);

export const AdvancedSlideDown: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="slideDown" {...props} />
);

export const AdvancedSlideLeft: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="slideLeft" {...props} />
);

export const AdvancedSlideRight: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="slideRight" {...props} />
);

export const BounceIn: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="bounce" {...props} />
);

export const RotateIn: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="rotate" {...props} />
);

export const GlassContainer: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="glass" {...props} />
);

export const AdvancedStaggerContainer: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="stagger" {...props} />
);

export const AdvancedStaggerItem: React.FC<Omit<AnimatedContainerProps, 'animation'>> = (props) => (
  <AnimatedContainer animation="staggerItem" {...props} />
);

// Interactive animated components
interface InteractiveAnimatedProps extends AnimatedContainerProps {
  whileHover?: any;
  whileTap?: any;
  whileFocus?: any;
}

export const InteractiveContainer: React.FC<InteractiveAnimatedProps> = ({
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
  whileFocus = { scale: 1.01 },
  ...props
}) => (
  <AnimatedContainer
    whileHover={whileHover}
    whileTap={whileTap}
    whileFocus={whileFocus}
    {...props}
  />
);

// Card with hover effects
export const AdvancedAnimatedCard: React.FC<InteractiveAnimatedProps> = ({
  className,
  whileHover = { 
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  },
  whileTap = { scale: 0.98 },
  ...props
}) => (
  <InteractiveContainer
    className={cn(
      'bg-card text-card-foreground rounded-lg border shadow-sm transition-shadow',
      className
    )}
    whileHover={whileHover}
    whileTap={whileTap}
    {...props}
  />
);

// Button with micro-interactions
export const AnimatedButton: React.FC<InteractiveAnimatedProps> = ({
  className,
  whileHover = { 
    scale: 1.05,
    transition: { duration: ANIMATION_TOKENS.duration.micro }
  },
  whileTap = { 
    scale: 0.95,
    transition: { duration: ANIMATION_TOKENS.duration.micro }
  },
  ...props
}) => (
  <InteractiveContainer
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    whileHover={whileHover}
    whileTap={whileTap}
    {...props}
  />
);

// Text reveal animation
export const TextReveal: React.FC<{
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}> = ({ children, className, delay = 0, staggerDelay = 0.02 }) => {
  const words = children.split(' ');
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: ANIMATION_TOKENS.duration.medium,
                ease: ANIMATION_TOKENS.easing.smooth
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
