export default function StatCard({ label, value, hint }) {
  return (
    <div className="card stat-card">
      <div className="muted">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
