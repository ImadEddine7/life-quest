import type { Achievement, GameState } from './types'

function consecutiveDays(state: GameState, questId: string): number {
  let count = 0
  const sorted = [...state.logs].sort((a, b) => b.date.localeCompare(a.date))
  for (const log of sorted) {
    if (log.completed.includes(questId)) count++
    else break
  }
  return count
}

function totalCompletions(state: GameState, questId: string): number {
  return state.logs.filter(l => l.completed.includes(questId)).length
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-day',
    label: 'First Step',
    description: 'Complete all quests in a single day',
    icon: '⭐',
    condition: (s) => s.logs.some(l => l.completed.length === s.quests.length),
  },
  {
    id: 'week-warrior',
    label: 'Week Warrior',
    description: '7-day streak',
    icon: '🗡️',
    condition: (s) => s.longestStreak >= 7,
  },
  {
    id: 'iron-will',
    label: 'Iron Will',
    description: '14-day streak',
    icon: '🛡️',
    condition: (s) => s.longestStreak >= 14,
  },
  {
    id: 'monk-mode',
    label: 'Monk Mode',
    description: '30-day streak',
    icon: '🧘',
    condition: (s) => s.longestStreak >= 30,
  },
  {
    id: 'smoke-free-week',
    label: 'Clean Lungs I',
    description: '7 consecutive smoke-free days',
    icon: '🌬️',
    condition: (s) => consecutiveDays(s, 'no-smoke') >= 7,
  },
  {
    id: 'smoke-free-month',
    label: 'Clean Lungs II',
    description: '30 consecutive smoke-free days',
    icon: '🏔️',
    condition: (s) => consecutiveDays(s, 'no-smoke') >= 30,
  },
  {
    id: 'bookworm',
    label: 'Bookworm',
    description: 'Read for 14 days',
    icon: '📚',
    condition: (s) => totalCompletions(s, 'read') >= 14,
  },
  {
    id: 'deep-focus',
    label: 'Deep Focus',
    description: '10 days of 4h+ deep work',
    icon: '🔥',
    condition: (s) => totalCompletions(s, 'deep-work') >= 10,
  },
  {
    id: 'present-partner',
    label: 'Present Partner',
    description: '14 days of quality time',
    icon: '💕',
    condition: (s) => totalCompletions(s, 'quality-time') >= 14,
  },
  {
    id: 'level-10',
    label: 'Warrior Status',
    description: 'Reach level 10',
    icon: '⚔️',
    condition: (s) => s.level >= 10,
  },
  {
    id: 'level-20',
    label: 'Champion',
    description: 'Reach level 20',
    icon: '👑',
    condition: (s) => s.level >= 20,
  },
  {
    id: 'centurion',
    label: 'Centurion',
    description: '100 days logged',
    icon: '🏛️',
    condition: (s) => s.logs.length >= 100,
  },
]
