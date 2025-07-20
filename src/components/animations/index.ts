// Simple, safe animations (use these first)
export * from './SimpleAnimations';

// Loading states and skeletons
export * from './LoadingStates';

// Core animation system (advanced components have "Advanced" prefix to avoid conflicts)
export {
  AnimatedContainer,
  AdvancedFadeIn,
  AdvancedScaleIn,
  AdvancedSlideUp,
  AdvancedSlideDown,
  AdvancedSlideLeft,
  AdvancedSlideRight,
  BounceIn,
  RotateIn,
  GlassContainer,
  AdvancedStaggerContainer,
  AdvancedStaggerItem,
  InteractiveContainer,
  AdvancedAnimatedCard,
  AnimatedButton,
  TextReveal
} from './AnimatedContainer';

export * from './ScrollAnimations';
export * from './MicroInteractions';

// Re-export animation tokens and variants
export * from '@/lib/animations';

// Animation hooks and utilities
export { useInView } from 'framer-motion';
export { motion, AnimatePresence } from 'framer-motion';
