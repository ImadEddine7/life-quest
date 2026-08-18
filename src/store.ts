import { useState, useCallback, useEffect } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import type { GameState, DayLog } from './types'
import { DEFAULT_QUESTS } from './quests'
import { getLevelFromXP, getStreakMultiplier } from './levels'
import { ACHIEVEMENTS } from './achievements'

const LOCAL_KEY = 'lifequest-state'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function createInitialState(): GameState {
  return {
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    logs: [],
    unlockedAchievements: [],
    quests: DEFAULT_QUESTS,
    createdAt: today(),
  }
}

function loadLocal(): GameState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return createInitialState()
    return JSON.parse(raw)
  } catch {
    return createInitialState()
  }
}

function saveLocal(state: GameState): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
}

function calculateStreak(logs: DayLog[]): { current: number; longest: number } {
  if (logs.length === 0) return { current: 0, longest: 0 }

  const sorted = [...logs]
    .filter(l => l.completed.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (sorted.length === 0) return { current: 0, longest: 0 }

  let current = 0
  const todayStr = today()
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (sorted[0].date === todayStr || sorted[0].date === yesterdayStr) {
    current = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date)
      const curr = new Date(sorted[i].date)
      const diff = (prev.getTime() - curr.getTime()) / 86400000
      if (diff === 1) current++
      else break
    }
  }

  let longest = 0
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date)
    const curr = new Date(sorted[i].date)
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else {
      longest = Math.max(longest, streak)
      streak = 1
    }
  }
  longest = Math.max(longest, streak, current)

  return { current, longest }
}

export function useGameState(uid: string | null) {
  const [state, setState] = useState<GameState>(loadLocal)

  // Real-time Firestore sync
  useEffect(() => {
    if (!uid || !isFirebaseConfigured || !db) return
    const ref = doc(db, 'users', uid)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const remote = snap.data() as GameState
        if (!remote.quests || remote.quests.length === 0) {
          remote.quests = DEFAULT_QUESTS
        }
        setState(remote)
        saveLocal(remote)
      }
    })
    return unsub
  }, [uid])

  const persist = useCallback((newState: GameState) => {
    setState(newState)
    saveLocal(newState)
    if (uid && isFirebaseConfigured && db) {
      const ref = doc(db, 'users', uid)
      setDoc(ref, newState)
    }
  }, [uid])

  const getLogForDate = useCallback((date: string): DayLog | undefined => {
    return state.logs.find(l => l.date === date)
  }, [state.logs])

  const toggleQuest = useCallback((questId: string, date: string) => {
    const logs = [...state.logs]
    let logIndex = logs.findIndex(l => l.date === date)

    if (logIndex === -1) {
      logs.push({ date, completed: [], xpEarned: 0 })
      logIndex = logs.length - 1
    }

    const log = { ...logs[logIndex] }
    const quest = state.quests.find(q => q.id === questId)
    if (!quest) return null

    let xpDelta = 0
    if (log.completed.includes(questId)) {
      log.completed = log.completed.filter(id => id !== questId)
      xpDelta = -Math.floor(quest.xp * getStreakMultiplier(state.currentStreak))
    } else {
      log.completed = [...log.completed, questId]
      xpDelta = Math.floor(quest.xp * getStreakMultiplier(state.currentStreak))
    }

    log.xpEarned += xpDelta
    logs[logIndex] = log

    const newXP = Math.max(0, state.xp + xpDelta)
    const newLevel = getLevelFromXP(newXP)
    const { current, longest } = calculateStreak(logs)

    const newState: GameState = {
      ...state,
      xp: newXP,
      level: newLevel,
      currentStreak: current,
      longestStreak: longest,
      logs,
    }

    const newAchievements = ACHIEVEMENTS
      .filter(a => !newState.unlockedAchievements.includes(a.id) && a.condition(newState))
      .map(a => a.id)

    if (newAchievements.length > 0) {
      newState.unlockedAchievements = [...newState.unlockedAchievements, ...newAchievements]
    }

    persist(newState)
    return newAchievements.length > 0 ? newAchievements : null
  }, [state, persist])

  return { state, getLogForDate, toggleQuest }
}
