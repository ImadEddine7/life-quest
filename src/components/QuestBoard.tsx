import type { Quest, DayLog } from '../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../quests'
import { getStreakMultiplier } from '../levels'

interface QuestBoardProps {
  quests: Quest[]
  dayLog: DayLog | undefined
  streak: number
  selectedDate: string
  onDateChange: (date: string) => void
  onToggle: (questId: string) => void
}

export function QuestBoard({ quests, dayLog, streak, selectedDate, onDateChange, onToggle }: QuestBoardProps) {
  const categories = ['health', 'work', 'relationship', 'growth'] as const
  const multiplier = getStreakMultiplier(streak)
  const completed = dayLog?.completed || []

  const today = new Date().toISOString().slice(0, 10)
  const isToday = selectedDate === today

  const displayDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    const newDate = d.toISOString().slice(0, 10)
    if (newDate <= today) onDateChange(newDate)
  }

  return (
    <div className="space-y-5">
      {/* Date selector */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <button
          onClick={() => shiftDate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 active:scale-90 transition-all"
        >
          ‹
        </button>
        <div className="text-center flex-1">
          <div className="text-[10px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-semibold">
            {isToday ? 'Today' : 'Reporting for'}
          </div>
          <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{displayDate}</div>
        </div>
        <button
          onClick={() => shiftDate(1)}
          disabled={isToday}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 ${
            isToday
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/40'
          }`}
        >
          ›
        </button>
      </div>

      {!isToday && (
        <button
          onClick={() => onDateChange(today)}
          className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium py-1 hover:underline"
        >
          ← Back to today
        </button>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Daily Quests</h2>
        {multiplier > 1 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
            x{multiplier.toFixed(1)} streak bonus
          </span>
        )}
      </div>

      {categories.map(cat => {
        const catQuests = quests.filter(q => q.category === cat)
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {CATEGORY_LABELS[cat]}
              </span>
            </div>
            <div className="space-y-1.5">
              {catQuests.map(quest => {
                const done = completed.includes(quest.id)
                return (
                  <button
                    key={quest.id}
                    onClick={() => onToggle(quest.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all active:scale-[0.98] ${
                      done
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{done ? '✅' : quest.icon}</span>
                    <span className={`flex-1 text-sm ${
                      done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {quest.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                      +{Math.floor(quest.xp * multiplier)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{isToday ? 'Today' : displayDate}</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {completed.length}/{quests.length}
          </span>
        </div>
        <div className="mt-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${quests.length > 0 ? (completed.length / quests.length) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
