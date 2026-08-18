import { useState, useCallback, useEffect } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'
import { useGameState } from './store'
import { Avatar } from './components/Avatar'
import { QuestBoard } from './components/QuestBoard'
import { Achievements } from './components/Achievements'
import { Stats } from './components/Stats'
import { Calendar } from './components/Calendar'
import { AchievementToast } from './components/AchievementToast'
import { Login } from './components/Login'

type Tab = 'quests' | 'achievements' | 'calendar' | 'stats'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-4xl animate-pulse">⚔️</div>
      </div>
    )
  }

  if (isFirebaseConfigured && !user) return <Login />

  return <GameView user={user} />
}

function GameView({ user }: { user: User | null }) {
  const { state, getTodayLog, toggleQuest } = useGameState(user?.uid ?? null)
  const [activeTab, setActiveTab] = useState<Tab>('quests')
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  const handleToggle = useCallback((questId: string) => {
    const unlocked = toggleQuest(questId)
    if (unlocked) {
      setNewAchievements(unlocked)
    }
  }, [toggleQuest])

  const todayLog = getTodayLog()

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 pb-24">
      {newAchievements.length > 0 && (
        <AchievementToast
          achievementIds={newAchievements}
          onDismiss={() => setNewAchievements([])}
        />
      )}

      {/* Header with sign out */}
      {user && auth && (
        <div className="flex justify-end px-4 pt-3">
          <button
            onClick={() => signOut(auth!)}
            className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Sign out
          </button>
        </div>
      )}

      {/* Hero */}
      <div className={`bg-gradient-to-b from-indigo-100 to-gray-50 dark:from-indigo-950/50 dark:to-gray-900 ${user ? 'pt-4' : 'pt-8'} pb-8 px-4`}>
        <Avatar level={state.level} xp={state.xp} streak={state.currentStreak} />
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex max-w-lg mx-auto">
          {([
            { key: 'quests', label: 'Quests', icon: '⚔️' },
            { key: 'calendar', label: 'Calendar', icon: '📅' },
            { key: 'achievements', label: 'Trophies', icon: '🏆' },
            { key: 'stats', label: 'Stats', icon: '📊' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3.5 text-center text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 max-w-lg mx-auto">
        {activeTab === 'quests' && (
          <QuestBoard quests={state.quests} todayLog={todayLog} streak={state.currentStreak} onToggle={handleToggle} />
        )}
        {activeTab === 'calendar' && (
          <Calendar logs={state.logs} totalQuests={state.quests.length} />
        )}
        {activeTab === 'achievements' && (
          <Achievements unlocked={state.unlockedAchievements} />
        )}
        {activeTab === 'stats' && (
          <Stats logs={state.logs} totalQuests={state.quests.length} />
        )}
      </div>
    </div>
  )
}
