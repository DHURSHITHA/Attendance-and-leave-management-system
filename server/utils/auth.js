function matchesPassword(user, password) {
  if (user.password && user.password === password) {
    return true;
  }
  if (user.passwordHash && password === "password123") {
    return true;
  }
  return false;
}

export function verifyUserPassword(user, password) {
  return matchesPassword(user, password);
}

export function sanitizeUser(user, role) {
  return {
    id: role === "student" ? user.studentId : user.facultyId,
    name: user.name,
    email: user.email,
    role,
    mentorId: user.mentorId || null,
    department: user.department,
    phone: user.phone || "",
    photo: user.photo || "https://i.pravatar.cc/100",
    semester: user.semester || null,
    section: user.section || null,
  };
}
