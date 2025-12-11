import type { Topic } from '@/schemas/user'

export interface TopicConfig {
  id: Topic
  label: string
  icon: string
  keywords: string[]
}

export const topics: TopicConfig[] = [
  { id: 'dinosaurs', label: 'Dinosaurs', icon: '🦕', keywords: ['T-Rex', 'fossils', 'prehistoric'] },
  { id: 'space', label: 'Space', icon: '🚀', keywords: ['planets', 'astronauts', 'stars'] },
  { id: 'robots', label: 'Robots', icon: '🤖', keywords: ['machines', 'technology', 'future'] },
  { id: 'animals', label: 'Animals', icon: '🦁', keywords: ['wildlife', 'jungle', 'ocean'] },
  { id: 'superheroes', label: 'Superheroes', icon: '🦸', keywords: ['powers', 'save', 'adventure'] },
  { id: 'ocean', label: 'Ocean', icon: '🌊', keywords: ['whales', 'fish', 'coral'] },
  { id: 'sports', label: 'Sports', icon: '⚽', keywords: ['soccer', 'basketball', 'winning'] },
  { id: 'magic', label: 'Magic', icon: '✨', keywords: ['wizards', 'spells', 'enchanted'] },
  { id: 'nature', label: 'Nature', icon: '🌲', keywords: ['forests', 'mountains', 'rivers'] },
  { id: 'adventures', label: 'Adventures', icon: '🗺️', keywords: ['treasure', 'exploring', 'journey'] },
  { id: 'science', label: 'Science', icon: '🔬', keywords: ['experiments', 'discoveries', 'lab'] },
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️', keywords: ['blocks', 'crafting', 'survival'] },
  { id: 'pokemon', label: 'Pokemon', icon: '⚡', keywords: ['trainers', 'battles', 'evolve'] },
  { id: 'cars', label: 'Cars', icon: '🏎️', keywords: ['racing', 'speed', 'engines'] },
  { id: 'music', label: 'Music', icon: '🎵', keywords: ['songs', 'instruments', 'rhythm'] },
]

export function getTopicConfig(topicId: Topic): TopicConfig | undefined {
  return topics.find(t => t.id === topicId)
}

export function getRandomTopic(userTopics: Topic[]): Topic {
  if (userTopics.length === 0) return 'adventures'
  return userTopics[Math.floor(Math.random() * userTopics.length)]
}
