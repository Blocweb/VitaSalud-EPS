import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, authStorage, type AuthUser, type RegisterPayload } from '../lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser());
  const [loading, setLoading] = useState(Boolean(authStorage.getToken()));

  useEffect(() => {
    let ignore = false;

    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.verify();
        if (ignore) return;

        const mergedUser = { ...user, ...response.user };
        setUser(mergedUser);
        authStorage.setSession(token, mergedUser);
      } catch {
        if (!ignore) {
          authStorage.clearSession();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    verifySession();

    return () => {
      ignore = true;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(() => {
    const saveSession = (newToken: string, newUser: AuthUser) => {
      authStorage.setSession(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
    };

    return {
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      async login(email: string, password: string) {
        const response = await authApi.login(email, password);
        saveSession(response.token, response.user);
      },
      async register(payload: RegisterPayload) {
        const response = await authApi.register(payload);
        saveSession(response.token, response.user);
      },
      logout() {
        authStorage.clearSession();
        setToken(null);
        setUser(null);
      },
    };
  }, [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

