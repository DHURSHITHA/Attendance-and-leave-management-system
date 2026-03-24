import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import useAsyncData from "../../hooks/useAsyncData";
import { adminApi } from "../../services/api";
import { useState } from "react";

export default function AdminDashboardHome() {
  const { data, loading, error } = useAsyncData(() => adminApi.dashboard(), []);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am the Admin AI Assistant. How can I help you today?",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  if (loading) return <div className="card">Loading admin dashboard...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  const stats = [
    ["Total Students", data.totals.students],
    ["Total Faculty", data.totals.faculties],
    ["Total Departments", data.totals.departments],
    ["Students Present Today", data.today.studentPresent],
    ["Students Absent Today", data.today.studentAbsent],
    ["Students on Leave", data.today.studentLeave],
    ["Faculty Present Today", data.today.facultyPresent],
    ["Faculty Absent Today", data.today.facultyAbsent],
    ["Avg Attendance %", data.averageAttendancePercent],
  ];

  const suggestions = [
    "Total students",
    "Students absent today",
    "Faculty present today",
    "Departments list",
    "Low attendance cases",
    "System settings",
  ];

  const sendQuestion = async (question) => {
    const text = String(question || "").trim();
    if (!text || chatLoading) return;
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatLoading(true);
    try {
      const response = await adminApi.chatbot(text);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer || "Here is what I found.",
          items: response.items || [],
          more: response.more || 0,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: err?.message || "Failed to answer right now." },
      ]);
    } finally {
      setChatLoading(false);
      setChatInput("");
    }
  };

  return (
    <div className="page-grid">
      <div className="dashboard-hero">
        <div className="hero-panel">
          <PageHeader
            title="Admin System Overview"
            subtitle="Institution-wide attendance, operations and governance view"
          />
          <div className="hero-actions">
            <Link className="pill-btn" to="/admin/attendance-monitor">
              Attendance Monitor
            </Link>
            <Link className="pill-btn ghost" to="/admin/reports">
              Reports
            </Link>
            <Link className="pill-btn ghost" to="/admin/system-settings">
              System Settings
            </Link>
          </div>
        </div>
        <div className="card metric-card">
          <div className="metric-ring" style={{ "--progress": data.averageAttendancePercent }}>
            <span>{data.averageAttendancePercent}%</span>
          </div>
          <div>
            <h3>Average Attendance</h3>
            <p className="muted">All departments, updated for today.</p>
            <div className="pill-row">
              <span className="pill">Students {data.today.studentPresent}</span>
              <span className="pill">Faculty {data.today.facultyPresent}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cards-grid">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <button type="button" className="chat-fab" aria-label="Open admin assistant" onClick={() => setChatOpen(true)}>
        <span className="chat-fab-dot" />
        <span className="chat-fab-text">Assistant</span>
      </button>

      {chatOpen && (
        <div className="chat-drawer">
          <div className="chat-card chat-card-floating">
            <div className="chat-header">
              <div>
                <h3>Admin AI Assistant</h3>
                <p className="muted">Ask questions without opening database screens.</p>
              </div>
              <button type="button" className="chat-close" aria-label="Close" onClick={() => setChatOpen(false)}>
                ×
              </button>
            </div>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={`${msg.role}-${idx}`} className={`chat-message ${msg.role}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    {msg.items?.length > 0 && (
                      <div className="chat-items">
                        {msg.items.map((item) => (
                          <div key={item} className="chat-item">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.more ? <div className="chat-more">+{msg.more} more</div> : null}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message assistant">
                  <div className="chat-bubble">Thinking...</div>
                </div>
              )}
            </div>
            <div className="chat-suggestions chat-suggestions-floating">
              {suggestions.map((label) => (
                <button key={label} type="button" className="chip" onClick={() => sendQuestion(label)}>
                  {label}
                </button>
              ))}
            </div>
            <form
              className="chat-input chat-input-floating"
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion(chatInput);
              }}
            >
              <input
                type="text"
                placeholder="Type message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" disabled={chatLoading || !chatInput.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="section-grid">
        <div className="card">
          <h3>Daily Attendance Trend</h3>
          <div className="mini-chart">
            {data.charts.dailyTrend.map((v) => (
              <div key={v.date} style={{ height: `${v.percent}%` }} title={`${v.date}: ${v.percent}%`} />
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Department-wise Attendance Comparison</h3>
          <div className="bar-chart">
            {data.charts.deptComparison.map((r) => (
              <div key={r.department} className="bar-item">
                <div className="bar" style={{ height: `${r.percent}%` }} />
                <span>{r.department}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <h3>Monthly Attendance Statistics</h3>
          <ul className="simple-list">
            {data.charts.monthlyStats.map((r) => (
              <li key={r.month}>{`${r.month}: ${r.percent}%`}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Operational Highlights</h3>
          <ul className="simple-list">
            <li>Automated biometric sync completed at 09:15.</li>
            <li>5 leave requests pending approval.</li>
            <li>2 departments need attendance backfill.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
