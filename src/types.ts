export interface Quest {
  id: string
  label: string
  category: QuestCategory
  xp: number
  icon: string
}

export type QuestCategory = 'health' | 'work' | 'relationship' | 'growth'

export interface DayLog {
  date: string
  completed: string[]
  xpEarned: number
}

export interface Achievement {
  id: string
  label: string
  description: string
  icon: string
  condition: (state: GameState) => boolean
}

export interface GameState {
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  logs: DayLog[]
  unlockedAchievements: string[]
  quests: Quest[]
  createdAt: string
}
