'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subValue?: string
  color?: 'blue' | 'gold' | 'green' | 'purple' | 'orange'
  className?: string
}

const colors = {
  blue: 'bg-tisa-blue/10 text-tisa-blue',
  gold: 'bg-xp-gold/10 text-xp-gold',
  green: 'bg-success/10 text-success',
  purple: 'bg-level-purple/10 text-level-purple',
  orange: 'bg-streak-orange/10 text-streak-orange',
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'blue',
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'p-4 rounded-xl bg-surface border border-border',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-foreground-muted">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-foreground-secondary mt-0.5">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
