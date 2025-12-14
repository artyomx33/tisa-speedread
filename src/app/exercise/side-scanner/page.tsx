'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft, Trophy, RotateCcw, Info, Check, Eye } from 'lucide-react'
import { Button, Timer } from '@/components/atoms'
import { WPMDisplay } from '@/components/molecules'
import { ReadingPane } from '@/components/organisms/ReadingPane'
import { useUserStore } from '@/stores/useUserStore'
import { useTextGenerator } from '@/hooks/useTextGenerator'
import { countWords, calculateWPM } from '@/lib/utils'
import { getExerciseConfig } from '@/config/exercises'
import { slideUp } from '@/lib/animations'

type Phase = 'instructions' | 'reading' | 'results'

export default function SideScannerPage() {
  const router = useRouter()
  const { profile, exercises, completeExercise, settings, updateSettings } = useUserStore()
  const { generateMediumText, isLoading: isGenerating } = useTextGenerator()
  const config = getExerciseConfig('sideScanner')

  const [phase, setPhase] = useState<Phase>('instructions')
  const [text, setText] = useState('')
  const [showGuides, setShowGuides] = useState(settings.showGuides)
  const [guideOpacity, setGuideOpacity] = useState(0.5)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [beatPB, setBeatPB] = useState(false)

  const totalWords = countWords(text)

  useEffect(() => {
    if (!profile) {
      router.push('/onboarding')
      return
    }
    generateMediumText(profile.topics, profile.age).then(setText)
  }, [profile, generateMediumText, router])

  const handleStart = useCallback(() => {
    setPhase('reading')
    setStartTime(Date.now())
    setIsRunning(true)
  }, [])

  const handleFinish = useCallback(() => {
    setIsRunning(false)
    const elapsed = (Date.now() - (startTime || Date.now())) / 1000
    const calculatedWPM = calculateWPM(totalWords, elapsed)
    setWpm(calculatedWPM)

    const result = completeExercise('sideScanner', calculatedWPM, elapsed)
    setXpEarned(result.xpEarned)
    setBeatPB(result.beatPB)
    setPhase('results')
  }, [startTime, totalWords, completeExercise])

  const handleRetry = useCallback(async () => {
    if (profile) {
      const newText = await generateMediumText(profile.topics, profile.age)
      setText(newText)
    }
    setPhase('instructions')
    setWpm(0)
  }, [profile, generateMediumText])

  const handleToggleGuides = () => {
    const newValue = !showGuides
    setShowGuides(newValue)
    updateSettings({ showGuides: newValue })
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <span className="font-semibold text-foreground">{config.title}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Instructions Phase */}
          {phase === 'instructions' && (
            <motion.div
              key="instructions"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  {config.icon}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {config.title}
                </h1>
                <p className="text-foreground-secondary">
                  {config.description}
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-side-scanner" />
                  <h2 className="font-semibold text-foreground">How to do it</h2>
                </div>
                <ul className="space-y-3">
                  {config.instructions.map((instruction, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground-secondary">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                        style={{ backgroundColor: config.color }}
                      >
                        {i + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
                <h3 className="font-medium text-foreground">Settings</h3>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Show guide lines</span>
                  <button
                    onClick={handleToggleGuides}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showGuides ? 'bg-side-scanner' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        showGuides ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {showGuides && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-secondary">Guide opacity</span>
                      <span className="text-sm font-medium text-foreground">{Math.round(guideOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={1}
                      step={0.1}
                      value={guideOpacity}
                      onChange={(e) => setGuideOpacity(Number(e.target.value))}
                      className="w-full accent-side-scanner"
                    />
                  </div>
                )}
              </div>

              <div className="bg-background-secondary p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">Tips</h3>
                <ul className="space-y-1 text-sm text-foreground-secondary">
                  {config.tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              {exercises.sideScanner.bestWPM > 0 && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-foreground-muted">Your best:</span>
                  <span className="font-bold text-xp-gold">
                    {exercises.sideScanner.bestWPM} WPM
                  </span>
                </div>
              )}

              <Button
                onClick={handleStart}
                size="lg"
                className="w-full"
                isLoading={isGenerating}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Start Exercise
              </Button>
            </motion.div>
          )}

          {/* Reading Phase */}
          {phase === 'reading' && (
            <motion.div
              key="reading"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-foreground-muted">
                  <Eye className="w-4 h-4" />
                  <span>Focus on the center, use peripheral vision for edges</span>
                </div>
                <Timer
                  duration={300}
                  isRunning={isRunning}
                  size="sm"
                  variant="minimal"
                />
              </div>

              <ReadingPane
                text={text}
                mode="side-scan"
                showGuides={showGuides}
                guideOpacity={guideOpacity}
              />

              <div className="flex justify-center">
                <Button
                  onClick={handleFinish}
                  size="lg"
                  leftIcon={<Check className="w-5 h-5" />}
                >
                  I&apos;ve Finished Reading
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results Phase */}
          {phase === 'results' && (
            <motion.div
              key="results"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-8 space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-20 h-20 mx-auto rounded-full bg-side-scanner/10 flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-side-scanner" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {beatPB ? 'New Personal Best!' : 'Great Practice!'}
                </h1>
                <p className="text-foreground-secondary">
                  Your peripheral vision is getting stronger!
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border max-w-sm mx-auto">
                <WPMDisplay
                  wpm={wpm}
                  previousWPM={exercises.sideScanner.bestWPM}
                  showTrend={exercises.sideScanner.sessions > 1}
                />
              </div>

              <div className="bg-tisa-blue/5 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-tisa-blue">+{xpEarned} XP</span> earned!
                  {beatPB && <span className="ml-2 text-xp-gold font-semibold">+25 bonus for new PB!</span>}
                </p>
              </div>

              <div className="bg-background-secondary p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <strong>Pro tip:</strong> As you get better, try reducing the guide opacity
                  or turning them off completely. Your peripheral vision will naturally improve!
                </p>
              </div>

              <div className="flex gap-3 max-w-md mx-auto">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  size="lg"
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
