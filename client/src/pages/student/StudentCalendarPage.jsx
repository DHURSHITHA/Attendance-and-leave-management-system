import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import useAsyncData from "../../hooks/useAsyncData";
import { studentApi } from "../../services/api";

const statusClass = {
  present: "present",
  half: "half",
  absent: "absent",
  leave: "leave",
};
const statusPriority = {
  present: 1,
  half: 2,
  leave: 3,
  absent: 4,
};
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const normalizeDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

export default function StudentCalendarPage() {
  const { currentUser } = useAuth();
  const today = new Date();
  const currentYear = today.getFullYear();
  const todayMonthIndex = today.getMonth();
  const todayDate = today.getDate();
  const { data, loading, error } = useAsyncData(() => studentApi.calendar(currentUser.id), [currentUser.id]);
  const allDays = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .map((d) => {
          const date = normalizeDate(d.date);
          if (!date) return null;
          return { ...d, date };
        })
        .filter(Boolean),
    [data]
  );
  const daysThisYear = useMemo(
    () => allDays.filter((d) => d.date?.startsWith(`${currentYear}-`)),
    [allDays, currentYear]
  );
  const statusByDate = useMemo(() => {
    const byDate = new Map();
    for (const row of daysThisYear) {
      const raw = row.finalStatus ?? row.status;
      const normalized = statusClass[String(raw || "").toLowerCase()] || null;
      if (!normalized) continue;
      const current = byDate.get(row.date);
      if (!current || statusPriority[normalized] > statusPriority[current]) {
        byDate.set(row.date, normalized);
      }
    }
    return byDate;
  }, [daysThisYear]);
  const yearMonths = useMemo(() => {
    const months = [];
    const cutoff = new Date(currentYear, todayMonthIndex, todayDate);
    for (let monthIndex = 0; monthIndex <= todayMonthIndex; monthIndex += 1) {
      const month = monthIndex + 1;
      const ym = `${currentYear}-${String(month).padStart(2, "0")}`;
      const firstDay = new Date(currentYear, monthIndex, 1);
      const totalDays = new Date(currentYear, month, 0).getDate();
      const leading = Array.from({ length: firstDay.getDay() }, (_, idx) => ({ empty: true, key: `lead-${idx}` }));
      const daily = Array.from({ length: totalDays }, (_, idx) => {
        const day = idx + 1;
        const date = `${ym}-${String(day).padStart(2, "0")}`;
        const dateObj = new Date(currentYear, monthIndex, day);
        if (dateObj > cutoff) return { empty: true, key: `future-${day}` };
        let status = statusByDate.get(date) || null;
        if (dateObj.getDay() === 0) status = "leave";
        return { empty: false, day, date, status };
      });
      const cells = [...leading, ...daily];
      while (cells.length % 7 !== 0) cells.push({ empty: true, key: `trail-${cells.length}` });
      months.push({ key: ym, label: monthNames[monthIndex], cells });
    }
    return months;
  }, [currentYear, todayDate, todayMonthIndex, statusByDate]);

  const [selectedDate, setSelectedDate] = useState(null);
  const { data: logsResp } = useAsyncData(
    () =>
      selectedDate
        ? studentApi.biometricLogs(currentUser.id, { month: selectedDate.slice(0, 7), q: selectedDate, page: 1, limit: 20 })
        : Promise.resolve({ data: [] }),
    [currentUser.id, selectedDate]
  );

  const selectedLogs = useMemo(() => (logsResp?.data || []).filter((l) => l.date === selectedDate), [logsResp, selectedDate]);

  if (loading) return <div className="card">Loading calendar...</div>;
  if (error) return <div className="card error-text">{error}</div>;

  return (
    <div className="page-grid">
      <PageHeader
        title="Attendance Calendar"
        subtitle={`${currentYear} year view up to today | Student: ${currentUser.id} | Records: ${daysThisYear.length}`}
      />
      <div className="card year-calendar">
        <div className="year-calendar-grid">
          {yearMonths.map((month) => (
            <section key={month.key} className="mini-month">
              <h4>{month.label}</h4>
              <div className="mini-weekdays">
                {weekdayLabels.map((w) => (
                  <span key={`${month.key}-${w}`}>{w[0]}</span>
                ))}
              </div>
              <div className="mini-days">
                {month.cells.map((cell, idx) =>
                  !cell.empty ? (
                    <div
                      key={cell.date || `${month.key}-${idx}`}
                      role="button"
                      tabIndex={0}
                      className={`mini-day ${selectedDate === cell.date ? "selected" : ""}`}
                      onClick={() => setSelectedDate(cell.date)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedDate(cell.date);
                      }}
                    >
                      <span>{cell.day}</span>
                      {cell.status && <i className={`day-dot ${cell.status}`} />}
                    </div>
                  ) : (
                    <div key={`${month.key}-${cell.key || `empty-${idx}`}`} className="mini-day empty" />
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="card">
        <h3>Biometric Logs for {selectedDate || "Select a date"}</h3>
        {selectedLogs.length === 0 ? (
          <p className="muted">No records for selected date.</p>
        ) : (
          <ul className="simple-list">
            {selectedLogs.map((log) => (
              <li key={log._id || log.logId}>{`${log.time} | ${log.device} | ${log.status}`}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="legend card">
        <span className="dot present" /> Present
        <span className="dot absent" /> Absent
        <span className="dot leave" /> Leave
        <span className="dot half" /> Half Day
      </div>
    </div>
  );
}
