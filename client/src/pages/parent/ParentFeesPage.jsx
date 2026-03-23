import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";

export default function ParentFeesPage() {
  const rows = [
    ["INV-2026-021", "Semester 5", "INR 18,000", <span className="status-chip paid" key="f1">Paid</span>, "2026-03-01"],
    ["INV-2026-022", "Transport", "INR 2,500", <span className="status-chip paid" key="f2">Paid</span>, "2026-03-10"],
    ["INV-2026-023", "Lab Fees", "INR 4,500", <span className="status-chip due" key="f3">Due</span>, "2026-04-05"],
  ];

  return (
    <div className="page-grid">
      <PageHeader title="Fees & Payments" subtitle="Track dues, invoices, and receipts" />
      <div className="cards-grid">
        <StatCard label="Total Due" value="INR 4,500" hint="Due by April 5" />
        <StatCard label="Paid This Term" value="INR 20,500" />
        <StatCard label="Scholarship" value="INR 3,000" hint="Merit grant" />
        <StatCard label="Last Payment" value="2026-03-10" />
      </div>
      <DataTable columns={["Invoice", "Term", "Amount", "Status", "Paid On"]} rows={rows} />
    </div>
  );
}
