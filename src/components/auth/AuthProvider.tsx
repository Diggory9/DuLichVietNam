"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthUser {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  isPublicProfile?: boolean;
  role: "admin" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateDisplayName: (name: string) => void;
  updateProfile: (fields: Partial<Pick<AuthUser, "displayName" | "bio" | "avatar" | "isPublicProfile">>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateDisplayName: () => {},
  updateProfile: () => {},
});

const TOKEN_KEY = "dulichvietnam_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load token from localStorage and fetch user
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      fetchMe(stored).then((u) => {
        if (u) setUser(u);
        else localStorage.removeItem(TOKEN_KEY);
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, []);

  async function fetchMe(t: string): Promise<AuthUser | null> {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Đăng nhập thất bại");
    setToken(json.data.token);
    setUser(json.data.user);
    localStorage.setItem(TOKEN_KEY, json.data.token);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Đăng ký thất bại");
    setToken(json.data.token);
    setUser(json.data.user);
    localStorage.setItem(TOKEN_KEY, json.data.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    setUser((prev) => prev ? { ...prev, displayName: name } : null);
  }, []);

  const updateProfile = useCallback((fields: Partial<Pick<AuthUser, "displayName" | "bio" | "avatar" | "isPublicProfile">>) => {
    setUser((prev) => prev ? { ...prev, ...fields } : null);
  }, []);

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout, updateDisplayName, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
