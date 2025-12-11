'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronRight, Trophy, Clock } from 'lucide-react'
import type { ExerciseType } from '@/schemas/user'
import { getExerciseConfig } from '@/config/exercises'

interface ExerciseCardProps {
  exerciseId: ExerciseType
  sessions: number
  bestWPM: number
  isLocked?: boolean
  onClick: () => void
}

export function ExerciseCard({
  exerciseId,
  sessions,
  bestWPM,
  isLocked = false,
  onClick,
}: ExerciseCardProps) {
  const config = getExerciseConfig(exerciseId)

  return (
    <motion.button
      whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -2 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={cn(
        'w-full p-5 rounded-2xl text-left transition-all',
        'bg-surface border-2 border-border',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-tisa-blue',
        isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-border-secondary hover:shadow-md cursor-pointer'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${config.color}20` }}
        >
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">
              {config.title}
            </h3>
            {!isLocked && (
              <ChevronRight className="w-5 h-5 text-foreground-muted" />
            )}
          </div>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {config.subtitle}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
              <Clock className="w-4 h-4" />
              <span>{sessions} sessions</span>
            </div>
            {bestWPM > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-xp-gold">
                <Trophy className="w-4 h-4" />
                <span>{bestWPM} WPM</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80 rounded-2xl">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </motion.button>
  )
}
