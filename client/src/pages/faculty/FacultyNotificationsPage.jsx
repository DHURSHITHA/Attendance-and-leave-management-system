import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyNotificationsPage() {
  const { currentUser } = useAuth();
  const [type, setType] = useState("warning");
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");

  const { data, loading, error, setData } = useAsyncData(
    () => facultyApi.notifications(currentUser.id),
    [currentUser.id]
  );
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Notifications" subtitle="Send attendance warnings, reminders, and announcements" />
      <div className="card form-grid">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="warning">Attendance Warning</option>
          <option value="announcement">Announcement</option>
          <option value="reminder">Reminder</option>
        </select>
        <input placeholder="Recipient Student ID" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} />
        <textarea rows="4" placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button
          onClick={async () => {
            const sent = await facultyApi.sendNotification(currentUser.id, {
              recipientRole: "student",
              recipientId,
              type,
              title: type,
              message,
            });
            setData([sent, ...rows]);
            setMessage("");
          }}
        >
          Send Notification
        </button>
      </div>
      {loading && <div className="card">Loading notifications...</div>}
      {error && <div className="card error-text">{error}</div>}
      <div className="card">
        <ul className="simple-list">
          {rows.map((n) => (
            <li key={n._id || n.notificationId}>{`${n.type}: ${n.message}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
