'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft, Trophy, RotateCcw, Info, Timer as TimerIcon } from 'lucide-react'
import { Button, Timer, ProgressBar } from '@/components/atoms'
import { WPMDisplay } from '@/components/molecules'
import { ReadingPane } from '@/components/organisms/ReadingPane'
import { useUserStore } from '@/stores/useUserStore'
import { useTextGenerator } from '@/hooks/useTextGenerator'
import { countWords, calculateWPM, formatTime } from '@/lib/utils'
import { getExerciseConfig } from '@/config/exercises'
import { slideUp } from '@/lib/animations'

type Phase = 'instructions' | 'reading' | 'waiting' | 'results'
type Round = 1 | 2 | 3 | 4

const roundDurations: Record<Round, number> = {
  1: 240, // 4 minutes
  2: 180, // 3 minutes
  3: 120, // 2 minutes
  4: 60,  // 1 minute
}

const roundDescriptions: Record<Round, string> = {
  1: 'Read normally and click where you finish',
  2: 'Read faster to reach the same point',
  3: 'Push harder to reach your mark',
  4: 'Maximum speed - can you make it?',
}

export default function TimeBossPage() {
  const router = useRouter()
  const { profile, exercises, completeExercise } = useUserStore()
  const { generateForTopics, isLoading: isGenerating } = useTextGenerator()
  const config = getExerciseConfig('timeBoss')

  const [phase, setPhase] = useState<Phase>('instructions')
  const [text, setText] = useState('')
  const [round, setRound] = useState<Round>(1)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [targetWordIndex, setTargetWordIndex] = useState<number | null>(null)
  const [roundResults, setRoundResults] = useState<{ round: Round; reachedTarget: boolean; wordIndex: number }[]>([])
  const [wpm, setWpm] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [beatPB, setBeatPB] = useState(false)

  const totalWords = countWords(text)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!profile) {
      router.push('/onboarding')
      return
    }
    // Generate longer text for Time Boss
    generateForTopics(profile.topics, profile.age).then(generatedText => {
      // Concatenate to get more text
      generateForTopics(profile.topics, profile.age).then(moreText => {
        setText(generatedText + ' ' + moreText)
      })
    })
  }, [profile, generateForTopics, router])

  const handleStart = useCallback(() => {
    setPhase('reading')
    setIsTimerRunning(true)
    setTimeUp(false)
    startTimeRef.current = Date.now()
  }, [])

  const handleTimerComplete = useCallback(() => {
    setIsTimerRunning(false)
    setTimeUp(true)
    setPhase('waiting')
  }, [])

  const handleWordClick = useCallback((wordIndex: number) => {
    if (!timeUp) return

    const reachedTarget = targetWordIndex === null || wordIndex >= targetWordIndex

    // Save round result
    setRoundResults(prev => [...prev, { round, reachedTarget, wordIndex }])

    if (round === 1) {
      // Set the target for subsequent rounds
      setTargetWordIndex(wordIndex)
    }

    if (round < 4) {
      // Move to next round
      setRound(prev => (prev + 1) as Round)
      setTimeUp(false)
      setPhase('reading')
      setIsTimerRunning(true)
      startTimeRef.current = Date.now()
    } else {
      // All rounds complete
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const calculatedWPM = calculateWPM(wordIndex + 1, roundDurations[4])
      setWpm(calculatedWPM)

      const result = completeExercise('timeBoss', calculatedWPM,
        roundDurations[1] + roundDurations[2] + roundDurations[3] + roundDurations[4])
      setXpEarned(result.xpEarned)
      setBeatPB(result.beatPB)
      setPhase('results')
    }
  }, [timeUp, targetWordIndex, round, completeExercise])

  const handleRetry = useCallback(async () => {
    if (profile) {
      const text1 = await generateForTopics(profile.topics, profile.age)
      const text2 = await generateForTopics(profile.topics, profile.age)
      setText(text1 + ' ' + text2)
    }
    setPhase('instructions')
    setRound(1)
    setTargetWordIndex(null)
    setRoundResults([])
    setTimeUp(false)
    setWpm(0)
  }, [profile, generateForTopics])

  const successfulRounds = roundResults.filter(r => r.reachedTarget).length

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
                  <Info className="w-5 h-5 text-time-boss" />
                  <h2 className="font-semibold text-foreground">The 4 Rounds</h2>
                </div>
                <div className="space-y-3">
                  {([1, 2, 3, 4] as Round[]).map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-4 p-3 rounded-lg bg-background-secondary"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: config.color }}
                      >
                        {r}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <TimerIcon className="w-4 h-4 text-foreground-muted" />
                          <span className="font-medium text-foreground">
                            {formatTime(roundDurations[r])}
                          </span>
                        </div>
                        <p className="text-sm text-foreground-secondary">
                          {roundDescriptions[r]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-time-boss" />
                  <h2 className="font-semibold text-foreground">How it works</h2>
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

              {exercises.timeBoss.bestWPM > 0 && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-foreground-muted">Your best:</span>
                  <span className="font-bold text-xp-gold">
                    {exercises.timeBoss.bestWPM} WPM
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
                Start Time Boss Challenge
              </Button>
            </motion.div>
          )}

          {/* Reading Phase */}
          {(phase === 'reading' || phase === 'waiting') && (
            <motion.div
              key="reading"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Round Header */}
              <div className="bg-surface p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: config.color }}
                    >
                      {round}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Round {round} of 4</p>
                      <p className="text-sm text-foreground-secondary">{roundDescriptions[round]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Timer
                      duration={roundDurations[round]}
                      isRunning={isTimerRunning}
                      onComplete={handleTimerComplete}
                      size="lg"
                      showProgress
                    />
                  </div>
                </div>
                <ProgressBar
                  progress={round}
                  max={4}
                  size="sm"
                  color="orange"
                  label="Progress"
                />
              </div>

              {/* Time Up Notification */}
              {timeUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-time-boss/10 border-2 border-time-boss p-4 rounded-xl text-center"
                >
                  <p className="font-bold text-time-boss text-lg mb-1">Time&apos;s Up!</p>
                  <p className="text-foreground-secondary">
                    Click the word where you stopped reading
                  </p>
                </motion.div>
              )}

              <ReadingPane
                text={text}
                mode="time-boss"
                targetWordIndex={targetWordIndex}
                onWordClick={timeUp ? handleWordClick : undefined}
              />

              {!timeUp && (
                <p className="text-center text-sm text-foreground-muted">
                  Keep reading until time runs out...
                </p>
              )}
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
                className="w-20 h-20 mx-auto rounded-full bg-time-boss/10 flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-time-boss" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {successfulRounds >= 3 ? 'Time Boss Conquered!' : 'Challenge Complete!'}
                </h1>
                <p className="text-foreground-secondary">
                  You reached your target in {successfulRounds} of 4 rounds
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border max-w-sm mx-auto">
                <WPMDisplay
                  wpm={wpm}
                  previousWPM={exercises.timeBoss.bestWPM}
                  showTrend={exercises.timeBoss.sessions > 1}
                  label="Final Round WPM"
                />

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Round Results</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {roundResults.map((result, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-center ${
                          result.reachedTarget
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        <div className="font-bold">R{result.round}</div>
                        <div className="text-xs">{result.reachedTarget ? 'Hit!' : 'Miss'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-tisa-blue/5 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <span className="font-semibold text-tisa-blue">+{xpEarned} XP</span> earned!
                  {beatPB && <span className="ml-2 text-xp-gold font-semibold">+25 bonus for new PB!</span>}
                </p>
              </div>

              <div className="bg-background-secondary p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-foreground-secondary">
                  <strong>You&apos;re a Time Boss!</strong> Each round forces your brain to process
                  faster. With practice, that speed becomes your new normal reading pace!
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
