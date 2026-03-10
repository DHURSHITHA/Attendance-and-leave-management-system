import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { useAuth } from "../../auth/AuthContext";
import { facultyApi } from "../../services/api";
import useAsyncData from "../../hooks/useAsyncData";

export default function FacultyStudentManagementPage() {
  const { currentUser } = useAuth();
  const [newName, setNewName] = useState("");

  const { data, loading, error, setData } = useAsyncData(
    () => facultyApi.students(currentUser.id),
    [currentUser.id]
  );
  const mentees = Array.isArray(data) ? data : [];

  return (
    <div className="page-grid">
      <PageHeader title="Student Management" subtitle="Add, edit, or delete mentees" />
      <div className="card controls">
        <input placeholder="New Student Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button
          onClick={async () => {
            const created = await facultyApi.addStudent(currentUser.id, {
              name: newName,
              email: `${newName.toLowerCase().replace(/\s+/g, "")}.${Date.now()}@college.edu`,
              department: currentUser.department,
              semester: 1,
              section: "A",
              rollNumber: `NEW${Date.now().toString().slice(-5)}`,
            });
            setData([...mentees, created]);
            setNewName("");
          }}
        >
          Add Student
        </button>
      </div>
      {loading && <div className="card">Loading students...</div>}
      {error && <div className="card error-text">{error}</div>}
      <DataTable
        columns={["Name", "Email", "Department", "Action"]}
        rows={mentees.map((m) => [m.name, m.email, m.department, `Delete (${m.studentId})`])}
      />
    </div>
  );
}
