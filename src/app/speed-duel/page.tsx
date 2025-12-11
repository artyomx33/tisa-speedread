'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/atoms'
import { WPMDisplay } from '@/components/molecules'
import { useUserStore } from '@/stores/useUserStore'
import { slideUp } from '@/lib/animations'
import { getWeekStart } from '@/lib/utils'

export default function SpeedDuelPage() {
  const router = useRouter()
  const { profile, weeklyDuels, wpmHistory, currentWPM, level } = useUserStore()

  const isUnlocked = level >= 2

  const thisWeekData = useMemo(() => {
    const thisWeekStart = getWeekStart(new Date())
    const thisWeekRecords = wpmHistory.filter(
      (r) => getWeekStart(new Date(r.date)) === thisWeekStart
    )
    if (thisWeekRecords.length === 0) return null
    const bestWPM = Math.max(...thisWeekRecords.map((r) => r.wpm))
    return { weekStart: thisWeekStart, bestWPM, sessions: thisWeekRecords.length }
  }, [wpmHistory])

  const lastWeekData = useMemo(() => {
    if (weeklyDuels.length === 0) return null
    const sorted = [...weeklyDuels].sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    const thisWeekStart = getWeekStart(new Date())
    const lastWeek = sorted.find((d) => d.weekStart !== thisWeekStart)
    return lastWeek
  }, [weeklyDuels])

  const duelResult = useMemo(() => {
    if (!thisWeekData || !lastWeekData) return null
    const diff = thisWeekData.bestWPM - lastWeekData.wpm
    const improved = diff > 0
    return { diff, improved, percentage: Math.round((diff / lastWeekData.wpm) * 100) }
  }, [thisWeekData, lastWeekData])

  if (!profile) {
    router.push('/onboarding')
    return null
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Speed Duel</h1>
          </div>

          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-foreground-muted/10 flex items-center justify-center mb-6">
              <span className="text-5xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Unlock at Level 2
            </h2>
            <p className="text-foreground-secondary mb-6">
              Keep practicing to unlock Speed Duel! You need to reach Level 2.
            </p>
            <Button onClick={() => router.push('/')}>
              Keep Training
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Speed Duel</h1>
        </div>

        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Explanation */}
          <div className="bg-surface p-6 rounded-2xl border border-border text-center">
            <Zap className="w-12 h-12 text-streak-orange mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Beat Your Last Week!
            </h2>
            <p className="text-foreground-secondary">
              Compare your best WPM this week to last week. Can you keep improving?
            </p>
          </div>

          {/* Duel Display */}
          {thisWeekData && lastWeekData ? (
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="grid grid-cols-2 gap-8">
                {/* Last Week */}
                <div className="text-center">
                  <p className="text-sm text-foreground-muted mb-2">Last Week</p>
                  <WPMDisplay wpm={lastWeekData.wpm} size="lg" label="" />
                  <p className="text-sm text-foreground-secondary mt-2">WPM</p>
                </div>

                {/* VS */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden" />

                {/* This Week */}
                <div className="text-center">
                  <p className="text-sm text-foreground-muted mb-2">This Week</p>
                  <WPMDisplay wpm={thisWeekData.bestWPM} size="lg" label="" />
                  <p className="text-sm text-foreground-secondary mt-2">WPM</p>
                </div>
              </div>

              {/* Result */}
              {duelResult && (
                <div
                  className={`mt-6 pt-6 border-t border-border text-center ${
                    duelResult.improved ? 'text-success' : 'text-error'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                    {duelResult.improved ? (
                      <>
                        <TrendingUp className="w-8 h-8" />
                        <span>YOU WIN!</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-8 h-8" />
                        <span>Keep Trying!</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2">
                    {duelResult.diff > 0 ? '+' : ''}
                    {duelResult.diff} WPM ({duelResult.percentage > 0 ? '+' : ''}
                    {duelResult.percentage}%)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface p-8 rounded-2xl border border-border text-center">
              <Trophy className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {!thisWeekData
                  ? 'No sessions this week yet!'
                  : 'No data from last week'}
              </h3>
              <p className="text-foreground-secondary mb-4">
                {!thisWeekData
                  ? 'Complete some exercises to track your progress this week.'
                  : "This is your first week! Next week you'll be able to compare."}
              </p>
              <Button onClick={() => router.push('/')}>
                Start Practicing
              </Button>
            </div>
          )}

          {/* Weekly History */}
          {weeklyDuels.length > 0 && (
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <h2 className="font-semibold text-foreground mb-4">Weekly History</h2>
              <div className="space-y-3">
                {[...weeklyDuels]
                  .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
                  .slice(0, 8)
                  .map((duel, index) => (
                    <div
                      key={duel.weekStart}
                      className="flex items-center justify-between p-3 rounded-lg bg-background-secondary"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          Week of {new Date(duel.weekStart).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">
                          {duel.wpm} WPM
                        </span>
                        {index < weeklyDuels.length - 1 && (
                          <span
                            className={
                              duel.improved ? 'text-success' : 'text-error'
                            }
                          >
                            {duel.improved ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-background-secondary p-4 rounded-xl">
            <h3 className="font-medium text-foreground mb-2">Tips for Winning</h3>
            <ul className="space-y-1 text-sm text-foreground-secondary">
              <li>• Practice consistently throughout the week</li>
              <li>• Try all 4 exercises to improve different skills</li>
              <li>• Focus on technique, speed will follow naturally</li>
              <li>• Challenge yourself with faster pointer speeds</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
