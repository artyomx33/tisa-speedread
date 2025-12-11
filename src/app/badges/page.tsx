'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button, Badge as BadgeComponent, ProgressBar } from '@/components/atoms'
import { useUserStore } from '@/stores/useUserStore'
import { badges, getBadgeConfig } from '@/config/badges'
import { slideUp, staggerContainer, staggerItem } from '@/lib/animations'

export default function BadgesPage() {
  const router = useRouter()
  const { profile, badges: unlockedBadges } = useUserStore()

  if (!profile) {
    router.push('/onboarding')
    return null
  }

  const unlockedCount = unlockedBadges.length
  const totalBadges = badges.length
  const progress = (unlockedCount / totalBadges) * 100

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
          <h1 className="text-2xl font-bold text-foreground">My Badges</h1>
        </div>

        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Progress Overview */}
          <div className="bg-surface p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Collection Progress</h2>
              <span className="text-lg font-bold text-foreground">
                {unlockedCount}/{totalBadges}
              </span>
            </div>
            <ProgressBar progress={progress} color="gold" showLabel />
            <p className="text-sm text-foreground-muted mt-2">
              {totalBadges - unlockedCount} badges left to unlock!
            </p>
          </div>

          {/* Unlocked Badges */}
          {unlockedCount > 0 && (
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <h2 className="font-semibold text-foreground mb-4">
                Unlocked ({unlockedCount})
              </h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 md:grid-cols-5 gap-4"
              >
                {unlockedBadges.map((badgeId) => {
                  const config = getBadgeConfig(badgeId)
                  if (!config) return null

                  return (
                    <motion.div key={badgeId} variants={staggerItem}>
                      <BadgeComponent
                        icon={config.icon}
                        name={config.name}
                        description={config.description}
                        isUnlocked
                        size="lg"
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          )}

          {/* Locked Badges */}
          <div className="bg-surface p-6 rounded-2xl border border-border">
            <h2 className="font-semibold text-foreground mb-4">
              Locked ({totalBadges - unlockedCount})
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 md:grid-cols-5 gap-4"
            >
              {badges
                .filter((b) => !unlockedBadges.includes(b.id))
                .map((badge) => (
                  <motion.div key={badge.id} variants={staggerItem}>
                    <div className="text-center">
                      <BadgeComponent
                        icon={badge.icon}
                        name={badge.name}
                        isUnlocked={false}
                        size="lg"
                      />
                      <p className="text-xs text-foreground-muted mt-1">
                        {badge.requirement}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {/* Badge Guide */}
          <div className="bg-background-secondary p-6 rounded-2xl">
            <h2 className="font-semibold text-foreground mb-4">How to Earn Badges</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    unlockedBadges.includes(badge.id)
                      ? 'bg-success/10'
                      : 'bg-surface'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{badge.name}</p>
                    <p className="text-sm text-foreground-secondary">
                      {badge.requirement}
                    </p>
                  </div>
                  {unlockedBadges.includes(badge.id) && (
                    <span className="ml-auto text-success">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
