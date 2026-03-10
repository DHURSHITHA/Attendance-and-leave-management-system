import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem("attendance_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    try {
      const user = await authApi.login(email, password);
      localStorage.setItem("attendance_user", JSON.stringify(user));
      setCurrentUser(user);
      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: error.message || "Invalid credentials" };
    }
  };

  const logout = () => {
    localStorage.removeItem("attendance_user");
    setCurrentUser(null);
  };

  const updateProfile = (patch) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("attendance_user", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      updateProfile,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
