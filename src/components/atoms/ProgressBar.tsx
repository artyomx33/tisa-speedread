'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gold' | 'green' | 'purple' | 'orange'
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colors = {
  blue: 'bg-tisa-blue',
  gold: 'bg-xp-gold',
  green: 'bg-success',
  purple: 'bg-level-purple',
  orange: 'bg-streak-orange',
}

export function ProgressBar({
  progress,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100)

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm text-foreground-secondary">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-border rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
