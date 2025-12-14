'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'

interface TimerProps {
  duration: number
  isRunning: boolean
  onComplete?: () => void
  onTick?: (remaining: number) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'countdown' | 'minimal'
  showProgress?: boolean
  className?: string
}

const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function Timer({
  duration,
  isRunning,
  onComplete,
  onTick,
  size = 'md',
  variant = 'default',
  showProgress = false,
  className,
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [prevDuration, setPrevDuration] = useState(duration)

  // Reset when duration changes - using derived state pattern
  if (duration !== prevDuration) {
    setRemaining(duration)
    setHasCompleted(false)
    setPrevDuration(duration)
  }

  useEffect(() => {
    if (!isRunning || hasCompleted) return

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const newValue = prev - 1
        if (newValue <= 0) {
          setHasCompleted(true)
          onComplete?.()
          return 0
        }
        onTick?.(newValue)
        return newValue
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, hasCompleted, onComplete, onTick])

  const progress = ((duration - remaining) / duration) * 100
  const isWarning = remaining <= 10 && remaining > 0
  const isCritical = remaining <= 5 && remaining > 0

  if (variant === 'minimal') {
    return (
      <span className={cn('font-mono font-bold', sizes[size], className)}>
        {formatTime(remaining)}
      </span>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={remaining}
          initial={{ scale: isWarning ? 1.1 : 1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'font-mono font-bold tabular-nums',
            sizes[size],
            isCritical && 'text-error',
            isWarning && !isCritical && 'text-warning',
            !isWarning && 'text-foreground'
          )}
        >
          {formatTime(remaining)}
        </motion.div>
      </AnimatePresence>

      {showProgress && (
        <div className="w-full max-w-[200px] h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isCritical ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-tisa-blue'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}

export function useTimer(duration: number) {
  const [remaining, setRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  const start = useCallback(() => {
    setIsRunning(true)
    setHasCompleted(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setRemaining(duration)
    setIsRunning(false)
    setHasCompleted(false)
  }, [duration])

  const getElapsed = useCallback(() => {
    return duration - remaining
  }, [duration, remaining])

  useEffect(() => {
    if (!isRunning || hasCompleted) return

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setHasCompleted(true)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, hasCompleted])

  return {
    remaining,
    isRunning,
    hasCompleted,
    start,
    pause,
    reset,
    getElapsed,
    formatted: formatTime(remaining),
  }
}
