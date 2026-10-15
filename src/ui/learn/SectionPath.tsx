import { ChevronDownIcon } from '../common/Icons'
import { LessonNode, type NodeState } from './LessonNode'
import type { NodeInfo, Section } from './sections'

interface PathProps {
  section: Section
  currentId: string | null
  open: boolean
  onToggle(): void
  stateOf(id: string): NodeState
  onOpen(n: NodeInfo): void
}

interface BannerProps { section: Section; done: number; open: boolean; onToggle(): void }

function UnitBanner({ section, done, open, onToggle }: BannerProps) {
  return (
    <button type="button" className="unit-banner" aria-expanded={open} aria-controls={`path-${section.id}`} onClick={onToggle}>
      <div>
        <p className="unit-eyebrow">{section.eyebrow}</p>
        <h2 className="unit-title">
          {section.nativeTitle && <><span lang="mr">{section.nativeTitle}</span> · </>}
          <span className="unit-sub">{section.title}</span>
        </h2>
      </div>
      <span className="unit-meta">
        <span className="unit-count" aria-label={`${done} of ${section.nodes.length} done`}>{done} / {section.nodes.length}</span>
        <ChevronDownIcon size={22} className="unit-chevron" />
      </span>
    </button>
  )
}

/** One unit: a colored banner (tap to collapse) over a serpentine path of lesson nodes. */
export function SectionPath({ section, currentId, open, onToggle, stateOf, onOpen }: PathProps) {
  const done = section.nodes.filter((n) => stateOf(n.id) === 'done').length
  return (
    <section className={`unit tone-${section.tone}`}>
      <UnitBanner section={section} done={done} open={open} onToggle={onToggle} />
      <ol className="path" id={`path-${section.id}`} hidden={!open}>
        {section.nodes.map((n, i) => (
          <LessonNode key={n.id} node={n} index={i} state={stateOf(n.id)} current={n.id === currentId} onOpen={() => onOpen(n)} />
        ))}
      </ol>
    </section>
  )
}
