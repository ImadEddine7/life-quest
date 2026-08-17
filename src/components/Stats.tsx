import type { DayLog } from '../types'

interface StatsProps {
  logs: DayLog[]
  totalQuests: number
}

export function Stats({ logs, totalQuests }: StatsProps) {
  const last28 = getLast28Days(logs, totalQuests)
  const totalXP = logs.reduce((sum, l) => sum + l.xpEarned, 0)
  const totalDays = logs.filter(l => l.completed.length > 0).length
  const avgCompletion = totalDays > 0
    ? Math.round(logs.filter(l => l.completed.length > 0).reduce((sum, l) => sum + l.completed.length, 0) / totalDays)
    : 0

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Stats</h2>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{totalXP}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Total XP</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{totalDays}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Days Active</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{avgCompletion}/{totalQuests}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Avg/Day</div>
        </div>
      </div>

      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 font-medium">Last 28 days</div>
      <div className="grid grid-cols-7 gap-1.5">
        {last28.map((day, i) => (
          <div
            key={i}
            className="aspect-square rounded"
            style={{ backgroundColor: day.color }}
            title={`${day.date}: ${day.count}/${totalQuests}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {['#374151', '#065f46', '#059669', '#10b981', '#34d399'].map(c => (
            <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

function getLast28Days(logs: DayLog[], totalQuests: number) {
  const days: { date: string; count: number; color: string }[] = []
  const logMap = new Map(logs.map(l => [l.date, l]))

  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const log = logMap.get(dateStr)
    const count = log?.completed.length || 0
    const ratio = totalQuests > 0 ? count / totalQuests : 0

    let color = '#374151'
    if (ratio > 0.75) color = '#34d399'
    else if (ratio > 0.5) color = '#10b981'
    else if (ratio > 0.25) color = '#059669'
    else if (ratio > 0) color = '#065f46'

    days.push({ date: dateStr, count, color })
  }
  return days
}
