"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchAPI } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "editor";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticate user on boot
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await fetchAPI("/api/auth/me", { token: storedToken });
          if (res.success && res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            // Token invalid or expired
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Protect pages
  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === "/login";
      if (!user && !isLoginPage) {
        router.push("/login");
      } else if (user && isLoginPage) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchAPI("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
        setUser(res.user);
        router.push("/dashboard");
      } else {
        throw new Error(res.message || "Invalid email or password.");
      }
    } catch (error: any) {
      throw new Error(error.message || "Invalid credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      // Call logout API
      fetchAPI("/api/auth/logout", { method: "POST" }).catch(() => {});
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
