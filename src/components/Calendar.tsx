import type { DayLog } from '../types'

interface CalendarProps {
  logs: DayLog[]
  totalQuests: number
}

export function Calendar({ logs, totalQuests }: CalendarProps) {
  const today = new Date()
  const [year, month] = [today.getFullYear(), today.getMonth()]
  const logMap = new Map(logs.map(l => [l.date, l]))

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const cells: { day: number; ratio: number; isToday: boolean }[] = []

  // Empty cells before first day
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    cells.push({ day: 0, ratio: -1, isToday: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const log = logMap.get(dateStr)
    const count = log?.completed.length || 0
    const ratio = totalQuests > 0 ? count / totalQuests : 0
    const isToday = d === today.getDate()
    cells.push({ day: d, ratio, isToday })
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{monthName}</h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell.day === 0) return <div key={i} />

          const bg = cell.ratio > 0.75 ? 'bg-green-400 dark:bg-green-500'
            : cell.ratio > 0.5 ? 'bg-green-300 dark:bg-green-600'
            : cell.ratio > 0.25 ? 'bg-green-200 dark:bg-green-700'
            : cell.ratio > 0 ? 'bg-green-100 dark:bg-green-800'
            : 'bg-gray-100 dark:bg-gray-800'

          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative ${bg} ${
                cell.isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-900' : ''
              }`}
            >
              <span className={cell.ratio > 0.5 ? 'text-white dark:text-white' : 'text-gray-600 dark:text-gray-300'}>
                {cell.day}
              </span>
              {cell.isToday && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-gray-500 dark:text-gray-400">
        <span>0%</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-800" />
          <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-700" />
          <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-600" />
          <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-500" />
        </div>
        <span>100%</span>
      </div>
    </div>
  )
}
