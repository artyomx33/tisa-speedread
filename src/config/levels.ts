export interface LevelConfig {
  level: number
  title: string
  xpRequired: number
  unlocks: string
}

export const levels: LevelConfig[] = [
  { level: 1, title: 'Apprentice Reader', xpRequired: 0, unlocks: 'Basic exercises' },
  { level: 2, title: 'Rising Star', xpRequired: 100, unlocks: 'Speed Duel' },
  { level: 3, title: 'Word Warrior', xpRequired: 300, unlocks: 'Custom themes' },
  { level: 4, title: 'Speed Ninja', xpRequired: 600, unlocks: 'Advanced stats' },
  { level: 5, title: 'Reading Master', xpRequired: 1000, unlocks: 'All features' },
]

export function getLevelConfig(level: number): LevelConfig {
  return levels.find(l => l.level === level) || levels[0]
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const currentLevel = levels.findIndex(l => l.xpRequired > currentXP)

  if (currentLevel === -1) {
    return { current: currentXP, needed: levels[levels.length - 1].xpRequired, progress: 100 }
  }

  const prevLevelXP = currentLevel === 0 ? 0 : levels[currentLevel - 1].xpRequired
  const nextLevelXP = levels[currentLevel].xpRequired
  const xpInLevel = currentXP - prevLevelXP
  const xpNeeded = nextLevelXP - prevLevelXP

  return {
    current: xpInLevel,
    needed: xpNeeded,
    progress: Math.round((xpInLevel / xpNeeded) * 100),
  }
}
