import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

export default function ParentCalendarPage() {
  const events = [
    ["2026-03-25", "Parent Teacher Meeting", "10:30 AM", "Auditorium"],
    ["2026-03-28", "Semester Quiz - Data Structures", "09:00 AM", "Block C"],
    ["2026-04-02", "Industrial Visit Briefing", "12:30 PM", "Seminar Hall"],
    ["2026-04-05", "Fee Due Reminder", "All Day", "Online Portal"],
  ];

  const assessments = [
    "April 8: Operating Systems lab viva",
    "April 12: Mid-term evaluation kickoff",
    "April 20: Mini project presentation",
  ];

  const timetable = [
    "09:00 - 10:00 | Data Structures",
    "10:15 - 11:15 | Operating Systems",
    "11:30 - 12:30 | Electronics Lab",
    "02:00 - 03:00 | Technical Communication",
  ];

  return (
    <div className="page-grid">
      <PageHeader
        title="Academic Calendar"
        subtitle="Upcoming events, assessments, and daily timetable snapshot"
      />
      <DataTable columns={["Date", "Event", "Time", "Location"]} rows={events} />
      <div className="card">
        <h3>Upcoming Assessments</h3>
        <ul className="simple-list">
          {assessments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Today's Timetable</h3>
        <ul className="simple-list">
          {timetable.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
