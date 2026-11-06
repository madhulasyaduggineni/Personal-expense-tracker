import { formatCurrency } from "../utils/formatCurrency";

function SummaryCard({ title, amount, icon }) {
  return (
    <div className="summary-card">
      <div className="summary-card-icon">{icon}</div>

      <div className="summary-card-content">
        <p>{title}</p>
        <h2>{formatCurrency(amount)}</h2>
      </div>
    </div>
  );
}

export default SummaryCard;