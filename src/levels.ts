export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(80 * Math.pow(1.4, level - 2))
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1
  let accumulated = 0
  while (true) {
    const needed = xpForLevel(level + 1)
    if (accumulated + needed > totalXP) return level
    accumulated += needed
    level++
  }
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXP(totalXP)
  let accumulated = 0
  for (let i = 2; i <= level; i++) {
    accumulated += xpForLevel(i)
  }
  const currentLevelXP = totalXP - accumulated
  const needed = xpForLevel(level + 1)
  return {
    current: currentLevelXP,
    needed,
    percent: Math.min(100, Math.floor((currentLevelXP / needed) * 100)),
  }
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0
  if (streak >= 14) return 1.7
  if (streak >= 7) return 1.5
  if (streak >= 3) return 1.2
  return 1.0
}

export function getLevelTitle(level: number): string {
  const titles: [number, string][] = [
    [50, 'Transcendent'],
    [40, 'Mythic'],
    [30, 'Legend'],
    [25, 'Hero'],
    [20, 'Champion'],
    [15, 'Knight'],
    [10, 'Warrior'],
    [5, 'Apprentice'],
    [1, 'Novice'],
  ]
  for (const [threshold, title] of titles) {
    if (level >= threshold) return title
  }
  return 'Novice'
}
