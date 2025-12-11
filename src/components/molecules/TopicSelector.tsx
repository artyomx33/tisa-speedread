'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TopicChip } from '@/components/atoms'
import { topics } from '@/config/topics'
import type { Topic } from '@/schemas/user'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface TopicSelectorProps {
  selectedTopics: Topic[]
  onToggle: (topic: Topic) => void
  maxSelections?: number
  className?: string
}

export function TopicSelector({
  selectedTopics,
  onToggle,
  maxSelections = 5,
  className,
}: TopicSelectorProps) {
  const isMaxed = selectedTopics.length >= maxSelections

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Pick your favorite topics (up to {maxSelections})
        </p>
        <span
          className={cn(
            'text-sm font-medium',
            isMaxed ? 'text-success' : 'text-foreground-secondary'
          )}
        >
          {selectedTopics.length}/{maxSelections}
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {topics.map((topic) => {
          const isSelected = selectedTopics.includes(topic.id)
          const isDisabled = isMaxed && !isSelected

          return (
            <motion.div key={topic.id} variants={staggerItem}>
              <TopicChip
                topic={topic.id}
                isSelected={isSelected}
                onClick={() => onToggle(topic.id)}
                disabled={isDisabled}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
