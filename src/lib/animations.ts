import { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

export const celebrationBurst: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: [0, 1.2, 1],
    rotate: [-180, 10, 0],
    transition: { duration: 0.6, type: 'spring' },
  },
}

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(74, 144, 217, 0)',
      '0 0 0 10px rgba(74, 144, 217, 0.3)',
      '0 0 0 0 rgba(74, 144, 217, 0)',
    ],
    transition: { duration: 1.5, repeat: Infinity },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export const countUp: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', bounce: 0.4 },
  },
}

export const pointerHighlight: Variants = {
  idle: { backgroundColor: 'transparent' },
  active: {
    backgroundColor: 'rgba(74, 144, 217, 0.3)',
    transition: { duration: 0.15 },
  },
}

export const badgeUnlock: Variants = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: [0, 1.3, 1],
    rotate: [-45, 5, 0],
    transition: { duration: 0.5, type: 'spring' },
  },
}

export const xpFloat: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: -40,
    transition: { duration: 1.5, times: [0, 0.2, 0.8, 1] },
  },
}

export const progressFill: Variants = {
  hidden: { width: 0 },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.8, ease: 'easeOut' },
  }),
}
