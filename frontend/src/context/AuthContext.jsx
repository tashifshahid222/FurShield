import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, notificationApi, storeApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('furshield_user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('furshield_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const setSession = (data) => {
    localStorage.setItem('furshield_token', data.token);
    localStorage.setItem('furshield_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const clearSession = () => {
    localStorage.removeItem('furshield_token');
    localStorage.removeItem('furshield_user');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
    setCartCount(0);
  };

  const register = async (data) => {
    const result = await authApi.register(data);
    setSession(result);
    return result;
  };

  const login = async (data) => {
    const result = await authApi.login(data);
    setSession(result);
    return result;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    clearSession();
  };

  const refreshUnread = useCallback(async () => {
    if (!token) return;
    try {
      const result = await notificationApi.unreadCount();
      setUnreadCount(result.unreadCount || 0);
    } catch {
      // ignore
    }
  }, [token]);

  const refreshCartCount = useCallback(async () => {
    if (!token) return;
    try {
      const result = await storeApi.getCart();
      const count = (result.data && result.data.items ? result.data.items : []).reduce((s, i) => s + i.quantity, 0);
      setCartCount(count);
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      authApi.getMe().then((res) => {
        setUser(res.data);
        localStorage.setItem('furshield_user', JSON.stringify(res.data));
      }).catch(() => {
        clearSession();
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUnread();
    refreshCartCount();
  }, [refreshUnread, refreshCartCount]);

  const value = {
    user,
    token,
    loading,
    setLoading,
    unreadCount,
    cartCount,
    refreshUnread,
    refreshCartCount,
    register,
    login,
    logout,
    setUser,
    updateUser: (newUser) => {
      setUser(newUser);
      localStorage.setItem('furshield_user', JSON.stringify(newUser));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);