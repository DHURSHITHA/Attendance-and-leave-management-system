import PageHeader from "../../components/common/PageHeader";

export default function ParentProfilePage() {
  return (
    <div className="page-grid">
      <PageHeader title="Parent Profile" subtitle="Guardian and student contact details" />
      <div className="cards-grid">
        <div className="card">
          <h3>Student Details</h3>
          <ul className="simple-list">
            <li>Name: Aarav Sharma</li>
            <li>Roll: STU014</li>
            <li>Program: Computer Science</li>
            <li>Semester: 5 | Section: A</li>
            <li>Mentor: Dr. Priya Nair</li>
          </ul>
        </div>
        <div className="card">
          <h3>Guardian Details</h3>
          <ul className="simple-list">
            <li>Primary Guardian: Ravi Sharma</li>
            <li>Relation: Father</li>
            <li>Phone: +91-90012-3344</li>
            <li>Email: parent@attendx.com</li>
            <li>Address: 22 Sunrise Avenue, Bengaluru</li>
          </ul>
        </div>
        <div className="card">
          <h3>Emergency Contacts</h3>
          <ul className="simple-list">
            <li>Mother: Priya Sharma | +91-90012-8899</li>
            <li>Uncle: Ajay Sharma | +91-90012-4433</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
