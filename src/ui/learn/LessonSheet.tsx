import { CloseIcon } from '../common/Icons'
import { countsLabel, type NodeInfo } from './sections'

export function LessonSheet(props: { node: NodeInfo; done: boolean; onStart(): void; onClose(): void }) {
  const { node } = props
  return (
    <div className="overlay overlay-sheet" role="presentation" onClick={props.onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn sheet-close" aria-label="Close" onClick={props.onClose}>
          <CloseIcon size={20} />
        </button>
        <h2 id="sheet-title">{node.title}</h2>
        <p className="muted">{node.blurb}</p>
        {node.tipTitle && <p className="chip-line">Tip: {node.tipTitle}</p>}
        <p className="chip-line">{countsLabel(node)}</p>
        {props.done && <p className="chip-line">Done before. Replaying earns half XP.</p>}
        <button type="button" className="btn btn-primary" onClick={props.onStart}>Start</button>
      </section>
    </div>
  )
}
