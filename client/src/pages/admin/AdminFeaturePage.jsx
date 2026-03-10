import PageHeader from "../../components/common/PageHeader";

export default function AdminFeaturePage({ title, subtitle, features = [], samples = [] }) {
  return (
    <div className="page-grid">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="card">
        <h3>Available Features</h3>
        <ul className="simple-list">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      {samples.length > 0 && (
        <div className="card">
          <h3>Example Data / Configuration</h3>
          <ul className="simple-list">
            {samples.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

