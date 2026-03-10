import PageHeader from "../../components/common/PageHeader";
import useAsyncData from "../../hooks/useAsyncData";
import { studentApi } from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

export default function StudentNotificationsPage() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsyncData(
    () => studentApi.notifications(currentUser.id),
    [currentUser.id]
  );
  const notifications = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Notifications" subtitle="Mentor warnings, leave updates, and announcements" />
      {loading && <div className="card">Loading notifications...</div>}
      {error && <div className="card error-text">{error}</div>}
      <div className="card">
        {notifications.length === 0 ? (
          <p className="muted">No notifications found for this student yet.</p>
        ) : (
          <ul className="simple-list">
            {notifications.map((n) => (
              <li key={n._id || n.notificationId}>
                <strong>{(n.type || "info").toUpperCase()}</strong> - {n.message || n.text || n.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
