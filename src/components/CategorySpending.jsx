import { formatCurrency } from "../utils/formatCurrency";

function CategorySpending({ categoryTotals }) {
  const categories = Object.entries(categoryTotals).sort(
    (first, second) => second[1] - first[1]
  );

  const highestAmount =
    categories.length > 0
      ? Math.max(...categories.map((category) => category[1]))
      : 0;

  const categoryIcons = {
  Food: "🍔",
  Travel: "🚗",
  Education: "📚",
  Entertainment: "🎬",
  Others: "📦",
};

  const categoryClasses = {
  Food: "category-food",
  Travel: "category-travel",
  Education: "category-education",
  Entertainment: "category-entertainment",
  Others: "category-others",
};

  return (
    <section className="category-spending-section">
      <div className="section-heading">
        <p className="section-label">
          CATEGORY SPENDING
        </p>

        <h2>See where your money goes</h2>

        <p>
          Compare your spending across different
          expense categories.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="category-empty-state">
          <div className="category-empty-icon">
            📊
          </div>

          <h3>No category data yet</h3>

          <p>
            Add some expenses to see your category
            spending breakdown.
          </p>
        </div>
      ) : (
        <div className="category-spending-card">
          {categories.map(([category, amount]) => {
            const percentage =
              highestAmount > 0
                ? (amount / highestAmount) * 100
                : 0;

            return (
              <div
                className={`category-spending-item ${
                  categoryClasses[category] || ""
                }`}
                key={category}
              >
                <div className="category-spending-header">
                  <div className="category-spending-name">
                    <div className="category-spending-icon">
                      {categoryIcons[category] || "💰"}
                    </div>

                    <div>
                      <h3>{category}</h3>

                      <p>
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  </div>

                  <span className="category-percentage">
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="category-progress-track">
                  <div
                    className="category-progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategorySpending;