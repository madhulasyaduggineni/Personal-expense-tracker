import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

function ExpenseInsights({ expenses }) {
  if (expenses.length === 0) {
    return (
      <section className="insights-section">
        <div className="section-heading">
          <p className="section-label">
            EXPENSE INSIGHTS
          </p>

          <h2>Understand your spending habits</h2>

          <p>
            Add some expenses to start seeing useful
            insights about your spending.
          </p>
        </div>

        <div className="insights-empty">
          <div className="insights-empty-icon">
            💡
          </div>

          <h3>No insights available yet</h3>

          <p>
            Once you add expenses, this section will
            automatically analyze your spending.
          </p>
        </div>
      </section>
    );
  }

  // Calculate category totals
  const categoryTotals = expenses.reduce(
    (categories, expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }

      categories[expense.category] += expense.amount;

      return categories;
    },
    {}
  );

  // Find top spending category
  const topCategory = Object.entries(
    categoryTotals
  ).sort(
    (first, second) => second[1] - first[1]
  )[0];

  // Find largest expense
  const largestExpense = [...expenses].sort(
    (first, second) =>
      second.amount - first.amount
  )[0];

  // Find most recent expense
  const mostRecentExpense = [...expenses].sort(
    (first, second) =>
      new Date(second.date) - new Date(first.date)
  )[0];

  // Calculate date range
  const dates = expenses.map(
    (expense) =>
      new Date(`${expense.date}T00:00:00`)
  );

  const earliestDate = new Date(
    Math.min(...dates)
  );

  const latestDate = new Date(
    Math.max(...dates)
  );

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const numberOfDays =
    Math.floor(
      (latestDate - earliestDate) /
        millisecondsPerDay
    ) + 1;

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );

  const averageDailySpending =
    totalExpenses / numberOfDays;

  // Create an insight message
  const topCategoryPercentage =
    totalExpenses > 0
      ? (topCategory[1] / totalExpenses) * 100
      : 0;

  let insightMessage = "";

  if (topCategoryPercentage >= 50) {
    insightMessage = `Most of your spending is going toward ${topCategory[0]}. It accounts for ${topCategoryPercentage.toFixed(
      1
    )}% of your total spending.`;
  } else if (topCategoryPercentage >= 30) {
    insightMessage = `${topCategory[0]} is currently your largest spending category at ${topCategoryPercentage.toFixed(
      1
    )}% of your total spending.`;
  } else {
    insightMessage = `Your spending is distributed across multiple categories, with ${topCategory[0]} being the largest at ${topCategoryPercentage.toFixed(
      1
    )}%.`;
  }

  return (
    <section className="insights-section">
      <div className="section-heading">
        <p className="section-label">
          EXPENSE INSIGHTS
        </p>

        <h2>Understand your spending habits</h2>

        <p>
          Automatically generated insights from your
          recorded expenses.
        </p>
      </div>

      <div className="insights-grid">
        {/* Top Category */}
        <div className="insight-card">
          <div className="insight-icon">
            🏆
          </div>

          <div className="insight-content">
            <span>Top Spending Category</span>

            <h3>{topCategory[0]}</h3>

            <p>
              {formatCurrency(topCategory[1])} spent
            </p>
          </div>
        </div>

        {/* Largest Expense */}
        <div className="insight-card">
          <div className="insight-icon">
            💳
          </div>

          <div className="insight-content">
            <span>Largest Expense</span>

            <h3>{largestExpense.title}</h3>

            <p>
              {formatCurrency(
                largestExpense.amount
              )}
            </p>
          </div>
        </div>

        {/* Most Recent Expense */}
        <div className="insight-card">
          <div className="insight-icon">
            📅
          </div>

          <div className="insight-content">
            <span>Most Recent Expense</span>

            <h3>{mostRecentExpense.title}</h3>

            <p>
              {formatDate(
                mostRecentExpense.date
              )}
            </p>
          </div>
        </div>

        {/* Average Daily Spending */}
        <div className="insight-card">
          <div className="insight-icon">
            📊
          </div>

          <div className="insight-content">
            <span>Average Daily Spending</span>

            <h3>
              {formatCurrency(
                averageDailySpending
              )}
            </h3>

            <p>
              Based on {numberOfDays}{" "}
              {numberOfDays === 1
                ? "day"
                : "days"}{" "}
              of data
            </p>
          </div>
        </div>
      </div>

      {/* Insight Message */}
      <div className="insight-message">
        <div className="insight-message-icon">
          💡
        </div>

        <div>
          <strong>Your Spending Insight</strong>

          <p>{insightMessage}</p>
        </div>
      </div>
    </section>
  );
}

export default ExpenseInsights;