'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { splitIntoLines } from '@/lib/utils'

export type ReadingMode = 'normal' | 'pointer' | 'silent' | 'side-scan' | 'time-boss'

interface ReadingPaneProps {
  text: string
  mode?: ReadingMode
  pointerWordIndex?: number
  countNumber?: number
  countPosition?: 'center' | 'corner'
  showGuides?: boolean
  guideOpacity?: number
  targetWordIndex?: number | null
  onWordClick?: (wordIndex: number) => void
  fontSize?: 'sm' | 'md' | 'lg'
  className?: string
}

const fontSizes = {
  sm: 'text-base leading-8',
  md: 'text-lg leading-10',
  lg: 'text-xl leading-12',
}

export function ReadingPane({
  text,
  mode = 'normal',
  pointerWordIndex,
  countNumber,
  countPosition = 'corner',
  showGuides = true,
  guideOpacity = 0.3,
  targetWordIndex = null,
  onWordClick,
  fontSize = 'md',
  className,
}: ReadingPaneProps) {
  const lines = useMemo(() => splitIntoLines(text, 60), [text])
  const [hoveredWord, setHoveredWord] = useState<number | null>(null)

  const getAllWords = useCallback(() => {
    const words: { word: string; lineIndex: number; wordInLine: number }[] = []
    lines.forEach((line, lineIndex) => {
      line.split(/\s+/).forEach((word, wordInLine) => {
        if (word.trim()) {
          words.push({ word, lineIndex, wordInLine })
        }
      })
    })
    return words
  }, [lines])

  const allWords = getAllWords()

  const getWordIndex = (lineIndex: number, wordInLine: number): number => {
    let index = 0
    for (let i = 0; i < lineIndex; i++) {
      index += lines[i].split(/\s+/).filter(w => w.trim()).length
    }
    return index + wordInLine
  }

  const isWordHighlighted = (globalIndex: number): boolean => {
    if (mode === 'pointer' && pointerWordIndex !== undefined) {
      return globalIndex === pointerWordIndex
    }
    return false
  }

  const isWordGreyed = (globalIndex: number): boolean => {
    if (mode === 'time-boss' && targetWordIndex !== null) {
      return globalIndex > targetWordIndex
    }
    return false
  }

  const handleWordClick = (globalIndex: number) => {
    if (mode === 'time-boss' && onWordClick) {
      onWordClick(globalIndex)
    }
  }

  return (
    <div
      className={cn(
        'relative p-6 bg-surface rounded-2xl border border-border',
        'max-w-[700px] mx-auto',
        className
      )}
    >
      {/* Side Vision Guide Lines */}
      {mode === 'side-scan' && showGuides && (
        <>
          <div
            className="absolute top-0 bottom-0 left-[15%] w-0.5 bg-side-scanner"
            style={{ opacity: guideOpacity }}
          />
          <div
            className="absolute top-0 bottom-0 right-[15%] w-0.5 bg-side-scanner"
            style={{ opacity: guideOpacity }}
          />
        </>
      )}

      {/* Silent Shadow Count Overlay */}
      <AnimatePresence>
        {mode === 'silent' && countNumber !== undefined && (
          <motion.div
            key={countNumber}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-10 flex items-center justify-center',
              'w-20 h-20 rounded-full bg-silent-shadow/90 text-white',
              'text-4xl font-bold shadow-lg',
              countPosition === 'center'
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'top-4 right-4'
            )}
          >
            {countNumber}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Text */}
      <div className={cn('reading-text', fontSizes[fontSize])}>
        {lines.map((line, lineIndex) => {
          const wordsInLine = line.split(/\s+/).filter(w => w.trim())

          return (
            <div
              key={lineIndex}
              className="flex flex-wrap gap-x-2 mb-2"
            >
              {wordsInLine.map((word, wordInLine) => {
                const globalIndex = getWordIndex(lineIndex, wordInLine)
                const highlighted = isWordHighlighted(globalIndex)
                const greyed = isWordGreyed(globalIndex)
                const isHovered = hoveredWord === globalIndex
                const isClickable = mode === 'time-boss'

                return (
                  <motion.span
                    key={`${lineIndex}-${wordInLine}`}
                    className={cn(
                      'relative px-0.5 py-0.5 rounded transition-all',
                      highlighted && 'bg-pointer-wand/30',
                      greyed && 'text-foreground-muted/40',
                      isClickable && !greyed && 'cursor-pointer hover:bg-background-secondary',
                      isHovered && isClickable && 'bg-time-boss/20'
                    )}
                    onClick={() => handleWordClick(globalIndex)}
                    onMouseEnter={() => isClickable && setHoveredWord(globalIndex)}
                    onMouseLeave={() => setHoveredWord(null)}
                    animate={
                      highlighted
                        ? {
                            backgroundColor: ['rgba(74, 144, 217, 0)', 'rgba(74, 144, 217, 0.3)', 'rgba(74, 144, 217, 0)'],
                          }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {word}
                  </motion.span>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Pointer Mode: Current Line Indicator */}
      {mode === 'pointer' && pointerWordIndex !== undefined && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <span className="w-3 h-3 rounded-full bg-pointer-wand animate-pulse" />
            <span>Follow the highlighted word</span>
          </div>
        </div>
      )}

      {/* Time Boss: Target Indicator */}
      {mode === 'time-boss' && targetWordIndex !== null && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <span className="w-3 h-3 rounded-full bg-time-boss" />
            <span>Your target: word {targetWordIndex + 1} of {allWords.length}</span>
          </div>
        </div>
      )}

      {/* Side Scan: Guide Legend */}
      {mode === 'side-scan' && showGuides && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <span className="w-3 h-3 rounded-full bg-side-scanner" />
            <span>Focus between the lines - use your side vision for edge words</span>
          </div>
        </div>
      )}
    </div>
  )
}
