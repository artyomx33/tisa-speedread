import type { ExerciseType } from '@/schemas/user'

export interface ExerciseConfig {
  id: ExerciseType
  title: string
  subtitle: string
  icon: string
  color: string
  colorClass: string
  description: string
  instructions: string[]
  tips: string[]
}

export const exercises: ExerciseConfig[] = [
  {
    id: 'pointerWand',
    title: 'The Pointer Wand',
    subtitle: 'Follow the magic line',
    icon: '🪄',
    color: '#4A90D9',
    colorClass: 'bg-pointer-wand',
    description: 'Train your eyes to follow a consistent pace using a moving highlight.',
    instructions: [
      'A glowing line will move across each line of text',
      'Keep your eyes following the line as it moves',
      'Try not to look ahead or behind - stay with the pointer',
      'The pointer will speed up as you improve',
    ],
    tips: [
      'Relax your eyes and let them follow naturally',
      'If you fall behind, keep going - don\'t go back',
      'Practice makes perfect!',
    ],
  },
  {
    id: 'silentShadow',
    title: 'The Silent Shadow',
    subtitle: 'Quiet your inner voice',
    icon: '🔇',
    color: '#9B6DD9',
    colorClass: 'bg-silent-shadow',
    description: 'Break the habit of reading aloud in your head by counting while reading.',
    instructions: [
      'Read the text silently with your eyes',
      'At the same time, count "1, 2, 3, 4..." out loud or in your head',
      'The counting keeps your inner voice busy',
      'This trains your brain to understand words without "saying" them',
    ],
    tips: [
      'It feels weird at first - that\'s normal!',
      'Start slow and speed up as you get comfortable',
      'You\'ll understand more than you think',
    ],
  },
  {
    id: 'sideScanner',
    title: 'Side Vision Scan',
    subtitle: 'See more with each look',
    icon: '🦅',
    color: '#4CAF7A',
    colorClass: 'bg-side-scanner',
    description: 'Expand your peripheral vision to read more words in a single glance.',
    instructions: [
      'Focus your eyes on the center of each line',
      'The guide lines show you the "focus zone"',
      'Try to read the words on the edges without looking directly at them',
      'Your side vision is stronger than you think!',
    ],
    tips: [
      'Don\'t move your eyes to the edges - use peripheral vision',
      'Start with the guides visible, then try without them',
      'Eagles can see fish from high up using peripheral vision - you can too!',
    ],
  },
  {
    id: 'timeBoss',
    title: 'Time Boss Drill',
    subtitle: 'Beat the clock',
    icon: '⏱️',
    color: '#E5A84B',
    colorClass: 'bg-time-boss',
    description: 'Push your reading speed by compressing time across 4 rounds.',
    instructions: [
      'Round 1 (4 min): Read normally and click where you finish',
      'Round 2 (3 min): Read faster to reach the same spot',
      'Round 3 (2 min): Push harder to reach your mark',
      'Round 4 (1 min): Maximum speed - can you still make it?',
    ],
    tips: [
      'Don\'t worry about understanding everything at first',
      'Your brain is faster than you think',
      'Each round trains your brain to process faster',
    ],
  },
]

export function getExerciseConfig(exerciseId: ExerciseType): ExerciseConfig {
  return exercises.find(e => e.id === exerciseId) || exercises[0]
}
