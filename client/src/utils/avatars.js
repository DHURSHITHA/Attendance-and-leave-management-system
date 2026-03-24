import studentAvatar from "../assets/student-avatar.svg";

export const roleAvatars = {
  student: studentAvatar,
  faculty:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200&q=80",
  admin:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  parent:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
};

export const childAvatar = studentAvatar;

const isPlaceholderAvatar = (url) => /pravatar/i.test(url || "");

export const getAvatarByRole = (role) => roleAvatars[role] || roleAvatars.student;

export const getUserAvatar = (user) => {
  if (user?.role === "student") {
    return roleAvatars.student;
  }
  if (user?.photo && !isPlaceholderAvatar(user.photo)) {
    return user.photo;
  }
  return getAvatarByRole(user?.role);
};
