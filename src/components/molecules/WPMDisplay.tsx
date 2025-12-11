'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface WPMDisplayProps {
  wpm: number
  previousWPM?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTrend?: boolean
  label?: string
  animated?: boolean
  className?: string
}

const sizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
  xl: 'text-7xl',
}

export function WPMDisplay({
  wpm,
  previousWPM,
  size = 'lg',
  showTrend = false,
  label = 'WPM',
  animated = true,
  className,
}: WPMDisplayProps) {
  const trend = previousWPM ? wpm - previousWPM : 0
  const trendPercent = previousWPM ? Math.round((trend / previousWPM) * 100) : 0

  const TrendIcon =
    trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={wpm}
          initial={animated ? { scale: 0.8, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className={cn(
            'font-bold tabular-nums text-foreground',
            sizes[size]
          )}
        >
          {wpm}
        </motion.div>
      </AnimatePresence>

      <span className="text-lg text-foreground-muted font-medium">{label}</span>

      {showTrend && previousWPM !== undefined && trend !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend > 0 ? 'text-success' : 'text-error'
          )}
        >
          <TrendIcon className="w-4 h-4" />
          <span>
            {trend > 0 ? '+' : ''}
            {trend} ({trendPercent > 0 ? '+' : ''}
            {trendPercent}%)
          </span>
        </motion.div>
      )}
    </div>
  )
}
