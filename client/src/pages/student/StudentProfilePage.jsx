import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { studentApi } from "../../services/api";

export default function StudentProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    photo: currentUser?.photo || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    password: "",
  });

  return (
    <div className="page-grid">
      <PageHeader title="Profile Settings" subtitle="Update your profile photo, contact, and password" />
      <form
        className="card form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await studentApi.updateProfile(currentUser.id, form);
          updateProfile({ photo: form.photo, phone: form.phone, email: form.email });
        }}
      >
        <input placeholder="Profile Photo URL" value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <input placeholder="New Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
