"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const lastCheckedRef = useRef(0);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    lastCheckedRef.current = Date.now();
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCheckedRef.current > 15 * 60 * 1000) {
      fetchUser();
      lastCheckedRef.current = now;
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
