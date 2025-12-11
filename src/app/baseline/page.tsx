'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Check, Trophy } from 'lucide-react'
import { Button, Timer, ProgressBar } from '@/components/atoms'
import { WPMDisplay } from '@/components/molecules'
import { ReadingPane } from '@/components/organisms/ReadingPane'
import { useUserStore } from '@/stores/useUserStore'
import { useTextGenerator } from '@/hooks/useTextGenerator'
import { countWords, calculateWPM } from '@/lib/utils'
import { slideUp } from '@/lib/animations'

type Phase = 'intro' | 'reading' | 'results'

export default function BaselinePage() {
  const router = useRouter()
  const { profile, setBaselineWPM } = useUserStore()
  const { generateForTopics, isLoading: isGenerating } = useTextGenerator()

  const [phase, setPhase] = useState<Phase>('intro')
  const [text, setText] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [wpm, setWpm] = useState(0)

  useEffect(() => {
    if (!profile) {
      router.push('/onboarding')
      return
    }

    generateForTopics(profile.topics, profile.age).then(setText)
  }, [profile, generateForTopics, router])

  useEffect(() => {
    if (!isTimerRunning) return

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning])

  const handleStart = useCallback(() => {
    setPhase('reading')
    setIsTimerRunning(true)
    setElapsedSeconds(0)
  }, [])

  const handleFinish = useCallback(() => {
    setIsTimerRunning(false)
    const wordCount = countWords(text)
    const calculatedWPM = calculateWPM(wordCount, elapsedSeconds)
    setWpm(calculatedWPM)
    setBaselineWPM(calculatedWPM)
    setPhase('results')
  }, [text, elapsedSeconds, setBaselineWPM])

  const handleContinue = () => {
    router.push('/')
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-12 space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Baseline Test
                </h1>
                <p className="text-foreground-secondary text-lg">
                  Read at your normal speed, {profile.name}
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border max-w-md mx-auto">
                <h2 className="font-semibold text-foreground mb-4">How it works:</h2>
                <ul className="text-left space-y-3 text-foreground-secondary">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-tisa-blue/10 text-tisa-blue flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Click Start when you&apos;re ready to begin</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-tisa-blue/10 text-tisa-blue flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Read the text at your comfortable pace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-tisa-blue/10 text-tisa-blue flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Click Finished when you&apos;ve read everything</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                isLoading={isGenerating}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Start Reading
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
                <h1 className="text-xl font-semibold text-foreground">
                  Read at your normal speed
                </h1>
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <span className="text-sm">Time:</span>
                  <Timer
                    duration={600}
                    isRunning={isTimerRunning}
                    size="sm"
                    variant="minimal"
                  />
                </div>
              </div>

              <ReadingPane text={text} mode="normal" />

              <div className="flex justify-center">
                <Button
                  onClick={handleFinish}
                  size="lg"
                  leftIcon={<Check className="w-5 h-5" />}
                >
                  I&apos;m Finished Reading
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
              className="text-center py-12 space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 mx-auto rounded-full bg-xp-gold/10 flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-xp-gold" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Great job, {profile.name}!
                </h1>
                <p className="text-foreground-secondary text-lg">
                  Here&apos;s your starting speed
                </p>
              </div>

              <div className="bg-surface p-8 rounded-2xl border border-border max-w-sm mx-auto">
                <WPMDisplay wpm={wpm} size="xl" />
                <p className="text-foreground-secondary mt-4">
                  Words Per Minute
                </p>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground-muted">Reading time</span>
                    <span className="font-medium text-foreground">
                      {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Words read</span>
                    <span className="font-medium text-foreground">
                      {countWords(text)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-tisa-blue/5 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-tisa-blue">+50 XP</span> earned for completing your baseline test!
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <p className="text-foreground-secondary">
                  Now let&apos;s train your super eyes and boost that speed!
                </p>
                <Button onClick={handleContinue} size="lg" className="w-full">
                  Go to Training Hub
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
