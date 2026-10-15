import type { CSSProperties, ReactNode } from 'react'
import { CheckIcon, FlowerIcon, LockIcon, StarIcon, TrophyIcon } from '../common/Icons'
import { flowerOffset, pathShift } from './pathLayout'
import type { NodeInfo } from './sections'

export type NodeState = 'done' | 'unlocked' | 'locked'

interface NodeProps { node: NodeInfo; state: NodeState; index: number; current: boolean; onOpen(): void }

function face(node: NodeInfo, state: NodeState): ReactNode {
  if (state === 'done') return <CheckIcon size={36} />
  if (state === 'locked') return <LockIcon size={30} />
  if (node.kind === 'checkpoint') return <TrophyIcon size={36} />
  if (node.glyph) return <span lang="mr">{node.glyph}</span>
  return <StarIcon size={34} />
}

function nodeClass({ node, state, current }: NodeProps): string {
  return ['node', `node-${state}`, current && 'node-current', node.kind === 'checkpoint' && 'node-cp'].filter(Boolean).join(' ')
}

export function LessonNode(props: NodeProps) {
  const { node, state, index } = props
  const flower = flowerOffset(index)
  return (
    <li className="path-item" style={{ transform: `translateX(${pathShift(index)}px)` }}>
      {props.current && <span className="start-bubble" aria-hidden="true">Start</span>}
      <button type="button" className={nodeClass(props)} disabled={state === 'locked'}
        aria-label={`${node.title}, ${state}`} onClick={props.onOpen}>
        {face(node, state)}
      </button>
      <span className={`node-label${state === 'locked' ? ' is-locked' : ''}`}>{node.title}</span>
      {flower !== null && <FlowerIcon size={44} className="path-flower" style={{ '--fx': `${flower}px` } as CSSProperties} />}
    </li>
  )
}
