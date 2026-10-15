interface ConfirmProps {
  title: string
  body: string
  confirmLabel: string
  cancelLabel: string
  onConfirm(): void
  onCancel(): void
}

export function ConfirmDialog(p: ConfirmProps) {
  return (
    <div className="overlay" role="presentation">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title">
        <h2 id="dlg-title">{p.title}</h2>
        <p>{p.body}</p>
        <button type="button" className="btn btn-primary" onClick={p.onCancel}>{p.cancelLabel}</button>
        <button type="button" className="btn btn-ghost" onClick={p.onConfirm}>{p.confirmLabel}</button>
      </div>
    </div>
  )
}
