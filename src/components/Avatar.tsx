import { getAvatarForLevel } from '../avatar-sprites'
import { getXPProgress, getLevelTitle } from '../levels'

interface AvatarProps {
  level: number
  xp: number
  streak: number
}

export function Avatar({ level, xp, streak }: AvatarProps) {
  const { pixels, label } = getAvatarForLevel(level)
  const progress = getXPProgress(xp)
  const title = getLevelTitle(level)
  const pixelSize = 7

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{ width: 16 * pixelSize, height: 16 * pixelSize, imageRendering: 'pixelated' }}
      >
        {streak >= 7 && (
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-30"
            style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)', transform: 'scale(1.5)' }}
          />
        )}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `repeat(16, ${pixelSize}px)`,
            gridTemplateRows: `repeat(16, ${pixelSize}px)`,
          }}
        >
          {pixels.flat().map((color, i) => (
            <div key={i} style={{ width: pixelSize, height: pixelSize, backgroundColor: color || 'transparent' }} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-base font-bold text-gray-800 dark:text-gray-100">
          Lv.{level} — {title}
        </div>
        {streak > 0 && (
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            🔥 {streak} day streak
          </div>
        )}
      </div>

      <div className="w-full max-w-[200px]">
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
          <span>{progress.current} XP</span>
          <span>{progress.needed} XP</span>
        </div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
