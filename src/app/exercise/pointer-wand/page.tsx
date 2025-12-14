'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft, Trophy, RotateCcw, Info, Target } from 'lucide-react'
import { Button, ProgressBar } from '@/components/atoms'
import { WPMDisplay } from '@/components/molecules'
import { ReadingPane } from '@/components/organisms/ReadingPane'
import { useUserStore } from '@/stores/useUserStore'
import { useTextGenerator } from '@/hooks/useTextGenerator'
import { countWords, calculateWPM } from '@/lib/utils'
import { getExerciseConfig } from '@/config/exercises'
import { slideUp } from '@/lib/animations'

type Phase = 'instructions' | 'reading' | 'results'

const WPM_PRESETS = [150, 250, 350, 500, 650, 800, 1000]

export default function PointerWandPage() {
  const router = useRouter()
  const { profile, exercises, completeExercise } = useUserStore()
  const { generateMediumText, isLoading: isGenerating } = useTextGenerator()
  const config = getExerciseConfig('pointerWand')

  const [phase, setPhase] = useState<Phase>('instructions')
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [beatPB, setBeatPB] = useState(false)
  // Initialize target WPM from user's best WPM or default to 150
  const initialTargetWPM = exercises.pointerWand.bestWPM > 0 ? exercises.pointerWand.bestWPM : 150
  const [targetWPM, setTargetWPM] = useState(initialTargetWPM)

  const totalWords = countWords(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!profile) {
      router.push('/onboarding')
      return
    }
    generateMediumText(profile.topics, profile.age).then(setText)
  }, [profile, generateMediumText, router])

  // Calculate ms per word based on target WPM
  // WPM = words / (ms / 60000) => ms per word = 60000 / WPM
  const msPerWord = 60000 / targetWPM

  const handleStart = useCallback(() => {
    setPhase('reading')
    setWordIndex(0)
    setStartTime(Date.now())
    setIsRunning(true)
  }, [])

  useEffect(() => {
    if (!isRunning || totalWords === 0) return

    intervalRef.current = setInterval(() => {
      setWordIndex(prev => {
        if (prev >= totalWords - 1) {
          setIsRunning(false)
          if (intervalRef.current) clearInterval(intervalRef.current)

          const elapsed = (Date.now() - (startTime || Date.now())) / 1000
          const calculatedWPM = calculateWPM(totalWords, elapsed)
          setWpm(calculatedWPM)

          const result = completeExercise('pointerWand', calculatedWPM, elapsed)
          setXpEarned(result.xpEarned)
          setBeatPB(result.beatPB)
          setPhase('results')

          return prev
        }
        return prev + 1
      })
    }, msPerWord)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, totalWords, msPerWord, startTime, completeExercise])

  const handleRetry = useCallback(async () => {
    if (profile) {
      const newText = await generateMediumText(profile.topics, profile.age)
      setText(newText)
    }
    setPhase('instructions')
    setWordIndex(0)
    setWpm(0)
  }, [profile, generateMediumText])

  const progress = totalWords > 0 ? (wordIndex / totalWords) * 100 : 0

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

              {/* WPM Goal Selector */}
              <div className="bg-surface p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-pointer-wand" />
                  <h2 className="font-semibold text-foreground">Set Your WPM Goal</h2>
                </div>
                <p className="text-sm text-foreground-secondary mb-4">
                  The pointer will move at this speed. Challenge yourself!
                </p>

                <div className="space-y-4">
                  {/* Preset buttons */}
                  <div className="flex flex-wrap gap-2">
                    {WPM_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTargetWPM(preset)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          targetWPM === preset
                            ? 'bg-pointer-wand text-white'
                            : 'bg-background-secondary text-foreground-secondary hover:bg-border'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Custom slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-muted">Custom speed</span>
                      <span className="text-lg font-bold text-pointer-wand">{targetWPM} WPM</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={1200}
                      step={10}
                      value={targetWPM}
                      onChange={(e) => setTargetWPM(Number(e.target.value))}
                      className="w-full accent-pointer-wand"
                    />
                    <div className="flex justify-between text-xs text-foreground-muted mt-1">
                      <span>50 (beginner)</span>
                      <span>1200 (pro)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-tisa-blue" />
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

              <div className="bg-background-secondary p-4 rounded-xl">
                <h3 className="font-medium text-foreground mb-2">Tips</h3>
                <ul className="space-y-1 text-sm text-foreground-secondary">
                  {config.tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              {exercises.pointerWand.bestWPM > 0 && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-foreground-muted">Your best:</span>
                  <span className="font-bold text-xp-gold">
                    {exercises.pointerWand.bestWPM} WPM
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
                Start at {targetWPM} WPM
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
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground-muted">
                    Word {wordIndex + 1} of {totalWords}
                  </span>
                  <span className="text-sm font-medium text-pointer-wand">
                    Target: {targetWPM} WPM
                  </span>
                </div>
                <div className="w-32">
                  <ProgressBar progress={progress} size="sm" color="blue" />
                </div>
              </div>

              <ReadingPane
                text={text}
                mode="pointer"
                pointerWordIndex={wordIndex}
              />

              <p className="text-center text-sm text-foreground-muted">
                Keep your eyes on the highlighted word
              </p>
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
                className="w-20 h-20 mx-auto rounded-full bg-xp-gold/10 flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-xp-gold" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {beatPB ? 'New Personal Best!' : 'Great Practice!'}
                </h1>
                <p className="text-foreground-secondary">
                  You followed the pointer at {targetWPM} WPM through {totalWords} words
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border max-w-sm mx-auto">
                <WPMDisplay
                  wpm={wpm}
                  previousWPM={exercises.pointerWand.bestWPM}
                  showTrend={exercises.pointerWand.sessions > 1}
                />
                <p className="text-sm text-foreground-muted mt-2">
                  Target was {targetWPM} WPM
                </p>
              </div>

              <div className="bg-tisa-blue/5 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-tisa-blue">+{xpEarned} XP</span> earned!
                  {beatPB && <span className="ml-2 text-xp-gold font-semibold">+25 bonus for new PB!</span>}
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
