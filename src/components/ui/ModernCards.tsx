import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassmorphismComponents';

// Modern Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  glowing?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  glowing = false
}) => {
  return (
    <GlassCard
      variant="gradient"
      glow={glowing}
      className={cn('p-6 group cursor-pointer', className)}
    >
      <motion.div
        className="flex flex-col items-center text-center space-y-4"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div
          className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </GlassCard>
  );
};

// Modern Stats Card
interface StatsCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  icon,
  className
}) => {
  return (
    <GlassCard
      variant="strong"
      className={cn('p-6', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <motion.p
            className="text-2xl font-bold text-foreground"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {value}
          </motion.p>
          {change && (
            <motion.div
              className={cn(
                'flex items-center text-xs mt-2',
                change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="mr-1">
                {change.type === 'increase' ? '↗' : '↘'}
              </span>
              {Math.abs(change.value)}%
            </motion.div>
          )}
        </div>
        {icon && (
          <motion.div
            className="p-3 rounded-full bg-primary/10 text-primary"
            whileHover={{ scale: 1.1, rotate: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};

// Modern Profile Card
interface ProfileCardProps {
  avatar: string;
  name: string;
  role: string;
  bio?: string;
  stats?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatar,
  name,
  role,
  bio,
  stats,
  className
}) => {
  return (
    <GlassCard
      variant="gradient"
      className={cn('p-6 text-center', className)}
    >
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 10 }}
          />
        </motion.div>
        
        <div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-primary font-medium">{role}</p>
          {bio && (
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{bio}</p>
          )}
        </div>

        {stats && (
          <motion.div
            className="flex justify-center space-x-6 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </GlassCard>
  );
};

// Modern Product Card
interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  badge?: string;
  className?: string;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  rating,
  badge,
  className,
  onAddToCart
}) => {
  return (
    <GlassCard
      variant="default"
      className={cn('overflow-hidden group', className)}
    >
      <div className="relative">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {badge && (
          <motion.div
            className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {badge}
          </motion.div>
        )}
        <motion.div
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            className="px-4 py-2 bg-white text-black rounded-lg font-medium"
            onClick={onAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-muted-foreground">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

// Modern Testimonial Card
interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  rating?: number;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  rating,
  className
}) => {
  return (
    <GlassCard
      variant="gradient"
      className={cn('p-6', className)}
    >
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {rating && (
          <motion.div
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  'text-lg',
                  index < rating ? 'text-yellow-500' : 'text-gray-300'
                )}
              >
                ★
              </span>
            ))}
          </motion.div>
        )}
        
        <blockquote className="text-foreground italic leading-relaxed">
          "{quote}"
        </blockquote>
        
        <motion.div
          className="flex items-center space-x-3 pt-4 border-t border-white/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-foreground">{author.name}</p>
            <p className="text-sm text-muted-foreground">{author.role}</p>
          </div>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
};
