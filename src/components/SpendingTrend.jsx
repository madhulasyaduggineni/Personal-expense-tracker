import { formatCurrency } from "../utils/formatCurrency";

function SpendingTrend({ monthlyData }) {
  if (monthlyData.length === 0) {
    return (
      <section className="spending-trend-section">
        <div className="section-heading">
          <p className="section-label">
            SPENDING TREND
          </p>

          <h2>Track your spending over time</h2>

          <p>
            See how your expenses change from month to
            month.
          </p>
        </div>

        <div className="spending-trend-empty">
          <div className="spending-trend-empty-icon">
            📈
          </div>

          <h3>No spending trend yet</h3>

          <p>
            Add expenses from different dates to see your
            spending trend.
          </p>
        </div>
      </section>
    );
  }

  const chartData = [...monthlyData]
    .slice(0, 6)
    .reverse();

  const highestAmount = Math.max(
    ...chartData.map((month) => month.amount)
  );

  return (
    <section className="spending-trend-section">
      <div className="section-heading">
        <p className="section-label">
          SPENDING TREND
        </p>

        <h2>Track your spending over time</h2>

        <p>
          See how your expenses change from month to
          month.
        </p>
      </div>

      <div className="spending-trend-card">
        <div className="spending-trend-chart">
          {chartData.map((month) => {
            const percentage =
              highestAmount > 0
                ? (month.amount / highestAmount) * 100
                : 0;

            return (
              <div
                className="trend-column"
                key={month.key}
              >
                <div className="trend-value">
                  {formatCurrency(month.amount)}
                </div>

                <div className="trend-bar-area">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${Math.max(
                        percentage,
                        8
                      )}%`,
                    }}
                    title={`${month.label}: ${formatCurrency(
                      month.amount
                    )}`}
                  ></div>
                </div>

                <div className="trend-label">
                  {month.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="trend-summary">
          <div>
            <span>Highest Month</span>

            <strong>
              {
                chartData.reduce(
                  (highest, month) =>
                    month.amount > highest.amount
                      ? month
                      : highest,
                  chartData[0]
                ).label
              }
            </strong>
          </div>

          <div>
            <span>Highest Spending</span>

            <strong>
              {formatCurrency(highestAmount)}
            </strong>
          </div>

          <div>
            <span>Months Shown</span>

            <strong>{chartData.length}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpendingTrend;