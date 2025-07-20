import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Base glassmorphism styles
const glassBaseStyles = 'backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10';

// Glass variants
export type GlassVariant = 'default' | 'strong' | 'subtle' | 'colored' | 'gradient';

const glassVariants: Record<GlassVariant, string> = {
  default: 'backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10',
  strong: 'backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20',
  subtle: 'backdrop-blur-sm bg-white/5 dark:bg-white/2 border border-white/10 dark:border-white/5',
  colored: 'backdrop-blur-md bg-primary/10 dark:bg-primary/5 border border-primary/20 dark:border-primary/10',
  gradient: 'backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 dark:from-white/10 dark:to-white/2 border border-white/20 dark:border-white/10'
};

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  hover?: boolean;
  glow?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  rounded = 'lg'
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  return (
    <motion.div
      className={cn(
        glassVariants[variant],
        roundedClasses[rounded],
        'shadow-lg shadow-black/5',
        glow && 'shadow-2xl shadow-primary/10',
        className
      )}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        boxShadow: glow 
          ? '0 25px 50px -12px rgba(var(--primary), 0.25)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};

// Glass Button Component
interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      className={cn(
        glassVariants[variant],
        sizeClasses[size],
        'rounded-lg font-medium transition-all duration-200',
        'hover:bg-white/20 dark:hover:bg-white/10',
        'active:scale-95',
        'flex items-center justify-center',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.button>
  );
};

// Glass Modal/Dialog Component
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  variant = 'strong'
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className={cn(
          glassVariants[variant],
          'relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto',
          className
        )}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Glass Navigation Component
interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  fixed?: boolean;
}

export const GlassNav: React.FC<GlassNavProps> = ({
  children,
  className,
  variant = 'default',
  fixed = true
}) => {
  return (
    <motion.nav
      className={cn(
        glassVariants[variant],
        'shadow-lg',
        fixed && 'fixed top-0 left-0 right-0 z-40',
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.nav>
  );
};

// Glass Input Component
interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  variant?: GlassVariant;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  variant = 'default'
}) => {
  return (
    <motion.input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn(
        glassVariants[variant],
        'rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'transition-all duration-200',
        className
      )}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    />
  );
};

// Animated Gradient Background
interface AnimatedGradientProps {
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  children,
  className,
  colors = ['#667eea', '#764ba2', '#f093fb'],
  speed = 'medium'
}) => {
  const speedClasses = {
    slow: 'animate-gradient-slow',
    medium: 'animate-gradient-medium',
    fast: 'animate-gradient-fast'
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        speedClasses[speed],
        className
      )}
      style={{
        background: `linear-gradient(-45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%'
      }}
    >
      {children}
    </div>
  );
};

// Floating Glass Elements
interface FloatingGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  delay?: number;
}

export const FloatingGlass: React.FC<FloatingGlassProps> = ({
  children,
  className,
  variant = 'subtle',
  delay = 0
}) => {
  return (
    <motion.div
      className={cn(
        glassVariants[variant],
        'rounded-full shadow-lg',
        className
      )}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};
