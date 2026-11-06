import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

function ExpenseCard({ expense, onDelete, onEdit }) {
  return (
    <div className="expense-card">
      <div className="expense-card-left">
        <div className="expense-icon">
          {expense.icon}
        </div>

        <div className="expense-details">
          <h3>{expense.title}</h3>

          <p>{expense.category}</p>

          <span>{formatDate(expense.date)}</span>
        </div>
      </div>

      <div className="expense-card-right">
        <strong>{formatCurrency(expense.amount)}</strong>

        <button
          type="button"
          className="edit-expense-button"
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.title}`}
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={() => onDelete(expense)}
          aria-label={`Delete ${expense.title}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;