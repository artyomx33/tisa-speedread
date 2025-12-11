'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX, Eye, Gauge, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms'
import { useUserStore } from '@/stores/useUserStore'
import { slideUp } from '@/lib/animations'

export default function SettingsPage() {
  const router = useRouter()
  const {
    profile,
    settings,
    updateSettings,
    resetProgress,
    resetAll,
    baselineWPM,
    currentWPM,
    xp,
    level,
    exercises,
  } = useUserStore()

  if (!profile) {
    router.push('/onboarding')
    return null
  }

  const totalSessions = Object.values(exercises).reduce((sum, ex) => sum + ex.sessions, 0)

  const handleResetProgress = () => {
    if (confirm('This will reset all your progress but keep your profile. Are you sure?')) {
      resetProgress()
      router.push('/baseline')
    }
  }

  const handleResetAll = () => {
    if (confirm('This will delete everything and start fresh. Are you sure?')) {
      resetAll()
      router.push('/onboarding')
    }
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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Info */}
          <div className="bg-surface p-6 rounded-2xl border border-border">
            <h2 className="font-semibold text-foreground mb-4">Profile</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Name</span>
                <span className="font-medium text-foreground">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Age</span>
                <span className="font-medium text-foreground">{profile.age} years old</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Favorite Topics</span>
                <span className="font-medium text-foreground">
                  {profile.topics.length} selected
                </span>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-surface p-6 rounded-2xl border border-border">
            <h2 className="font-semibold text-foreground mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-foreground-secondary text-sm">Baseline WPM</p>
                <p className="text-xl font-bold text-foreground">{baselineWPM}</p>
              </div>
              <div>
                <p className="text-foreground-secondary text-sm">Current WPM</p>
                <p className="text-xl font-bold text-foreground">{currentWPM}</p>
              </div>
              <div>
                <p className="text-foreground-secondary text-sm">Total XP</p>
                <p className="text-xl font-bold text-xp-gold">{xp}</p>
              </div>
              <div>
                <p className="text-foreground-secondary text-sm">Level</p>
                <p className="text-xl font-bold text-level-purple">{level}</p>
              </div>
              <div className="col-span-2">
                <p className="text-foreground-secondary text-sm">Total Sessions</p>
                <p className="text-xl font-bold text-foreground">{totalSessions}</p>
              </div>
            </div>
          </div>

          {/* Exercise Settings */}
          <div className="bg-surface p-6 rounded-2xl border border-border">
            <h2 className="font-semibold text-foreground mb-4">Exercise Settings</h2>
            <div className="space-y-6">
              {/* Sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-foreground-secondary" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-foreground-secondary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Sound Effects</p>
                    <p className="text-sm text-foreground-secondary">
                      Play sounds during exercises
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-tisa-blue' : 'bg-border'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Guide Lines */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-foreground-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Show Guide Lines</p>
                    <p className="text-sm text-foreground-secondary">
                      Display guides in Side Scanner
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ showGuides: !settings.showGuides })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showGuides ? 'bg-tisa-blue' : 'bg-border'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.showGuides ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Pointer Speed */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="w-5 h-5 text-foreground-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Pointer Speed</p>
                    <p className="text-sm text-foreground-secondary">
                      Speed multiplier for Pointer Wand
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground-muted">0.5x</span>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={settings.pointerSpeed}
                    onChange={(e) =>
                      updateSettings({ pointerSpeed: Number(e.target.value) })
                    }
                    className="flex-1 accent-tisa-blue"
                  />
                  <span className="text-sm text-foreground-muted">2x</span>
                  <span className="font-bold text-foreground w-12 text-right">
                    {settings.pointerSpeed}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-surface p-6 rounded-2xl border border-error/30">
            <h2 className="font-semibold text-error mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-foreground-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Reset Progress</p>
                    <p className="text-sm text-foreground-secondary">
                      Keep profile, reset all stats and badges
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetProgress}
                >
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-error" />
                  <div>
                    <p className="font-medium text-foreground">Delete Everything</p>
                    <p className="text-sm text-foreground-secondary">
                      Start completely fresh
                    </p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleResetAll}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="text-center py-6 text-foreground-muted text-sm">
            <p>TISA Speed Reader</p>
            <p>Made with ❤️ for TISA International School</p>
            <p className="mt-2">
              Created by Artem + Luna (ChatGPT) + Claude
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
