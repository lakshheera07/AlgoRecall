function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="dialog-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
