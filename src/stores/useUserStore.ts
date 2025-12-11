import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserState, Badge, Topic, ExerciseType } from '@/schemas/user'

const initialExerciseStats = {
  sessions: 0,
  bestWPM: 0,
  totalTime: 0,
  lastPlayed: null,
}

const initialState: UserState = {
  profile: null,
  hasCompletedOnboarding: false,
  baselineWPM: 0,
  currentWPM: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  exercises: {
    pointerWand: { ...initialExerciseStats },
    silentShadow: { ...initialExerciseStats },
    sideScanner: { ...initialExerciseStats },
    timeBoss: { ...initialExerciseStats },
  },
  badges: [],
  wpmHistory: [],
  weeklyDuels: [],
  settings: {
    soundEnabled: true,
    showGuides: true,
    pointerSpeed: 1,
  },
}

function calculateLevel(xp: number): number {
  if (xp >= 1000) return 5
  if (xp >= 600) return 4
  if (xp >= 300) return 3
  if (xp >= 100) return 2
  return 1
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

interface UserStore extends UserState {
  setProfile: (name: string, age: number, topics: Topic[]) => void
  completeOnboarding: () => void
  setBaselineWPM: (wpm: number) => void
  addXP: (amount: number) => void
  updateStreak: () => void
  completeExercise: (
    exercise: ExerciseType,
    wpm: number,
    duration: number
  ) => { xpEarned: number; beatPB: boolean; newBadges: Badge[] }
  unlockBadge: (badge: Badge) => void
  checkBadgeUnlocks: () => Badge[]
  updateSettings: (settings: Partial<UserState['settings']>) => void
  addWeeklyDuel: (wpm: number) => void
  resetProgress: () => void
  resetAll: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (name, age, topics) => set({
        profile: {
          name,
          age,
          topics,
          createdAt: new Date().toISOString(),
        }
      }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      setBaselineWPM: (wpm) => {
        const state = get()
        const newBadges: Badge[] = []
        if (!state.badges.includes('first_steps')) {
          newBadges.push('first_steps')
        }
        set({
          baselineWPM: wpm,
          currentWPM: wpm,
          badges: [...state.badges, ...newBadges],
          xp: state.xp + 50,
          wpmHistory: [
            ...state.wpmHistory,
            {
              date: new Date().toISOString(),
              wpm,
              exercise: 'baseline',
            }
          ],
        })
      },

      addXP: (amount) => {
        const newXP = get().xp + amount
        const newLevel = calculateLevel(newXP)
        const state = get()
        const newBadges: Badge[] = []

        if (newLevel >= 2 && !state.badges.includes('level_up')) {
          newBadges.push('level_up')
        }

        set({
          xp: newXP,
          level: newLevel,
          badges: [...state.badges, ...newBadges],
        })
      },

      updateStreak: () => {
        const today = getDateString(new Date())
        const lastActive = get().lastActiveDate

        if (lastActive === today) return

        const yesterday = getDateString(new Date(Date.now() - 86400000))
        const newStreak = lastActive === yesterday ? get().streak + 1 : 1
        const state = get()
        const newBadges: Badge[] = []

        if (newStreak >= 7 && !state.badges.includes('week_warrior')) {
          newBadges.push('week_warrior')
        }
        if (newStreak >= 30 && !state.badges.includes('month_master')) {
          newBadges.push('month_master')
        }

        set({
          streak: newStreak,
          lastActiveDate: today,
          badges: [...state.badges, ...newBadges],
        })
      },

      completeExercise: (exercise, wpm, duration) => {
        const state = get()
        const current = state.exercises[exercise]
        const newBest = Math.max(current.bestWPM, wpm)
        const beatPB = wpm > current.bestWPM && current.bestWPM > 0

        let xpEarned = 10
        if (beatPB) xpEarned += 25
        if (wpm >= 200) xpEarned += 10

        const newExercises = {
          ...state.exercises,
          [exercise]: {
            sessions: current.sessions + 1,
            bestWPM: newBest,
            totalTime: current.totalTime + duration,
            lastPlayed: new Date().toISOString(),
          }
        }

        const newWPMHistory = [
          ...state.wpmHistory,
          {
            date: new Date().toISOString(),
            wpm,
            exercise,
          }
        ]

        set({
          exercises: newExercises,
          currentWPM: Math.max(state.currentWPM, wpm),
          wpmHistory: newWPMHistory,
          xp: state.xp + xpEarned,
          level: calculateLevel(state.xp + xpEarned),
        })

        get().updateStreak()
        const newBadges = get().checkBadgeUnlocks()

        return { xpEarned, beatPB, newBadges }
      },

      unlockBadge: (badge) => {
        const state = get()
        if (!state.badges.includes(badge)) {
          set({
            badges: [...state.badges, badge],
            xp: state.xp + 50,
          })
        }
      },

      checkBadgeUnlocks: () => {
        const state = get()
        const newBadges: Badge[] = []

        if (state.exercises.pointerWand.sessions >= 5 && !state.badges.includes('pointer_pro')) {
          newBadges.push('pointer_pro')
        }
        if (state.exercises.silentShadow.sessions >= 5 && !state.badges.includes('silent_reader')) {
          newBadges.push('silent_reader')
        }
        if (state.exercises.sideScanner.sessions >= 5 && !state.badges.includes('side_scanner')) {
          newBadges.push('side_scanner')
        }
        if (state.exercises.timeBoss.sessions >= 5 && !state.badges.includes('time_bender')) {
          newBadges.push('time_bender')
        }
        if (state.currentWPM >= 200 && !state.badges.includes('speed_demon')) {
          newBadges.push('speed_demon')
        }

        const totalSessions = Object.values(state.exercises).reduce(
          (sum, ex) => sum + ex.sessions, 0
        )
        if (totalSessions >= 100 && !state.badges.includes('centurion')) {
          newBadges.push('centurion')
        }

        newBadges.forEach(badge => get().unlockBadge(badge))
        return newBadges
      },

      updateSettings: (newSettings) => set({
        settings: { ...get().settings, ...newSettings }
      }),

      addWeeklyDuel: (wpm) => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        const weekStart = getDateString(monday)

        const state = get()
        const existingDuel = state.weeklyDuels.find(d => d.weekStart === weekStart)

        if (existingDuel) {
          const updatedDuels = state.weeklyDuels.map(d =>
            d.weekStart === weekStart
              ? { ...d, wpm: Math.max(d.wpm, wpm) }
              : d
          )
          set({ weeklyDuels: updatedDuels })
        } else {
          const lastWeek = state.weeklyDuels[state.weeklyDuels.length - 1]
          const improved = lastWeek ? wpm > lastWeek.wpm : true
          set({
            weeklyDuels: [
              ...state.weeklyDuels,
              { weekStart, wpm, improved }
            ]
          })
        }
      },

      resetProgress: () => set({
        ...initialState,
        profile: get().profile,
        settings: get().settings,
        hasCompletedOnboarding: get().hasCompletedOnboarding,
      }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'tisa-speed-reader',
    }
  )
)
