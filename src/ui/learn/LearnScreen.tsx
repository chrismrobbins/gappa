import { useState } from 'react'
import { isLessonDone, isUnlocked } from '../../lib/progress'
import { ChipGroup } from '../common/ChipGroup'
import { useProgress } from '../state/ProgressProvider'
import { HeroCard } from './HeroCard'
import { nextNode } from './hero'
import type { NodeState } from './LessonNode'
import { LessonSheet } from './LessonSheet'
import { SectionPath } from './SectionPath'
import { sectionsFor, type NodeInfo, type Track } from './sections'
import { useSectionToggles } from './useSectionToggles'

const TRACKS: { value: Track; label: string }[] = [
  { value: 'lessons', label: 'Lessons' },
  { value: 'letters', label: 'अक्षरं · Letters' },
]

interface LearnProps { track: Track; onTrack(t: Track): void; onStart(node: NodeInfo): void }

function useNodeState(): (id: string) => NodeState {
  const { progress, course } = useProgress()
  return (id) => (isLessonDone(progress, id) ? 'done' : isUnlocked(progress, course, id) ? 'unlocked' : 'locked')
}

export function LearnScreen({ track, onTrack, onStart }: LearnProps) {
  const { course, progress } = useProgress()
  const stateOf = useNodeState()
  const [open, setOpen] = useState<NodeInfo | null>(null)
  const next = nextNode(course, progress, track)
  const sections = useSectionToggles(next?.id ?? null)
  return (
    <div className="screen">
      <HeroCard next={next} onContinue={() => next && onStart(next)} />
      <ChipGroup<Track> label="Track" value={track} options={TRACKS} onChange={onTrack} />
      {sectionsFor(course, track).map((s) => (
        <SectionPath key={s.id} section={s} currentId={next?.id ?? null} open={sections.isOpen(s)}
          onToggle={() => sections.toggle(s)} stateOf={stateOf} onOpen={setOpen} />
      ))}
      {open && (
        <LessonSheet node={open} done={isLessonDone(progress, open.id)} onClose={() => setOpen(null)}
          onStart={() => { setOpen(null); onStart(open) }} />
      )}
    </div>
  )
}
