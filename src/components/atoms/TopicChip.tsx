'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Topic } from '@/schemas/user'
import { getTopicConfig } from '@/config/topics'

interface TopicChipProps {
  topic: Topic
  isSelected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
}

export function TopicChip({
  topic,
  isSelected = false,
  onClick,
  size = 'md',
  disabled = false,
}: TopicChipProps) {
  const config = getTopicConfig(topic)
  if (!config) return null

  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium transition-all',
        'border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-tisa-blue',
        sizes[size],
        isSelected
          ? 'bg-tisa-blue text-white border-tisa-blue'
          : 'bg-surface text-foreground border-border hover:border-tisa-blue/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.button>
  )
}
