import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext(null);

function unwrapUser(payload) {
  return payload?.user || payload?.data?.user || payload?.data || payload;
}

function unwrapToken(payload) {
  return payload?.token || payload?.accessToken || payload?.data?.token || payload?.data?.accessToken;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const result = await getCurrentUser();
      const currentUser = unwrapUser(result);
      setUser(currentUser);
      return currentUser;
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    const token = unwrapToken(result);

    if (!token) {
      throw new Error("Login response did not include a JWT token. Check your backend response.");
    }

    localStorage.setItem("token", token);
    const currentUser = unwrapUser(result);
    if (currentUser && (currentUser._id || currentUser.id || currentUser.email)) {
      setUser(currentUser);
    } else {
      await refreshUser();
    }
    return result;
  };

  const register = async (details) => {
    const result = await registerUser(details);
    const token = unwrapToken(result);

    if (token) {
      localStorage.setItem("token", token);
      const currentUser = unwrapUser(result);
      if (currentUser && (currentUser._id || currentUser.id || currentUser.email)) {
        setUser(currentUser);
      } else {
        await refreshUser();
      }
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}