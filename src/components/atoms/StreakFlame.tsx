'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'

interface StreakFlameProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizes = {
  sm: {
    icon: 'w-5 h-5',
    text: 'text-sm',
    container: 'gap-1',
  },
  md: {
    icon: 'w-6 h-6',
    text: 'text-base',
    container: 'gap-1.5',
  },
  lg: {
    icon: 'w-8 h-8',
    text: 'text-xl',
    container: 'gap-2',
  },
}

export function StreakFlame({
  streak,
  size = 'md',
  showLabel = true,
  className,
}: StreakFlameProps) {
  const isActive = streak > 0

  return (
    <div
      className={cn(
        'inline-flex items-center font-bold',
        sizes[size].container,
        isActive ? 'text-streak-orange' : 'text-foreground-muted',
        className
      )}
    >
      <motion.div
        animate={
          isActive
            ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <Flame className={cn(sizes[size].icon, isActive && 'fill-current')} />
      </motion.div>
      <span className={sizes[size].text}>{streak}</span>
      {showLabel && (
        <span className="text-foreground-muted font-normal text-sm">
          day{streak !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}
