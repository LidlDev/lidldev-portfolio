import { Variants, Transition } from 'framer-motion';

// Animation Design Tokens
export const ANIMATION_TOKENS = {
  // Durations
  duration: {
    instant: 0,
    micro: 0.1,
    fast: 0.2,
    normal: 0.3,
    medium: 0.4,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2,
  },
  
  // Easing curves
  easing: {
    // Standard curves
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    
    // Custom curves
    smooth: [0.4, 0, 0.2, 1],
    snappy: [0.4, 0, 0.6, 1],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    elastic: [0.175, 0.885, 0.32, 1.275],
    
    // Spring presets
    spring: {
      gentle: { type: 'spring', stiffness: 120, damping: 14 },
      wobbly: { type: 'spring', stiffness: 180, damping: 12 },
      stiff: { type: 'spring', stiffness: 400, damping: 30 },
      slow: { type: 'spring', stiffness: 280, damping: 60 },
      molasses: { type: 'spring', stiffness: 280, damping: 120 },
    }
  },
  
  // Scale values
  scale: {
    micro: 0.98,
    small: 0.95,
    medium: 0.9,
    large: 0.8,
    xl: 0.7,
  },
  
  // Blur values
  blur: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  }
} as const;

// Core Animation Variants
export const fadeVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION_TOKENS.duration.normal }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};

export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.medium,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  },
  exit: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.small,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};

export const slideVariants = {
  up: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  left: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  right: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }
} as const;

// Advanced Animation Variants
export const bounceVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.large,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
      duration: ANIMATION_TOKENS.duration.medium
    }
  },
  exit: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.small,
    y: -10,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};

export const rotateVariants: Variants = {
  hidden: { 
    opacity: 0,
    rotate: -10,
    scale: ANIMATION_TOKENS.scale.medium
  },
  visible: { 
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  },
  exit: { 
    opacity: 0,
    rotate: 10,
    scale: ANIMATION_TOKENS.scale.small,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};

// Glassmorphism variants
export const glassVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.small,
    backdropFilter: `blur(0px)`,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    backdropFilter: `blur(${ANIMATION_TOKENS.blur.md}px)`,
    y: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium,
      ease: ANIMATION_TOKENS.easing.smooth,
      backdropFilter: { duration: ANIMATION_TOKENS.duration.slow }
    }
  },
  exit: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.micro,
    backdropFilter: `blur(0px)`,
    y: -10,
    transition: { 
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  }
};

// Stagger animation helpers
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: ANIMATION_TOKENS.duration.fast
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: ANIMATION_TOKENS.duration.fast
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: ANIMATION_TOKENS.scale.small
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: ANIMATION_TOKENS.scale.micro,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};

// Hover and tap animations
export const hoverScale = {
  scale: 1.02,
  transition: { 
    duration: ANIMATION_TOKENS.duration.fast,
    ease: ANIMATION_TOKENS.easing.smooth
  }
};

export const tapScale = {
  scale: ANIMATION_TOKENS.scale.small,
  transition: { 
    duration: ANIMATION_TOKENS.duration.micro,
    ease: ANIMATION_TOKENS.easing.smooth
  }
};

// Page transition variants
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    x: -20,
    scale: ANIMATION_TOKENS.scale.small
  },
  in: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  },
  out: { 
    opacity: 0,
    x: 20,
    scale: ANIMATION_TOKENS.scale.micro,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  }
};

// Modal/Dialog variants
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.medium,
    y: 50
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: ANIMATION_TOKENS.duration.medium
    }
  },
  exit: { 
    opacity: 0,
    scale: ANIMATION_TOKENS.scale.small,
    y: -30,
    transition: { 
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth
    }
  }
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION_TOKENS.duration.normal }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_TOKENS.duration.fast }
  }
};
