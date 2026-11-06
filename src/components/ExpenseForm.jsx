import { categories } from "../data/categories";

function ExpenseForm({ onAddExpense }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="expense-form" onSubmit={onAddExpense}>
      <div className="form-group">
        <label htmlFor="title">Expense Title</label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="Example: Lunch"
          minLength="2"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>

        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="Example: 250"
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select category
          </option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>

        <input
          id="date"
          name="date"
          type="date"
          defaultValue={today}
          max={today}
          required
        />
      </div>

      <button
        type="submit"
        className="add-expense-button"
      >
        + Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;