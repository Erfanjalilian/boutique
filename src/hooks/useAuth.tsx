"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "boutique_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AuthUser;
          if (mounted) setUser(parsed);
        }

        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!mounted) return;

        if (data.success) {
          const authUser: AuthUser = {
            id: data.data.id,
            phone: data.data.phone,
            name: data.data.name,
            role: data.data.role,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        } else {
          setUser(null);
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        if (mounted) {
          setUser(null);
          localStorage.removeItem(AUTH_KEY);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
