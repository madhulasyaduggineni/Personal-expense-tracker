import { formatCurrency } from "../utils/formatCurrency";

function MonthlySpending({ monthlyData }) {
  const highestAmount =
    monthlyData.length > 0
      ? Math.max(
          ...monthlyData.map((month) => month.amount)
        )
      : 0;

  return (
    <section className="monthly-spending-section">
      <div className="section-heading">
        <p className="section-label">
          MONTHLY SPENDING
        </p>

        <h2>Track your spending by month</h2>

        <p>
          See how your total spending changes across
          different months.
        </p>
      </div>

      {monthlyData.length === 0 ? (
        <div className="monthly-empty-state">
          <div className="monthly-empty-icon">
            📅
          </div>

          <h3>No monthly data yet</h3>

          <p>
            Add some expenses to see your monthly spending
            summary.
          </p>
        </div>
      ) : (
        <>
          {/* Monthly Chart */}
          <div className="monthly-chart">
            {monthlyData.map((month) => {
              const percentage =
                highestAmount > 0
                  ? (month.amount / highestAmount) * 100
                  : 0;

              return (
                <div
                  className="monthly-chart-item"
                  key={month.key}
                >
                  <div className="monthly-chart-value">
                    {formatCurrency(month.amount)}
                  </div>

                  <div className="monthly-chart-bar-area">
                    <div
                      className="monthly-chart-bar"
                      style={{
                        height: `${percentage}%`,
                      }}
                      title={`${month.label}: ${formatCurrency(
                        month.amount
                      )}`}
                    ></div>
                  </div>

                  <div className="monthly-chart-label">
                    {month.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Details */}
          <div className="monthly-list">
            {monthlyData.map((month) => (
              <div
                className="monthly-item"
                key={month.key}
              >
                <div className="monthly-item-info">
                  <div className="monthly-icon">
                    📅
                  </div>

                  <div>
                    <h3>{month.label}</h3>

                    <p>
                      {month.count}{" "}
                      {month.count === 1
                        ? "transaction"
                        : "transactions"}
                    </p>
                  </div>
                </div>

                <div className="monthly-item-amount">
                  {formatCurrency(month.amount)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default MonthlySpending;