'use client'

import { useSyncExternalStore } from 'react'

// Custom hook to check hydration without useEffect + setState pattern
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

function useHydrated() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydrated()

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
