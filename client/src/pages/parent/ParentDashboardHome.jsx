import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import ProgressBar from "../../components/common/ProgressBar";

const trend = [78, 84, 88, 91, 86, 93, 95];

export default function ParentDashboardHome() {
  const child = {
    name: "Aarav Sharma",
    classLabel: "CSE | Semester 5",
    roll: "STU014",
    mentor: "Dr. Priya Nair",
    photo: "https://i.pravatar.cc/120?img=52",
  };

  const alerts = [
    "Attendance dipped below 92% on March 12",
    "PTM scheduled for March 25, 10:30 AM",
    "New circular: Semester 5 lab safety briefing",
  ];

  const messages = [
    "Mentor updated attendance remarks for March 20",
    "New homework reminder: Data Structures assignment",
    "School bus route timing updated for next week",
  ];

  return (
    <div className="page-grid">
      <PageHeader
        title="Parent Dashboard"
        subtitle="Stay connected to your child's attendance, academics, and school updates"
      />
      <div className="cards-grid">
        <div className="card profile-card">
          <img src={child.photo} alt="child" />
          <h3>{child.name}</h3>
          <p>{child.classLabel}</p>
          <span>Roll: {child.roll}</span>
          <span>Mentor: {child.mentor}</span>
        </div>
        <StatCard label="Attendance %" value="92%" hint="Target 90%" />
        <StatCard label="Present Days" value="52" hint="Last 60 working days" />
        <StatCard label="Absent Days" value="4" hint="Includes 1 medical leave" />
        <StatCard label="Late Arrivals" value="3" hint="Last 30 days" />
        <StatCard label="Next Fee Due" value="INR 4,500" hint="Due by April 5" />
      </div>

      <div className="card">
        <h3>Attendance Health</h3>
        <ProgressBar value={92} />
        <p className="muted">On track to maintain the minimum requirement this term.</p>
      </div>

      <div className="card">
        <h3>Weekly Attendance Trend</h3>
        <div className="mini-chart">
          {trend.map((v, idx) => (
            <div key={`${v}-${idx}`} style={{ height: `${v}%` }} title={`Week ${idx + 1}: ${v}%`} />
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Action Required</h3>
        <ul className="simple-list">
          {alerts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Messages From School</h3>
        <ul className="simple-list">
          {messages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
