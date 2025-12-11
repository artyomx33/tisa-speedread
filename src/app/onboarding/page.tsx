'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/atoms'
import { TopicSelector } from '@/components/molecules'
import { useUserStore } from '@/stores/useUserStore'
import type { Topic } from '@/schemas/user'
import { slideIn } from '@/lib/animations'

type Step = 'name' | 'topics' | 'ready'

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile, completeOnboarding } = useUserStore()

  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [age, setAge] = useState(8)
  const [topics, setTopics] = useState<Topic[]>([])

  const handleTopicToggle = (topic: Topic) => {
    setTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : prev.length < 5
          ? [...prev, topic]
          : prev
    )
  }

  const handleComplete = () => {
    setProfile(name, age, topics)
    completeOnboarding()
    router.push('/baseline')
  }

  const canProceedFromName = name.trim().length >= 1
  const canProceedFromTopics = topics.length >= 1

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['name', 'topics', 'ready'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s
                  ? 'w-8 bg-tisa-blue'
                  : i < ['name', 'topics', 'ready'].indexOf(step)
                    ? 'w-4 bg-tisa-blue/50'
                    : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Name & Age */}
          {step === 'name' && (
            <motion.div
              key="name"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome, Speed Reader!
                </h1>
                <p className="text-foreground-secondary">
                  Let&apos;s set up your training profile
                </p>
              </div>

              <div className="space-y-6 bg-surface p-6 rounded-2xl border border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What&apos;s your name?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background
                             text-foreground placeholder:text-foreground-muted
                             focus:outline-none focus:ring-2 focus:ring-tisa-blue"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    How old are you?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={5}
                      max={15}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="flex-1 accent-tisa-blue"
                    />
                    <span className="text-2xl font-bold text-foreground w-12 text-center">
                      {age}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep('topics')}
                disabled={!canProceedFromName}
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Topics */}
          {step === 'topics' && (
            <motion.div
              key="topics"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  What do you love reading about?
                </h1>
                <p className="text-foreground-secondary">
                  Pick 1-5 topics for your reading practice
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border">
                <TopicSelector
                  selectedTopics={topics}
                  onToggle={handleTopicToggle}
                  maxSelections={5}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('name')}
                  variant="outline"
                  size="lg"
                  leftIcon={<ArrowLeft className="w-5 h-5" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('ready')}
                  disabled={!canProceedFromTopics}
                  size="lg"
                  className="flex-1"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Ready */}
          {step === 'ready' && (
            <motion.div
              key="ready"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 mx-auto rounded-full bg-tisa-blue/10 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-tisa-blue" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Ready, {name}?
                </h1>
                <p className="text-foreground-secondary text-lg">
                  Let&apos;s find out how fast you read right now!
                </p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                <h2 className="font-semibold text-foreground">
                  Your Baseline Test
                </h2>
                <ul className="text-left space-y-3 text-foreground-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-tisa-blue font-bold">1.</span>
                    <span>You&apos;ll read a short passage about your favorite topics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-tisa-blue font-bold">2.</span>
                    <span>Read at your normal comfortable speed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-tisa-blue font-bold">3.</span>
                    <span>We&apos;ll measure your starting WPM (words per minute)</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('topics')}
                  variant="outline"
                  size="lg"
                  leftIcon={<ArrowLeft className="w-5 h-5" />}
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="flex-1"
                  rightIcon={<Sparkles className="w-5 h-5" />}
                >
                  Start Baseline Test
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
