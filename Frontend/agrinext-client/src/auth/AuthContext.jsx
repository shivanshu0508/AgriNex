import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("agrinext-token")
      || window.sessionStorage.getItem("agrinext-token");

    if (!token) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    api.get("/auth/me")
      .then(setUser)
      .catch((error) => {
        if (error.status === 401) {
          window.localStorage.removeItem("agrinext-token");
          window.sessionStorage.removeItem("agrinext-token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials, remember = false) {
      const result = await api.post("/auth/login", credentials);
      window.localStorage.removeItem("agrinext-token");
      window.sessionStorage.removeItem("agrinext-token");
      window[remember ? "localStorage" : "sessionStorage"].setItem("agrinext-token", result.token);
      setUser(result.user);
      return result.user;
    },
    async register(details) {
      const result = await api.post("/auth/register", details);
      window.sessionStorage.removeItem("agrinext-token");
      window.localStorage.setItem("agrinext-token", result.token);
      setUser(result.user);
      return result.user;
    },
    async updateProfile(details) {
      const updatedUser = await api.patch("/auth/me", details);
      setUser(updatedUser);
      return updatedUser;
    },
    logout() {
      window.localStorage.removeItem("agrinext-token");
      window.sessionStorage.removeItem("agrinext-token");
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
