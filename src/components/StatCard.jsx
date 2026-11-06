function StatCard({ title, value, description, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        <span className="stat-card-title">
          {title}
        </span>
      </div>

      <h3>{value}</h3>

      <p>{description}</p>
    </div>
  );
}

export default StatCard;