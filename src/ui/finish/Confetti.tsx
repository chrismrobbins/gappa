const PETALS = 16

/** A small burst of marigold petals; pure CSS, hidden when motion is reduced. */
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: PETALS }, (_, i) => (
        <span key={i} className="petal" style={{ '--i': i, '--n': PETALS } as React.CSSProperties} />
      ))}
    </div>
  )
}
