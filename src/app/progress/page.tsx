'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Target, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button, ProgressBar } from '@/components/atoms'
import { StatsCard } from '@/components/molecules'
import { useUserStore } from '@/stores/useUserStore'
import { staggerContainer, staggerItem } from '@/lib/animations'

export default function ProgressPage() {
  const router = useRouter()
  const { profile, baselineWPM, currentWPM, wpmHistory, exercises } = useUserStore()
  const [isChartMounted, setIsChartMounted] = useState(false)

  // Delay chart rendering until after hydration to avoid width/height -1 warning
  useEffect(() => {
    setIsChartMounted(true)
  }, [])

  const chartData = useMemo(() => {
    return wpmHistory.slice(-20).map((record, index) => ({
      name: `#${index + 1}`,
      wpm: record.wpm,
      date: new Date(record.date).toLocaleDateString(),
    }))
  }, [wpmHistory])

  const totalTime = useMemo(() => {
    const seconds = Object.values(exercises).reduce((sum, ex) => sum + ex.totalTime, 0)
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMins = minutes % 60
    return `${hours}h ${remainingMins}m`
  }, [exercises])

  const improvement = baselineWPM > 0 ? Math.round(((currentWPM - baselineWPM) / baselineWPM) * 100) : 0
  const totalSessions = Object.values(exercises).reduce((sum, ex) => sum + ex.sessions, 0)

  if (!profile) {
    router.push('/onboarding')
    return null
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
          <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Stats */}
          <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={TrendingUp}
              label="Current Speed"
              value={`${currentWPM}`}
              subValue="WPM"
              color="blue"
            />
            <StatsCard
              icon={Target}
              label="Baseline"
              value={`${baselineWPM}`}
              subValue="WPM"
              color="purple"
            />
            <StatsCard
              icon={TrendingUp}
              label="Improvement"
              value={`${improvement > 0 ? '+' : ''}${improvement}%`}
              color={improvement > 0 ? 'green' : 'orange'}
            />
            <StatsCard
              icon={Clock}
              label="Total Practice"
              value={totalTime}
              color="gold"
            />
          </motion.div>

          {/* WPM Chart */}
          <motion.div
            variants={staggerItem}
            className="bg-surface p-6 rounded-2xl border border-border"
          >
            <h2 className="font-semibold text-foreground mb-4">Speed Over Time</h2>
            {chartData.length > 1 && isChartMounted ? (
              <div className="h-64 min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" />
                    <XAxis dataKey="name" stroke="#6B6560" fontSize={12} />
                    <YAxis stroke="#6B6560" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8E4DE',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="#1E3A5F"
                      strokeWidth={2}
                      dot={{ fill: '#1E3A5F', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-foreground-muted">
                {chartData.length <= 1
                  ? "Complete more sessions to see your progress chart!"
                  : "Loading chart..."}
              </div>
            )}
          </motion.div>

          {/* Exercise Breakdown */}
          <motion.div
            variants={staggerItem}
            className="bg-surface p-6 rounded-2xl border border-border"
          >
            <h2 className="font-semibold text-foreground mb-4">Exercise Breakdown</h2>
            <div className="space-y-4">
              {[
                { key: 'pointerWand', name: 'Pointer Wand', icon: '🪄', color: 'blue' },
                { key: 'silentShadow', name: 'Silent Shadow', icon: '🔇', color: 'purple' },
                { key: 'sideScanner', name: 'Side Scanner', icon: '🦅', color: 'green' },
                { key: 'timeBoss', name: 'Time Boss', icon: '⏱️', color: 'orange' },
              ].map(({ key, name, icon, color }) => {
                const stats = exercises[key as keyof typeof exercises]
                const progress = totalSessions > 0 ? (stats.sessions / totalSessions) * 100 : 0

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span className="font-medium text-foreground">{name}</span>
                      </div>
                      <div className="text-sm text-foreground-secondary">
                        {stats.sessions} sessions
                        {stats.bestWPM > 0 && (
                          <span className="ml-2 text-xp-gold">
                            Best: {stats.bestWPM} WPM
                          </span>
                        )}
                      </div>
                    </div>
                    <ProgressBar
                      progress={progress}
                      size="sm"
                      color={color as 'blue' | 'purple' | 'green' | 'orange'}
                    />
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            variants={staggerItem}
            className="bg-surface p-6 rounded-2xl border border-border"
          >
            <h2 className="font-semibold text-foreground mb-4">Recent Sessions</h2>
            {wpmHistory.length > 0 ? (
              <div className="space-y-2">
                {wpmHistory.slice(-10).reverse().map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-background-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-foreground-muted text-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-foreground capitalize">
                        {record.exercise.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="font-bold text-foreground">{record.wpm} WPM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground-muted text-center py-4">
                No sessions yet. Start practicing!
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
