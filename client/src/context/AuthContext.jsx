// context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ start true to prevent premature redirect
  const [error, setError] = useState(null);

  const loadProfileImage = useCallback((userId) => {
    return localStorage.getItem(`profileImage_${userId}`) || null;
  }, []);

  const register = useCallback(
    async (fullName, email, password) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.post("/api/auth/register", {
          fullName,
          email,
          password,
        });
        localStorage.setItem("token", data.token);
        const profileImage = loadProfileImage(data.user.id);
        setUser({ ...data.user, profileImage });
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadProfileImage],
  );

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.post("/api/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        const profileImage = loadProfileImage(data.user.id);
        setUser({ ...data.user, profileImage });
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadProfileImage],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/auth/me");
      const profileImage = loadProfileImage(data.user.id);
      setUser({ ...data.user, profileImage });
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadProfileImage]);

  const updateProfileImage = useCallback(
    async (imageBase64) => {
      if (!user) return;
      if (imageBase64) {
        localStorage.setItem(`profileImage_${user.id}`, imageBase64);
      } else {
        localStorage.removeItem(`profileImage_${user.id}`);
      }
      setUser((prev) => ({ ...prev, profileImage: imageBase64 || null }));
    },
    [user],
  );

  // ✅ Call checkAuth when the app starts
  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
    updateProfileImage,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
