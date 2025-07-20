import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_TOKENS } from '@/lib/animations';

// Parallax scroll component
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({ 
  children, 
  offset = 50, 
  className 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll reveal with custom trigger points
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  distance = 30,
  delay = 0,
  duration = ANIMATION_TOKENS.duration.medium,
  className,
  triggerOnce = true,
  threshold = 0.1
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: ANIMATION_TOKENS.easing.smooth
        }
      }}
      viewport={{ 
        once: triggerOnce, 
        amount: threshold,
        margin: '-50px'
      }}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered counter animation
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const ScrollCounter: React.FC<CounterProps> = ({
  from,
  to,
  duration = 2,
  className,
  suffix = '',
  prefix = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const count = useTransform(scrollYProgress, [0, 0.5], [from, to]);
  const rounded = useTransform(count, (value) => Math.round(value));

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string;
  height?: number;
  color?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  height = 4,
  color = 'hsl(var(--primary))'
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 origin-left',
        className
      )}
      style={{
        scaleX,
        height,
        backgroundColor: color
      }}
    />
  );
};

// Scroll-triggered stagger animation
interface StaggerScrollProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerScroll: React.FC<StaggerScrollProps> = ({
  children,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
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
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Magnetic scroll effect
interface MagneticScrollProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticScroll: React.FC<MagneticScrollProps> = ({
  children,
  strength = 0.1,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [strength * 100, 0, -strength * 100]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-based rotation
interface ScrollRotateProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
}

export const ScrollRotate: React.FC<ScrollRotateProps> = ({
  children,
  rotation = 360,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotation]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-based scale
interface ScrollScaleProps {
  children: React.ReactNode;
  scaleRange?: [number, number];
  className?: string;
}

export const ScrollScale: React.FC<ScrollScaleProps> = ({
  children,
  scaleRange = [0.8, 1.2],
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], 1, scaleRange[1]]);

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered morphing background
interface MorphingBackgroundProps {
  children: React.ReactNode;
  colors: string[];
  className?: string;
}

export const MorphingBackground: React.FC<MorphingBackgroundProps> = ({
  children,
  colors,
  className
}) => {
  const { scrollYProgress } = useScroll();
  
  const backgroundColor = useTransform(
    scrollYProgress,
    colors.map((_, i) => i / (colors.length - 1)),
    colors
  );

  return (
    <motion.div
      style={{ backgroundColor }}
      className={cn('transition-colors duration-300', className)}
    >
      {children}
    </motion.div>
  );
};

// Scroll-based text reveal
interface ScrollTextRevealProps {
  children: string;
  className?: string;
}

export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  children,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"]
  });

  const words = children.split(' ');
  
  return (
    <motion.div ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + (1 / words.length);
        
        return (
          <Word
            key={index}
            progress={scrollYProgress}
            range={[start, end]}
          >
            {word}
          </Word>
        );
      })}
    </motion.div>
  );
};

const Word: React.FC<{
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  
  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-1"
    >
      {children}
    </motion.span>
  );
};
