import PageHeader from "../../components/common/PageHeader";

export default function ParentNotificationsPage() {
  const notifications = [
    "Attendance warning resolved after medical leave approval",
    "New announcement: Career guidance session on March 30",
    "Reminder: Submit lab project synopsis by April 2",
    "Transport update: Route 4 pickup time changed to 07:35 AM",
  ];

  return (
    <div className="page-grid">
      <PageHeader title="Notifications" subtitle="All updates related to your child" />
      <div className="card">
        <h3>Latest Updates</h3>
        <ul className="simple-list">
          {notifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
