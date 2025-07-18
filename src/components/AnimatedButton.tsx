import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'magnetic';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  href,
  target,
  rel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  // Magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || variant !== 'magnetic') return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * 0.3);
    y.set(deltaY * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 overflow-hidden',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'px-3 py-1.5 text-sm rounded-md': size === 'sm',
      'px-4 py-2 text-base rounded-lg': size === 'md',
      'px-6 py-3 text-lg rounded-xl': size === 'lg',
    },
    {
      'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50': variant === 'primary',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/50': variant === 'secondary',
      'bg-transparent text-foreground hover:bg-muted focus:ring-muted': variant === 'ghost',
      'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg focus:ring-primary/50': variant === 'magnetic',
    },
    {
      'opacity-50 cursor-not-allowed': disabled,
    },
    className
  );

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: variant === 'magnetic' ? 1.05 : 1.02,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: {
      scale: 4,
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: variant === 'magnetic' ? 0.8 : 0,
      transition: { duration: 0.3 }
    },
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as any}
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      style={variant === 'magnetic' ? { x: springX, y: springY } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      href={href}
      target={target}
      rel={rel}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary/20 to-accent/20 blur-lg"
        variants={glowVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
        variants={rippleVariants}
        initial="initial"
        animate={isHovered ? "animate" : "initial"}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 w-4"
        animate={{
          x: isHovered ? '200%' : '-100%',
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />
    </Component>
  );
};

export default AnimatedButton;
