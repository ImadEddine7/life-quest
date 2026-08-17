import type { Quest } from './types'

export const DEFAULT_QUESTS: Quest[] = [
  { id: 'no-smoke', label: 'No smoking today', category: 'health', xp: 25, icon: '🚭' },
  { id: 'exercise', label: 'Exercise 30min+', category: 'health', xp: 20, icon: '💪' },
  { id: 'diet', label: 'Stuck to meal plan', category: 'health', xp: 20, icon: '🥗' },
  { id: 'water', label: 'Drank 2L+ water', category: 'health', xp: 10, icon: '💧' },
  { id: 'sleep', label: 'In bed by midnight', category: 'health', xp: 15, icon: '🌙' },

  { id: 'deep-work', label: '4h+ deep work', category: 'work', xp: 25, icon: '🎯' },
  { id: 'deliverable', label: 'Shipped something', category: 'work', xp: 30, icon: '🚀' },
  { id: 'no-procrastinate', label: 'No procrastination', category: 'work', xp: 15, icon: '⚡' },

  { id: 'quality-time', label: 'Quality time together', category: 'relationship', xp: 20, icon: '❤️' },
  { id: 'communicate', label: 'Open conversation', category: 'relationship', xp: 15, icon: '🗣️' },
  { id: 'plan-together', label: 'Planned something together', category: 'relationship', xp: 15, icon: '📅' },

  { id: 'read', label: 'Read 20+ pages', category: 'growth', xp: 15, icon: '📖' },
  { id: 'learn', label: 'Learned something new', category: 'growth', xp: 15, icon: '🧠' },
  { id: 'reflect', label: 'Journaled / reflected', category: 'growth', xp: 10, icon: '✍️' },
]

export const CATEGORY_LABELS: Record<string, string> = {
  health: 'Health',
  work: 'Work',
  relationship: 'Relationship',
  growth: 'Growth',
}

export const CATEGORY_COLORS: Record<string, string> = {
  health: '#10b981',
  work: '#3b82f6',
  relationship: '#ec4899',
  growth: '#8b5cf6',
}
