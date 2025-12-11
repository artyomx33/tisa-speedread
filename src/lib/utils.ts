import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateWPM(wordCount: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0
  return Math.round((wordCount / timeInSeconds) * 60)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatTimeWithMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  const milliseconds = Math.floor((ms % 1000) / 10)
  return `${mins}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export function splitIntoLines(text: string, maxChars: number = 60): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxChars) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isToday(dateString: string): boolean {
  return dateString === getDateString(new Date())
}

export function isYesterday(dateString: string): boolean {
  const yesterday = new Date(Date.now() - 86400000)
  return dateString === getDateString(yesterday)
}

export function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return getDateString(d)
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`)
}

export function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
