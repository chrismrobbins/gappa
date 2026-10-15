import { useState } from 'react'
import { isLessonDone, isUnlocked } from '../../lib/progress'
import { useProgress } from '../state/ProgressProvider'
import { LessonNode, type NodeState } from './LessonNode'
import { LessonSheet } from './LessonSheet'
import { ChipGroup } from '../common/ChipGroup'
import { sectionsFor, type NodeInfo, type Section, type Track } from './sections'

const TRACKS: { value: Track; label: string }[] = [
  { value: 'lessons', label: 'Lessons' },
  { value: 'letters', label: 'अक्षरं · Letters' },
]

interface LearnProps { track: Track; onTrack(t: Track): void; onStart(node: NodeInfo): void }

function useNodeState(): (id: string) => NodeState {
  const { progress, course } = useProgress()
  return (id) => (isLessonDone(progress, id) ? 'done' : isUnlocked(progress, course, id) ? 'unlocked' : 'locked')
}

function SectionPath(props: { section: Section; stateOf(id: string): NodeState; onOpen(n: NodeInfo): void }) {
  const { section } = props
  return (
    <section className="unit">
      <h2 className="unit-title">
        {section.nativeTitle && <span lang="mr">{section.nativeTitle}</span>}
        <span className="unit-sub">{section.nativeTitle ? ' · ' : ''}{section.title}</span>
      </h2>
      <ol className="path">
        {section.nodes.map((n, i) => (
          <LessonNode key={n.id} node={n} index={i} state={props.stateOf(n.id)} onOpen={() => props.onOpen(n)} />
        ))}
      </ol>
    </section>
  )
}

export function LearnScreen({ track, onTrack, onStart }: LearnProps) {
  const { course, username, progress } = useProgress()
  const stateOf = useNodeState()
  const [open, setOpen] = useState<NodeInfo | null>(null)
  return (
    <div className="screen">
      <h1 className="greeting"><span lang="mr">नमस्कार</span>{username ? `, ${username}!` : '!'}</h1>
      <ChipGroup<Track> label="Track" value={track} options={TRACKS} onChange={onTrack} />
      {sectionsFor(course, track).map((s) => (
        <SectionPath key={s.id} section={s} stateOf={stateOf} onOpen={setOpen} />
      ))}
      {open && (
        <LessonSheet node={open} done={isLessonDone(progress, open.id)} onClose={() => setOpen(null)}
          onStart={() => { setOpen(null); onStart(open) }} />
      )}
    </div>
  )
}
