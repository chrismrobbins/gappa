import { CheckIcon, LockIcon, StarIcon } from '../common/Icons'
import type { NodeInfo } from './sections'

export type NodeState = 'done' | 'unlocked' | 'locked'

export function LessonNode(props: { node: NodeInfo; state: NodeState; index: number; onOpen(): void }) {
  const { node, state, index } = props
  const shift = ((index % 4) - 1.5) * 18
  const icon = state === 'done' ? <CheckIcon size={30} /> : state === 'locked' ? <LockIcon size={26} /> : <StarIcon size={28} />
  return (
    <li className="path-item" style={{ transform: `translateX(${shift}px)` }}>
      <button type="button" className={`node node-${state}${node.kind === 'checkpoint' ? ' node-cp' : ''}`}
        disabled={state === 'locked'} aria-label={`${node.title}, ${state}`} onClick={props.onOpen}>
        {icon}
      </button>
      <span className="node-label">{node.title}</span>
    </li>
  )
}
