'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { badgeUnlock } from '@/lib/animations'

interface BadgeProps {
  icon: string
  name: string
  description?: string
  isUnlocked?: boolean
  isNew?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const sizes = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl',
}

export function Badge({
  icon,
  name,
  description,
  isUnlocked = false,
  isNew = false,
  size = 'md',
  onClick,
}: BadgeProps) {
  return (
    <motion.div
      variants={isNew ? badgeUnlock : undefined}
      initial={isNew ? 'hidden' : undefined}
      animate={isNew ? 'visible' : undefined}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-2xl transition-all',
        onClick && 'cursor-pointer hover:bg-background-secondary',
        !isUnlocked && 'opacity-40'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-surface border-2',
          isUnlocked ? 'border-xp-gold shadow-lg' : 'border-border grayscale',
          sizes[size]
        )}
      >
        <span className={isUnlocked ? '' : 'grayscale'}>{icon}</span>
      </div>
      <div className="text-center">
        <p className={cn(
          'font-medium text-sm',
          isUnlocked ? 'text-foreground' : 'text-foreground-muted'
        )}>
          {name}
        </p>
        {description && (
          <p className="text-xs text-foreground-muted mt-0.5">{description}</p>
        )}
      </div>
      {isNew && isUnlocked && (
        <span className="absolute -top-1 -right-1 bg-streak-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
          NEW!
        </span>
      )}
    </motion.div>
  )
}
