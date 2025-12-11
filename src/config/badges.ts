import type { Badge } from '@/schemas/user'

export interface BadgeConfig {
  id: Badge
  name: string
  icon: string
  description: string
  requirement: string
}

export const badges: BadgeConfig[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    icon: '👶',
    description: "You've begun your journey!",
    requirement: 'Complete baseline test',
  },
  {
    id: 'pointer_pro',
    name: 'Pointer Pro',
    icon: '🪄',
    description: 'Master of the magic wand!',
    requirement: '5 Pointer Wand sessions',
  },
  {
    id: 'silent_reader',
    name: 'Silent Reader',
    icon: '🔇',
    description: 'Your inner voice is quiet!',
    requirement: '5 Silent Shadow sessions',
  },
  {
    id: 'side_scanner',
    name: 'Side Scanner',
    icon: '🦅',
    description: 'Eyes like a hawk!',
    requirement: '5 Side Vision sessions',
  },
  {
    id: 'time_bender',
    name: 'Time Bender',
    icon: '⏱️',
    description: 'You control time itself!',
    requirement: '5 Time Boss completions',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Faster than lightning!',
    requirement: 'Reach 200+ WPM',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '🔥',
    description: 'A whole week of reading!',
    requirement: '7-day streak',
  },
  {
    id: 'month_master',
    name: 'Month Master',
    icon: '🌟',
    description: 'Unstoppable dedication!',
    requirement: '30-day streak',
  },
  {
    id: 'level_up',
    name: 'Level Up',
    icon: '⬆️',
    description: 'Growing stronger!',
    requirement: 'Reach level 2',
  },
  {
    id: 'centurion',
    name: 'Centurion',
    icon: '💯',
    description: '100 sessions complete!',
    requirement: '100 total sessions',
  },
]

export function getBadgeConfig(badgeId: Badge): BadgeConfig | undefined {
  return badges.find(b => b.id === badgeId)
}
