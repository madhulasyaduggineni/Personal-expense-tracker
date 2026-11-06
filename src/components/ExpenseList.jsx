import ExpenseCard from "./ExpenseCard";

function ExpenseList({
  expenses,
  onDelete,
  onEdit,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <section className="expense-list-section">
      <div className="section-header">
        <div>
          <h2>Recent Expenses</h2>

          <p>
            {hasActiveFilters
              ? "Showing expenses that match your filters"
              : "Track and manage your daily spending"}
          </p>
        </div>

        <span className="expense-count">
          {expenses.length}{" "}
          {expenses.length === 1 ? "Expense" : "Expenses"}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {hasActiveFilters ? "🔍" : "🧾"}
          </div>

          <h3>
            {hasActiveFilters
              ? "No matching expenses"
              : "No expenses yet"}
          </h3>

          <p>
            {hasActiveFilters
              ? "Try changing your search or filters to find an expense."
              : "Add your first expense using the form to start tracking your spending."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              className="empty-state-button"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ExpenseList;