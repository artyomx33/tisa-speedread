import { z } from 'zod'

export const TopicSchema = z.enum([
  'dinosaurs',
  'space',
  'robots',
  'animals',
  'superheroes',
  'ocean',
  'sports',
  'magic',
  'nature',
  'adventures',
  'science',
  'minecraft',
  'pokemon',
  'cars',
  'music'
])

export const BadgeSchema = z.enum([
  'first_steps',
  'pointer_pro',
  'silent_reader',
  'side_scanner',
  'time_bender',
  'speed_demon',
  'week_warrior',
  'month_master',
  'level_up',
  'centurion',
])

export const ExerciseTypeSchema = z.enum([
  'pointerWand',
  'silentShadow',
  'sideScanner',
  'timeBoss',
])

export const UserProfileSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(5).max(15),
  topics: z.array(TopicSchema).min(1).max(5),
  createdAt: z.string().datetime(),
})

export const ExerciseStatsSchema = z.object({
  sessions: z.number().int().min(0),
  bestWPM: z.number().int().min(0),
  totalTime: z.number().min(0),
  lastPlayed: z.string().datetime().nullable(),
})

export const WPMRecordSchema = z.object({
  date: z.string().datetime(),
  wpm: z.number().int().min(0),
  exercise: z.string(),
})

export const WeeklyDuelSchema = z.object({
  weekStart: z.string(),
  wpm: z.number().int().min(0),
  improved: z.boolean(),
})

export const SettingsSchema = z.object({
  soundEnabled: z.boolean(),
  showGuides: z.boolean(),
  pointerSpeed: z.number().min(0.5).max(2),
})

export const UserStateSchema = z.object({
  profile: UserProfileSchema.nullable(),
  hasCompletedOnboarding: z.boolean(),
  baselineWPM: z.number().int().min(0),
  currentWPM: z.number().int().min(0),
  xp: z.number().int().min(0),
  level: z.number().int().min(1),
  streak: z.number().int().min(0),
  lastActiveDate: z.string().nullable(),
  exercises: z.object({
    pointerWand: ExerciseStatsSchema,
    silentShadow: ExerciseStatsSchema,
    sideScanner: ExerciseStatsSchema,
    timeBoss: ExerciseStatsSchema,
  }),
  badges: z.array(BadgeSchema),
  wpmHistory: z.array(WPMRecordSchema),
  weeklyDuels: z.array(WeeklyDuelSchema),
  settings: SettingsSchema,
})

export type Topic = z.infer<typeof TopicSchema>
export type Badge = z.infer<typeof BadgeSchema>
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type ExerciseStats = z.infer<typeof ExerciseStatsSchema>
export type WPMRecord = z.infer<typeof WPMRecordSchema>
export type WeeklyDuel = z.infer<typeof WeeklyDuelSchema>
export type Settings = z.infer<typeof SettingsSchema>
export type UserState = z.infer<typeof UserStateSchema>
