import { useState } from 'react'
import { streakInfo } from '../lib/progress'
import { sfx } from '../services/sfx'
import { cloudEnabled } from '../services/supabase'
import type { ExerciseResult } from '../types'
import { AuthScreen } from './auth/AuthScreen'
import { FinishScreen, type FinishInfo } from './finish/FinishScreen'
import { LearnScreen } from './learn/LearnScreen'
import type { Track } from './learn/sections'
import { MeScreen } from './me/MeScreen'
import { ReviewScreen } from './review/ReviewScreen'
import { Runner } from './runner/Runner'
import { reviewSession, startSession, type Session } from './runner/session'
import { Shell } from './shell/Shell'
import type { Tab } from './shell/TabBar'
import { ProgressProvider, useProgress } from './state/ProgressProvider'
import { todayKey } from './state/today'
import { useAuth } from './state/useAuth'

type View = { name: 'tabs' } | { name: 'run'; session: Session } | { name: 'finish'; info: FinishInfo }

interface TabsProps { tab: Tab; onTab(t: Tab): void; track: Track; onTrack(t: Track): void; onSession(s: Session): void }

function Tabs(props: TabsProps) {
  const { course } = useProgress()
  return (
    <Shell tab={props.tab} onTab={props.onTab}>
      {props.tab === 'learn' && <LearnScreen track={props.track} onTrack={props.onTrack} onStart={(n) => props.onSession(startSession(course, n.kind, n.id))} />}
      {props.tab === 'review' && <ReviewScreen onStart={(keys) => props.onSession(reviewSession(course, keys))} />}
      {props.tab === 'me' && <MeScreen />}
    </Shell>
  )
}

/** Records a finished session and returns what the finish screen shows. */
function useFinish(): (session: Session, results: ExerciseResult[]) => FinishInfo {
  const { finishSession, progress } = useProgress()
  return (session, results) => {
    const wasActiveToday = streakInfo(progress, todayKey()).doneToday
    const outcome = finishSession({ kind: session.kind, id: session.id, results, now: Date.now() })
    if (progress.settings.sound) sfx('finish')
    return { outcome, kind: session.kind, wasActiveToday }
  }
}

function Home() {
  const [tab, setTab] = useState<Tab>('learn')
  const [track, setTrack] = useState<Track>('lessons')
  const [view, setView] = useState<View>({ name: 'tabs' })
  const finish = useFinish()
  const toTabs = () => setView({ name: 'tabs' })
  // A session with no cards (e.g. review keys whose content changed) would leave a blank screen.
  const run = (session: Session) => { if (session.cards.length > 0) setView({ name: 'run', session }) }

  if (view.name === 'run') {
    const onFinish = (r: ExerciseResult[]) => setView({ name: 'finish', info: finish(view.session, r) })
    return <Runner session={view.session} onExit={toTabs} onFinish={onFinish} />
  }
  if (view.name === 'finish') return <FinishScreen info={view.info} onDone={toTabs} />
  return <Tabs tab={tab} onTab={setTab} track={track} onTrack={setTrack} onSession={run} />
}

export function App() {
  const auth = useAuth()
  if (auth.status === 'loading') return <p className="center splash">Gappa…</p>
  if (auth.status === 'signedOut') return <AuthScreen />
  // Keyed by account so switching users never carries one learner's progress into another's.
  return (
    <ProgressProvider key={auth.username ?? 'local'} cloud={cloudEnabled} username={auth.username}>
      <Home />
    </ProgressProvider>
  )
}
