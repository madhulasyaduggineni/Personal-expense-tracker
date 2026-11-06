import { useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";

function BudgetCard({ totalExpenses, currentMonthExpenses }) {
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem(
      "monthlyBudget"
    );

    return savedBudget ? Number(savedBudget) : 10000;
  });

  const [budgetMode, setBudgetMode] = useState(() => {
    return (
      localStorage.getItem("budgetMode") ||
      "month"
    );
  });

  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget);

  const trackedExpenses =
    budgetMode === "month"
      ? currentMonthExpenses
      : totalExpenses;

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);

    if (
      !Number.isFinite(newBudget) ||
      newBudget <= 0
    ) {
      alert("Please enter a budget greater than ₹0.");
      return;
    }

    setBudget(newBudget);

    localStorage.setItem(
      "monthlyBudget",
      newBudget.toString()
    );

    setIsEditing(false);
  };

  const handleBudgetModeChange = (event) => {
    const newMode = event.target.value;

    setBudgetMode(newMode);

    localStorage.setItem(
      "budgetMode",
      newMode
    );
  };

  const remainingBudget = budget - trackedExpenses;

  const usagePercentage =
    budget > 0
      ? (trackedExpenses / budget) * 100
      : 0;

  const progressPercentage = Math.min(
    usagePercentage,
    100
  );

  const isOverBudget =
    trackedExpenses > budget;

  const isNearLimit =
    !isOverBudget &&
    usagePercentage >= 80;

  return (
    <section className="budget-section">
      <div className="section-heading">
        <p className="section-label">
          {budgetMode === "month"
            ? "MONTHLY BUDGET"
            : "OVERALL BUDGET"}
        </p>

        <h2>
          {budgetMode === "month"
            ? "Keep your monthly spending on track"
            : "Keep your overall spending on track"}
        </h2>

        <p>
          Choose how you want to monitor your budget.
        </p>
      </div>

      <div className="budget-card">
        {/* Budget Mode */}
        <div className="budget-mode-section">
          <label htmlFor="budget-mode">
            Track budget by
          </label>

          <select
            id="budget-mode"
            value={budgetMode}
            onChange={handleBudgetModeChange}
          >
            <option value="month">
              This Month
            </option>

            <option value="all">
              All Expenses
            </option>
          </select>
        </div>

        {/* Budget Header */}
        <div className="budget-card-header">
          <div>
            <span className="budget-title">
              {budgetMode === "month"
                ? "Monthly Budget"
                : "Overall Spending Budget"}
            </span>

            {!isEditing ? (
              <h3>
                {formatCurrency(budget)}
              </h3>
            ) : (
              <div className="budget-edit">
                <span>₹</span>

                <input
                  type="number"
                  value={budgetInput}
                  min="1"
                  step="100"
                  onChange={(event) =>
                    setBudgetInput(
                      event.target.value
                    )
                  }
                  autoFocus
                />
              </div>
            )}
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="edit-budget-button"
              onClick={() => {
                setBudgetInput(budget);
                setIsEditing(true);
              }}
            >
              ✏️ Edit Budget
            </button>
          ) : (
            <div className="budget-edit-actions">
              <button
                type="button"
                className="cancel-budget-button"
                onClick={() =>
                  setIsEditing(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-budget-button"
                onClick={handleSaveBudget}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="budget-progress-section">
          <div className="budget-progress-header">
            <span>
              {formatCurrency(trackedExpenses)} spent
            </span>

            <span>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>

          <div className="budget-progress-track">
            <div
              className={`budget-progress-fill ${
                isOverBudget
                  ? "budget-over"
                  : isNearLimit
                  ? "budget-warning"
                  : ""
              }`}
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Budget Statistics */}
        <div className="budget-stats">
          <div className="budget-stat">
            <span>Spent</span>

            <strong>
              {formatCurrency(trackedExpenses)}
            </strong>
          </div>

          <div className="budget-stat">
            <span>
              {isOverBudget
                ? "Over Budget"
                : "Remaining"}
            </span>

            <strong
              className={
                isOverBudget
                  ? "budget-negative"
                  : "budget-positive"
              }
            >
              {formatCurrency(
                Math.abs(remainingBudget)
              )}
            </strong>
          </div>

          <div className="budget-stat">
            <span>Budget</span>

            <strong>
              {formatCurrency(budget)}
            </strong>
          </div>
        </div>

        {/* Status Message */}
        {isOverBudget && (
          <div className="budget-message budget-danger">
            ⚠️ You have exceeded your{" "}
            {budgetMode === "month"
              ? "monthly"
              : "overall"}{" "}
            budget.
          </div>
        )}

        {!isOverBudget && isNearLimit && (
          <div className="budget-message budget-warning-message">
            ⚠️ You have used more than 80% of your{" "}
            {budgetMode === "month"
              ? "monthly"
              : "overall"}{" "}
            budget.
          </div>
        )}

        {!isOverBudget && !isNearLimit && (
          <div className="budget-message budget-success">
            ✓ Your spending is currently within your{" "}
            {budgetMode === "month"
              ? "monthly"
              : "overall"}{" "}
            budget.
          </div>
        )}
      </div>
    </section>
  );
}

export default BudgetCard;