function DeleteAllModal({
  expenseCount,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="delete-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="delete-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-modal-icon">
          ⚠️
        </div>

        <div className="delete-modal-content">
          <h2>Delete All Expenses?</h2>

          <p>
            You are about to permanently delete{" "}
            <strong>{expenseCount}</strong>{" "}
            {expenseCount === 1 ? "expense" : "expenses"}.
          </p>

          <p className="delete-modal-warning">
            This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-modal-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-modal-confirm"
            onClick={onConfirm}
          >
            🗑️ Delete All
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAllModal;