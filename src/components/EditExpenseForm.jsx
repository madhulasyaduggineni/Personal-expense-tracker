import { categories } from "../data/categories";

function EditExpenseForm({ expense, onSave, onCancel }) {
  if (!expense) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = formData.get("title").trim();
    const amount = Number(formData.get("amount"));
    const category = formData.get("category");
    const date = formData.get("date");

    const categoryIcons = {
      Food: "🍔",
      Travel: "🚗",
      Education: "📚",
      Entertainment: "🎬",
    };

    const updatedExpense = {
      ...expense,
      title,
      amount,
      category,
      date,
      icon: categoryIcons[category],
    };

    onSave(updatedExpense);
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-modal">
        <div className="edit-form-header">
          <div>
            <p className="section-label">EDIT EXPENSE</p>

            <h2>Update Expense</h2>

            <p>
              Modify the details of your expense and save the changes.
            </p>
          </div>

          <button
            type="button"
            className="close-edit-button"
            onClick={onCancel}
            aria-label="Close edit form"
          >
            ✕
          </button>
        </div>

        <form
          className="edit-expense-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="edit-title">Expense Title</label>

            <input
              id="edit-title"
              name="title"
              type="text"
              defaultValue={expense.title}
              placeholder="Example: Lunch"
              minLength="2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-amount">Amount</label>

            <input
              id="edit-amount"
              name="amount"
              type="number"
              defaultValue={expense.amount}
              placeholder="Example: 250"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-category">Category</label>

            <select
              id="edit-category"
              name="category"
              defaultValue={expense.category}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-date">Date</label>

            <input
              id="edit-date"
              name="date"
              type="date"
              defaultValue={expense.date}
              max={today}
              required
            />
          </div>

          <div className="edit-form-actions">
            <button
              type="button"
              className="cancel-edit-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-edit-button"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseForm;