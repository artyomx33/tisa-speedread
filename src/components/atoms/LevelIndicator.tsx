'use client'

import { cn } from '@/lib/utils'
import { getLevelConfig, getXPForNextLevel } from '@/config/levels'
import { ProgressBar } from './ProgressBar'

interface LevelIndicatorProps {
  level: number
  xp: number
  showProgress?: boolean
  showTitle?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: {
    badge: 'w-8 h-8 text-sm',
    title: 'text-xs',
  },
  md: {
    badge: 'w-10 h-10 text-base',
    title: 'text-sm',
  },
  lg: {
    badge: 'w-14 h-14 text-xl',
    title: 'text-base',
  },
}

export function LevelIndicator({
  level,
  xp,
  showProgress = false,
  showTitle = false,
  size = 'md',
  className,
}: LevelIndicatorProps) {
  const levelConfig = getLevelConfig(level)
  const xpProgress = getXPForNextLevel(xp)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-level-purple text-white font-bold',
          'border-2 border-level-purple/30',
          sizes[size].badge
        )}
      >
        {level}
      </div>
      <div className="flex flex-col gap-1">
        {showTitle && (
          <span className={cn('font-medium text-foreground', sizes[size].title)}>
            {levelConfig.title}
          </span>
        )}
        {showProgress && (
          <div className="w-24">
            <ProgressBar
              progress={xpProgress.current}
              max={xpProgress.needed}
              size="sm"
              color="purple"
            />
            <span className="text-xs text-foreground-muted">
              {xpProgress.current}/{xpProgress.needed} XP
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
