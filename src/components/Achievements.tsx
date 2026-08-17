import { ACHIEVEMENTS } from '../achievements'

interface AchievementsProps {
  unlocked: string[]
}

export function Achievements({ unlocked }: AchievementsProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Achievements</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {ACHIEVEMENTS.map(a => {
          const isUnlocked = unlocked.includes(a.id)
          return (
            <div
              key={a.id}
              className={`flex flex-col items-center p-3 rounded-xl text-center transition-all ${
                isUnlocked
                  ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
                  : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-40'
              }`}
            >
              <span className="text-2xl mb-1">{isUnlocked ? a.icon : '🔒'}</span>
              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-tight">
                {a.label}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                {a.description}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
