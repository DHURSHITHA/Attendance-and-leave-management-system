import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import useAsyncData from "../../hooks/useAsyncData";
import { studentApi } from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

export default function StudentPerformancePage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => studentApi.performance(currentUser.id),
    [currentUser.id]
  );
  const maxSgpa = Math.max(...(data?.sgpa || [0]), 10);

  if (loading) return <div className="card">Loading performance...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <PageHeader title="Academic Performance" subtitle="SGPA progression and CGPA summary" />
      <div className="cards-grid">
        <StatCard label="CGPA" value={data.cgpa} />
        <StatCard label="Latest SGPA" value={data.sgpa?.[data.sgpa.length - 1] || 0} />
      </div>
      <div className="card">
        <h3>SGPA Chart</h3>
        <div className="bar-chart">
          {data.semesters?.map((s) => (
            <div key={s.sem} className="bar-item">
              <div
                className="bar"
                style={{ height: `${Math.max(10, Math.round((s.sgpa / maxSgpa) * 140))}px` }}
                title={`${s.sem}: ${s.sgpa}`}
              />
              <span>{s.sem}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3>Semester Breakdown</h3>
        <ul className="simple-list">
          {data.semesters?.map((s) => (
            <li key={s.sem}>{`${s.sem}: ${s.sgpa}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
