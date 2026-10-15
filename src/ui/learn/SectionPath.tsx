import { LessonNode, type NodeState } from './LessonNode'
import type { NodeInfo, Section } from './sections'

interface PathProps {
  section: Section
  currentId: string | null
  stateOf(id: string): NodeState
  onOpen(n: NodeInfo): void
}

function UnitBanner({ section, done }: { section: Section; done: number }) {
  return (
    <div className="unit-banner">
      <div>
        <p className="unit-eyebrow">{section.eyebrow}</p>
        <h2 className="unit-title">
          {section.nativeTitle && <><span lang="mr">{section.nativeTitle}</span> · </>}
          <span className="unit-sub">{section.title}</span>
        </h2>
      </div>
      <span className="unit-count" aria-label={`${done} of ${section.nodes.length} done`}>{done} / {section.nodes.length}</span>
    </div>
  )
}

/** One unit: a colored banner over a serpentine path of lesson nodes. */
export function SectionPath({ section, currentId, stateOf, onOpen }: PathProps) {
  const done = section.nodes.filter((n) => stateOf(n.id) === 'done').length
  return (
    <section className={`unit tone-${section.tone}`}>
      <UnitBanner section={section} done={done} />
      <ol className="path">
        {section.nodes.map((n, i) => (
          <LessonNode key={n.id} node={n} index={i} state={stateOf(n.id)} current={n.id === currentId} onOpen={() => onOpen(n)} />
        ))}
      </ol>
    </section>
  )
}
