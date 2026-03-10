export default function ProgressBar({ value }) {
  return (
    <div className="progress-wrap">
      <div className="progress-fill" style={{ width: `${value}%` }} />
      <span>{value}%</span>
    </div>
  );
}
