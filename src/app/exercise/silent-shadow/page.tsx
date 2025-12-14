'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft, Trophy, RotateCcw, Info, Check } from 'lucide-react'
import { Button, Timer } from '@/components/atoms'
import { ReadingPane } from '@/components/organisms/ReadingPane'
import { useUserStore } from '@/stores/useUserStore'
import { useTextGenerator } from '@/hooks/useTextGenerator'
import { countWords } from '@/lib/utils'
import { getExerciseConfig } from '@/config/exercises'
import { slideUp } from '@/lib/animations'

type Phase = 'instructions' | 'reading' | 'results'

export default function SilentShadowPage() {
  const router = useRouter()
  const { profile, exercises, completeExercise } = useUserStore()
  const { generateMediumText, isLoading: isGenerating } = useTextGenerator()
  const config = getExerciseConfig('silentShadow')

  const [phase, setPhase] = useState<Phase>('instructions')
  const [text, setText] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

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
    // For silent shadow, we don't calculate WPM strictly - it's about the technique
    const estimatedWPM = Math.round((totalWords / elapsed) * 60)

    const result = completeExercise('silentShadow', estimatedWPM, elapsed)
    setXpEarned(result.xpEarned)
    setPhase('results')
  }, [startTime, totalWords, completeExercise])

  const handleRetry = useCallback(async () => {
    if (profile) {
      const newText = await generateMediumText(profile.topics, profile.age)
      setText(newText)
    }
    setPhase('instructions')
  }, [profile, generateMediumText])

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
                  <Info className="w-5 h-5 text-silent-shadow" />
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
                <span className="text-sm text-foreground-muted">
                  Count along: 1, 2, 3, 4...
                </span>
                <Timer
                  duration={300}
                  isRunning={isRunning}
                  size="sm"
                  variant="minimal"
                />
              </div>

              <ReadingPane
                text={text}
                mode="silent"
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
                className="w-20 h-20 mx-auto rounded-full bg-silent-shadow/10 flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-silent-shadow" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Great Practice!
                </h1>
                <p className="text-foreground-secondary">
                  You&apos;re training your brain to read without the inner voice
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border max-w-sm mx-auto">
                <div className="text-6xl mb-4">🔇</div>
                <p className="text-foreground-secondary">
                  Sessions completed: <span className="font-bold text-foreground">{exercises.silentShadow.sessions}</span>
                </p>
              </div>

              <div className="bg-tisa-blue/5 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-tisa-blue">+{xpEarned} XP</span> earned!
                </p>
              </div>

              <div className="bg-background-secondary p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <strong>Remember:</strong> The more you practice counting while reading,
                  the easier it becomes to read without &quot;saying&quot; the words in your head.
                  This is one of the biggest speed reading secrets!
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
