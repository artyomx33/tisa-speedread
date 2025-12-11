'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { xpFloat } from '@/lib/animations'

interface XPCounterProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function XPCounter({
  amount,
  size = 'md',
  showIcon = true,
  className,
}: XPCounterProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-bold text-xp-gold',
        sizes[size],
        className
      )}
    >
      {showIcon && <span>✨</span>}
      <span>{amount.toLocaleString()}</span>
      <span className="text-foreground-muted font-normal">XP</span>
    </div>
  )
}

interface XPGainProps {
  amount: number
  show: boolean
  onComplete?: () => void
}

export function XPGain({ amount, show, onComplete }: XPGainProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          variants={xpFloat}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="text-4xl font-bold text-xp-gold drop-shadow-lg">
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
