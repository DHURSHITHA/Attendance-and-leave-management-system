const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const authApi = {
  login: async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data.user;
  },
  register: async (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const studentApi = {
  dashboard: (studentId) => request(`/student/${studentId}/dashboard`),
  attendanceSummary: (studentId) => request(`/student/${studentId}/attendance-summary`),
  calendar: (studentId, month) =>
    request(`/student/${studentId}/calendar${month ? `?month=${encodeURIComponent(month)}` : ""}`),
  biometricLogs: (studentId, { month, q, page, limit }) =>
    request(
      `/student/${studentId}/biometric-logs?month=${encodeURIComponent(month || "")}&q=${encodeURIComponent(q || "")}&page=${page || 1}&limit=${limit || 10}`
    ),
  leaveHistory: (studentId) => request(`/student/${studentId}/leave`),
  applyLeave: (studentId, payload) =>
    request(`/student/${studentId}/leave`, { method: "POST", body: JSON.stringify(payload) }),
  performance: (studentId) => request(`/student/${studentId}/performance`),
  notifications: (studentId) => request(`/student/${studentId}/notifications`),
  updateProfile: (studentId, payload) =>
    request(`/student/${studentId}/profile`, { method: "PATCH", body: JSON.stringify(payload) }),
};

export const facultyApi = {
  dashboard: (facultyId) => request(`/faculty/${facultyId}/dashboard`),
  students: (facultyId) => request(`/faculty/${facultyId}/students`),
  attendanceMonitor: (facultyId) => request(`/faculty/${facultyId}/attendance-monitor`),
  biometricLogs: (facultyId, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/faculty/${facultyId}/biometric-logs${qs ? `?${qs}` : ""}`);
  },
  lowAttendance: (facultyId) => request(`/faculty/${facultyId}/low-attendance`),
  leaveRequests: (facultyId) => request(`/faculty/${facultyId}/leave-requests`),
  updateLeaveRequest: (facultyId, leaveId, payload) =>
    request(`/faculty/${facultyId}/leave-requests/${leaveId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  analytics: (facultyId) => request(`/faculty/${facultyId}/analytics`),
  reports: (facultyId) => request(`/faculty/${facultyId}/reports`),
  createReport: (facultyId, payload) =>
    request(`/faculty/${facultyId}/reports`, { method: "POST", body: JSON.stringify(payload) }),
  addStudent: (facultyId, payload) =>
    request(`/faculty/${facultyId}/students`, { method: "POST", body: JSON.stringify(payload) }),
  updateStudent: (facultyId, studentId, payload) =>
    request(`/faculty/${facultyId}/students/${studentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteStudent: (facultyId, studentId) =>
    request(`/faculty/${facultyId}/students/${studentId}`, { method: "DELETE" }),
  notifications: (facultyId) => request(`/faculty/${facultyId}/notifications`),
  sendNotification: (facultyId, payload) =>
    request(`/faculty/${facultyId}/notifications`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  dashboard: () => request("/admin/dashboard"),
  students: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/students${qs ? `?${qs}` : ""}`);
  },
  addStudent: (payload) => request("/admin/students", { method: "POST", body: JSON.stringify(payload) }),
  updateStudent: (studentId, payload) =>
    request(`/admin/students/${studentId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteStudent: (studentId) => request(`/admin/students/${studentId}`, { method: "DELETE" }),

  faculties: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/faculties${qs ? `?${qs}` : ""}`);
  },
  addFaculty: (payload) => request("/admin/faculties", { method: "POST", body: JSON.stringify(payload) }),
  updateFaculty: (facultyId, payload) =>
    request(`/admin/faculties/${facultyId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteFaculty: (facultyId) => request(`/admin/faculties/${facultyId}`, { method: "DELETE" }),

  mentorAssignment: () => request("/admin/mentor-assignment"),
  reassignMentor: (studentId, mentorId) =>
    request(`/admin/mentor-assignment/${studentId}`, { method: "PATCH", body: JSON.stringify({ mentorId }) }),

  departments: () => request("/admin/departments"),
  addDepartment: (payload) => request("/admin/departments", { method: "POST", body: JSON.stringify(payload) }),
  updateDepartment: (id, payload) =>
    request(`/admin/departments/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteDepartment: (id) => request(`/admin/departments/${id}`, { method: "DELETE" }),

  attendanceMonitor: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/attendance-monitor${qs ? `?${qs}` : ""}`);
  },

  facultyAttendance: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/faculty-attendance${qs ? `?${qs}` : ""}`);
  },
  updateFacultyAttendance: (facultyId, payload) =>
    request(`/admin/faculty-attendance/${facultyId}`, { method: "PATCH", body: JSON.stringify(payload) }),

  biometricSettings: () => request("/admin/biometric-settings"),
  updateBiometricSettings: (payload) =>
    request("/admin/biometric-settings", { method: "PUT", body: JSON.stringify(payload) }),
  biometricLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/biometric-logs${qs ? `?${qs}` : ""}`);
  },

  manualAttendance: (payload) =>
    request("/admin/manual-attendance", { method: "PATCH", body: JSON.stringify(payload) }),

  leaveMonitoring: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/leave-monitoring${qs ? `?${qs}` : ""}`);
  },
  updateLeaveMonitoring: (leaveId, payload) =>
    request(`/admin/leave-monitoring/${leaveId}`, { method: "PATCH", body: JSON.stringify(payload) }),

  reports: () => request("/admin/reports"),
  createReport: (payload) => request("/admin/reports", { method: "POST", body: JSON.stringify(payload) }),

  analytics: () => request("/admin/analytics"),

  notifications: () => request("/admin/notifications"),
  sendNotification: (payload) => request("/admin/notifications", { method: "POST", body: JSON.stringify(payload) }),

  systemSettings: () => request("/admin/system-settings"),
  updateSystemSettings: (payload) =>
    request("/admin/system-settings", { method: "PUT", body: JSON.stringify(payload) }),

  activityLogs: (limit = 200) => request(`/admin/activity-logs?limit=${limit}`),
};
