
import { useEffect, useMemo, useState } from "react";
import "./App.css";

import SummaryCard from "./components/SummaryCard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpenseForm from "./components/EditExpenseForm";
import DeleteAllModal from "./components/DeleteAllModal";
import StatCard from "./components/StatCard";
import MonthlySpending from "./components/MonthlySpending";
import SpendingTrend from "./components/SpendingTrend";
import BudgetCard from "./components/BudgetCard";
import ExpenseInsights from "./components/ExpenseInsights";
import CategorySpending from "./components/CategorySpending";

const API_URL = "http://localhost:5000/api/expenses";
const MIGRATION_KEY = "expensesMigratedToMongoDB";

function normalizeExpense(expense) {
  return {
    ...expense,
    id: expense._id || expense.id,
    date: expense.date
      ? new Date(expense.date).toISOString().slice(0, 10)
      : "",
  };
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOption, setSortOption] =
    useState("Newest First");

  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] =
    useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Load expenses from MongoDB and migrate old localStorage data once.
  useEffect(() => {
    let isMounted = true;

    const loadExpenses = async () => {
      try {
        setApiError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not fetch expenses from the server.");
        }

        let mongoExpenses = await response.json();

        // One-time migration of existing browser expenses.
        const alreadyMigrated =
          localStorage.getItem(MIGRATION_KEY) === "true";

        const savedExpenses = JSON.parse(
          localStorage.getItem("expenses") || "[]"
        );

        if (!alreadyMigrated && savedExpenses.length > 0) {
          // Set the marker before requests to avoid duplicate migration.
          localStorage.setItem(MIGRATION_KEY, "true");

          try {
            for (const expense of savedExpenses) {
              const { title, amount, category, date, icon } = expense;

              const migrationResponse = await fetch(API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title,
                  amount,
                  category,
                  date,
                  icon,
                }),
              });

              if (!migrationResponse.ok) {
                throw new Error("Could not migrate an old expense.");
              }
            }

            const refreshedResponse = await fetch(API_URL);

            if (!refreshedResponse.ok) {
              throw new Error("Could not reload migrated expenses.");
            }

            mongoExpenses = await refreshedResponse.json();
          } catch (migrationError) {
            localStorage.removeItem(MIGRATION_KEY);
            throw migrationError;
          }
        }

        if (isMounted) {
          setExpenses(mongoExpenses.map(normalizeExpense));
        }
      } catch (error) {
        console.error("Loading expenses error:", error);
        if (isMounted) {
          setApiError(
            "Unable to connect to the backend. Make sure your MongoDB server and backend are running."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save dark mode preference in localStorage.
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Add expense to MongoDB.
  const handleAddExpense = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title").trim();
    const amount = Number(formData.get("amount"));
    const category = formData.get("category");
    const date = formData.get("date");

    const categoryIcons = {
      Food: "🍔",
      Travel: "🚗",
      Education: "📚",
      Entertainment: "🎬",
      Others: "📦",
    };

    const newExpense = {
      title,
      amount,
      category,
      date,
      icon: categoryIcons[category] || "📦",
    };

    try {
      setApiError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      const savedExpense = await response.json();

      if (!response.ok) {
        throw new Error(savedExpense.message || "Could not add expense.");
      }

      setExpenses((currentExpenses) => [
        normalizeExpense(savedExpense),
        ...currentExpenses,
      ]);

      form.reset();
    } catch (error) {
      console.error("Add expense error:", error);
      setApiError(error.message || "Could not save expense.");
    }
  };

  // Delete one expense from MongoDB.
  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/${expenseToDelete.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete expense.");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense.id !== expenseToDelete.id
        )
      );

      setExpenseToDelete(null);
    } catch (error) {
      console.error("Delete expense error:", error);
      setApiError(error.message || "Could not delete expense.");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  // Update expense in MongoDB.
  const handleSaveEditedExpense = async (updatedExpense) => {
    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/${updatedExpense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedExpense.title,
            amount: updatedExpense.amount,
            category: updatedExpense.category,
            date: updatedExpense.date,
            icon: updatedExpense.icon,
          }),
        }
      );

      const savedExpense = await response.json();

      if (!response.ok) {
        throw new Error(savedExpense.message || "Could not update expense.");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === updatedExpense.id
            ? normalizeExpense(savedExpense)
            : expense
        )
      );

      setEditingExpense(null);
    } catch (error) {
      console.error("Update expense error:", error);
      setApiError(error.message || "Could not update expense.");
    }
  };

  // Delete all expenses from MongoDB.
  const handleClearAllExpenses = async () => {
    try {
      setApiError("");

      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete expenses.");
      }

      setExpenses([]);
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Clear expenses error:", error);
      setApiError(error.message || "Could not clear expenses.");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setDateFilter("");
    setSortOption("Newest First");
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert("There are no expenses to export.");
      return;
    }

    const headers = ["Title", "Amount", "Category", "Date"];

    const rows = expenses.map((expense) => [
      `"${expense.title.replace(/"/g, '""')}"`,
      expense.amount,
      `"${expense.category}"`,
      expense.date,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "expenses.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const filteredExpenses = useMemo(() => {
    const filtered = expenses.filter((expense) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" ||
        expense.category === categoryFilter;

      const matchesDate =
        !dateFilter || expense.date === dateFilter;

      return matchesSearch && matchesCategory && matchesDate;
    });

    return [...filtered].sort((first, second) => {
      if (sortOption === "Newest First") {
        return new Date(second.date) - new Date(first.date);
      }

      if (sortOption === "Oldest First") {
        return new Date(first.date) - new Date(second.date);
      }

      if (sortOption === "Highest Amount") {
        return second.amount - first.amount;
      }

      if (sortOption === "Lowest Amount") {
        return first.amount - second.amount;
      }

      return 0;
    });
  }, [
    expenses,
    searchTerm,
    categoryFilter,
    dateFilter,
    sortOption,
  ]);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const categoryTotals = useMemo(() => {
    return expenses.reduce((totals, expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }

      totals[expense.category] += expense.amount;
      return totals;
    }, {});
  }, [expenses]);

  const foodTotal = categoryTotals.Food || 0;
  const travelTotal = categoryTotals.Travel || 0;
  const educationTotal = categoryTotals.Education || 0;
  const entertainmentTotal = categoryTotals.Entertainment || 0;
  const othersTotal = categoryTotals.Others || 0;

  const averageExpense =
    expenses.length > 0
      ? totalExpenses / expenses.length
      : 0;

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  const currentDate = new Date();

  const currentMonthExpenses = expenses.reduce(
    (total, expense) => {
      const expenseDate = new Date(`${expense.date}T00:00:00`);

      if (
        expenseDate.getFullYear() === currentDate.getFullYear() &&
        expenseDate.getMonth() === currentDate.getMonth()
      ) {
        return total + expense.amount;
      }

      return total;
    },
    0
  );

  const monthlyData = useMemo(() => {
    const monthlyTotals = {};

    expenses.forEach((expense) => {
      const date = new Date(`${expense.date}T00:00:00`);
      const year = date.getFullYear();
      const month = date.getMonth();

      const key = `${year}-${String(month + 1).padStart(2, "0")}`;

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = {
          key,
          year,
          month,
          amount: 0,
          count: 0,
        };
      }

      monthlyTotals[key].amount += expense.amount;
      monthlyTotals[key].count += 1;
    });

    return Object.values(monthlyTotals)
      .sort((first, second) => {
        if (first.year !== second.year) {
          return second.year - first.year;
        }

        return second.month - first.month;
      })
      .map((month) => {
        const label = new Intl.DateTimeFormat("en-IN", {
          month: "short",
          year: "numeric",
        }).format(new Date(month.year, month.month, 1));

        return {
          ...month,
          label,
        };
      });
  }, [expenses]);

  const hasActiveFilters =
    searchTerm !== "" ||
    categoryFilter !== "All Categories" ||
    dateFilter !== "" ||
    sortOption !== "Newest First";

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <p className="eyebrow">PERSONAL FINANCE</p>

            <h1>
              Personal Expense
              <br />
              Visualization Board
            </h1>

            <p className="header-description">
              Track your expenses, understand your
              spending habits, and make better
              financial decisions.
            </p>
          </div>

          <button
            type="button"
            className="dark-mode-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        {apiError && (
          <div className="api-error-message" role="alert">
            {apiError}
          </div>
        )}

        {isLoading && (
          <p className="loading-message">
            Loading your expenses from MongoDB...
          </p>
        )}

        {/* SUMMARY */}
        <section className="summary-section">
          <div className="section-heading">
            <p className="section-label">OVERVIEW</p>
            <h2>Your spending at a glance</h2>
            <p>
              A quick summary of where your money is going.
            </p>
          </div>

          <div className="summary-grid">
            <SummaryCard title="Total Expenses" amount={totalExpenses} icon="💰" />
            <SummaryCard title="Food" amount={foodTotal} icon="🍔" />
            <SummaryCard title="Travel" amount={travelTotal} icon="🚗" />
            <SummaryCard title="Education" amount={educationTotal} icon="📚" />
            <SummaryCard title="Entertainment" amount={entertainmentTotal} icon="🎬" />
            <SummaryCard title="Others" amount={othersTotal} icon="📦" />
          </div>
        </section>

        {/* ADD EXPENSE */}
        <section className="add-expense-section">
          <div className="section-heading">
            <p className="section-label">ADD EXPENSE</p>
            <h2>Record a new expense</h2>
            <p>
              Add your spending data to keep your dashboard up to date.
            </p>
          </div>

          <ExpenseForm onAddExpense={handleAddExpense} />
        </section>

        {/* STATISTICS */}
        <section className="statistics-section">
          <div className="section-heading">
            <p className="section-label">STATISTICS</p>
            <h2>Understand your numbers</h2>
            <p>
              Simple statistics from your expense records.
            </p>
          </div>

          <div className="statistics-grid">
            <StatCard
              title="Average Expense"
              value={`₹${averageExpense.toFixed(2)}`}
              description="Average amount per transaction"
              icon="📊"
            />

            <StatCard
              title="Transactions"
              value={expenses.length}
              description="Total recorded expenses"
              icon="🧾"
            />

            <StatCard
              title="Highest Expense"
              value={`₹${highestExpense.toFixed(2)}`}
              description="Largest recorded transaction"
              icon="💳"
            />
          </div>
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="filters-section">
          <div className="section-heading">
            <p className="section-label">SEARCH & FILTERS</p>
            <h2>Find your expenses</h2>
            <p>
              Search, filter, and sort your expense records.
            </p>
          </div>

          <div className="filters-card">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="category-filter">Category</label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                <option>All Categories</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Others</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-filter">Date</label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Sort By</label>
              <select
                id="sort-filter"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Highest Amount</option>
                <option>Lowest Amount</option>
              </select>
            </div>
          </div>
        </section>

        {/* EXPENSE LIST */}
        <ExpenseList
          expenses={filteredExpenses}
          onDelete={setExpenseToDelete}
          onEdit={handleEditExpense}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="expense-actions">
          <button
            type="button"
            className="export-button"
            onClick={handleExportCSV}
          >
            📥 Export CSV
          </button>

          <button
            type="button"
            className="clear-all-button"
            onClick={() => setShowDeleteAllModal(true)}
            disabled={expenses.length === 0}
          >
            🗑️ Clear All Expenses
          </button>
        </div>

        {/* MONTHLY SPENDING */}
        <MonthlySpending monthlyData={monthlyData} />

        {/* SPENDING TREND */}
        <SpendingTrend monthlyData={monthlyData} />

        {/* CATEGORY SPENDING */}
        <CategorySpending categoryTotals={categoryTotals} />

        {/* BUDGET */}
        <BudgetCard
          totalExpenses={totalExpenses}
          currentMonthExpenses={currentMonthExpenses}
        />

        {/* INSIGHTS */}
        <ExpenseInsights expenses={expenses} />
      </main>

      {/* EDIT EXPENSE MODAL */}
      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          onSave={handleSaveEditedExpense}
          onCancel={() => setEditingExpense(null)}
        />
      )}

      {/* SINGLE DELETE MODAL */}
      {expenseToDelete && (
        <div
          className="delete-modal-overlay"
          onClick={() => setExpenseToDelete(null)}
        >
          <div
            className="delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">⚠️</div>

            <div className="delete-modal-content">
              <h2>Delete Expense?</h2>
              <p>
                You are about to permanently delete{" "}
                <strong>{expenseToDelete.title}</strong>.
              </p>
              <p className="delete-modal-warning">
                This action cannot be undone.
              </p>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setExpenseToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleDeleteExpense}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ALL MODAL */}
      {showDeleteAllModal && (
        <DeleteAllModal
          expenseCount={expenses.length}
          onConfirm={handleClearAllExpenses}
          onCancel={() => setShowDeleteAllModal(false)}
        />
      )}
    </div>
  );
}

export default App;
