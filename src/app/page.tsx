'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Trophy, Settings, BarChart2 } from 'lucide-react'
import { Button, XPCounter, LevelIndicator, StreakFlame } from '@/components/atoms'
import { ExerciseCard, StatsCard } from '@/components/molecules'
import { useUserStore } from '@/stores/useUserStore'
import { staggerContainer, staggerItem } from '@/lib/animations'
import type { ExerciseType } from '@/schemas/user'

export default function DashboardPage() {
  const router = useRouter()
  const {
    profile,
    hasCompletedOnboarding,
    baselineWPM,
    currentWPM,
    xp,
    level,
    streak,
    exercises,
  } = useUserStore()

  useEffect(() => {
    if (!hasCompletedOnboarding || !profile) {
      router.push('/onboarding')
    } else if (baselineWPM === 0) {
      router.push('/baseline')
    }
  }, [hasCompletedOnboarding, profile, baselineWPM, router])

  if (!profile || !hasCompletedOnboarding || baselineWPM === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Loading...</div>
      </div>
    )
  }

  const totalSessions = Object.values(exercises).reduce((sum, ex) => sum + ex.sessions, 0)
  const improvement = baselineWPM > 0 ? Math.round(((currentWPM - baselineWPM) / baselineWPM) * 100) : 0

  const handleExerciseClick = (exerciseId: ExerciseType) => {
    const routes: Record<ExerciseType, string> = {
      pointerWand: '/exercise/pointer-wand',
      silentShadow: '/exercise/silent-shadow',
      sideScanner: '/exercise/side-scanner',
      timeBoss: '/exercise/time-boss',
    }
    router.push(routes[exerciseId])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Hey, {profile.name}!
              </h1>
              <p className="text-sm text-foreground-secondary">
                Ready to train your super eyes?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StreakFlame streak={streak} size="sm" />
              <LevelIndicator level={level} xp={xp} size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings')}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={staggerItem}>
            <StatsCard
              icon={Zap}
              label="Current Speed"
              value={`${currentWPM}`}
              subValue="WPM"
              color="blue"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              icon={BarChart2}
              label="Improvement"
              value={`${improvement > 0 ? '+' : ''}${improvement}%`}
              subValue={`from ${baselineWPM} WPM`}
              color={improvement > 0 ? 'green' : 'orange'}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              icon={Trophy}
              label="Total Sessions"
              value={totalSessions}
              color="gold"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="p-4 rounded-xl bg-surface border border-border">
              <XPCounter amount={xp} size="lg" />
              <p className="text-sm text-foreground-muted mt-1">Total XP</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Exercise Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Speed Reading Powers
            </h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            <motion.div variants={staggerItem}>
              <ExerciseCard
                exerciseId="pointerWand"
                sessions={exercises.pointerWand.sessions}
                bestWPM={exercises.pointerWand.bestWPM}
                onClick={() => handleExerciseClick('pointerWand')}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ExerciseCard
                exerciseId="silentShadow"
                sessions={exercises.silentShadow.sessions}
                bestWPM={exercises.silentShadow.bestWPM}
                onClick={() => handleExerciseClick('silentShadow')}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ExerciseCard
                exerciseId="sideScanner"
                sessions={exercises.sideScanner.sessions}
                bestWPM={exercises.sideScanner.bestWPM}
                onClick={() => handleExerciseClick('sideScanner')}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ExerciseCard
                exerciseId="timeBoss"
                sessions={exercises.timeBoss.sessions}
                bestWPM={exercises.timeBoss.bestWPM}
                onClick={() => handleExerciseClick('timeBoss')}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push('/progress')}
          >
            <BarChart2 className="w-6 h-6 text-tisa-blue" />
            <span>View Progress</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push('/badges')}
          >
            <Trophy className="w-6 h-6 text-xp-gold" />
            <span>My Badges</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push('/speed-duel')}
          >
            <Zap className="w-6 h-6 text-streak-orange" />
            <span>Speed Duel</span>
          </Button>
        </section>

        {/* Motivational Footer */}
        <div className="text-center py-8">
          <p className="text-foreground-muted text-sm">
            Every session makes your reading superpowers stronger!
          </p>
        </div>
      </main>
    </div>
  )
}
