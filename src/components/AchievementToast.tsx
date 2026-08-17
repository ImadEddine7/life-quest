import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../achievements'

interface AchievementToastProps {
  achievementIds: string[]
  onDismiss: () => void
}

export function AchievementToast({ achievementIds, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const achievements = achievementIds
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)

  if (achievements.length === 0) return null

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      {achievements.map(a => (
        <div
          key={a!.id}
          className="bg-amber-50 dark:bg-amber-900/90 border border-amber-300 dark:border-amber-600 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 mb-2 backdrop-blur-sm"
        >
          <span className="text-3xl">{a!.icon}</span>
          <div>
            <div className="text-[10px] text-amber-600 dark:text-amber-300 font-bold uppercase tracking-wider">
              Achievement Unlocked!
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{a!.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
