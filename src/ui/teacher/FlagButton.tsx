import { useState } from 'react'
import { fixInput } from '../../lib/reviewDraft'
import type { ReviewItem } from '../../lib/reviewItems'
import { CloseIcon, FlagIcon } from '../common/Icons'
import { FixForm } from './FixForm'
import { useMyReviews } from './useMyReviews'

function FlagSheet({ item, onClose }: { item: ReviewItem; onClose(): void }) {
  const { byKey, loaded, save } = useMyReviews()
  return (
    <div className="overlay overlay-sheet" role="presentation" onClick={onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="flag-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn sheet-close" aria-label="Close" onClick={onClose}><CloseIcon size={20} /></button>
        <h2 id="flag-title">Flag this line</h2>
        <p className="native" lang="mr">{item.target}</p>
        <p className="rom">{item.rom}</p>
        {loaded && (
          <FixForm target={item.target} saved={byKey.get(item.key)} onCancel={onClose}
            onSave={async (d) => { const ok = await save(fixInput(item, d)); if (ok) onClose(); return ok }} />
        )}
      </section>
    </div>
  )
}

/** A small flag in the lesson header for teachers: opens the fix form for the current line. */
export function FlagButton({ item }: { item: ReviewItem }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="icon-btn" aria-label="Flag this line" onClick={() => setOpen(true)}>
        <FlagIcon size={22} />
      </button>
      {open && <FlagSheet item={item} onClose={() => setOpen(false)} />}
    </>
  )
}
