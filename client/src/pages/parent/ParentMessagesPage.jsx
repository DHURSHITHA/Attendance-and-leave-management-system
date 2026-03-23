import PageHeader from "../../components/common/PageHeader";

export default function ParentMessagesPage() {
  const threads = [
    {
      from: "Dr. Priya Nair",
      subject: "Attendance follow-up for March",
      time: "Today 09:12 AM",
      preview: "Please review the updated attendance remarks for March 20.",
    },
    {
      from: "CSE Department",
      subject: "Lab safety circular",
      time: "Yesterday 05:40 PM",
      preview: "Reminder: Students must wear lab coats for upcoming sessions.",
    },
    {
      from: "Transport Office",
      subject: "Route timing update",
      time: "Mar 19, 03:15 PM",
      preview: "Bus 4 will depart 10 minutes earlier starting next week.",
    },
  ];

  return (
    <div className="page-grid">
      <PageHeader title="Messages" subtitle="Conversations with mentors and school staff" />
      <div className="card">
        <h3>Inbox</h3>
        <ul className="simple-list">
          {threads.map((t) => (
            <li key={t.subject}>
              <strong>{t.from}</strong> - {t.subject}
              <div className="muted">{t.preview}</div>
              <div className="muted">{t.time}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Send a Message</h3>
        <p className="muted">UI only. Messaging will be wired to backend later.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="form-grid"
        >
          <input placeholder="Subject" type="text" />
          <select defaultValue="mentor">
            <option value="mentor">Mentor</option>
            <option value="department">Department Office</option>
            <option value="transport">Transport Office</option>
          </select>
          <textarea placeholder="Write your message" rows={4} />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
