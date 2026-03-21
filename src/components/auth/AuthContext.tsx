import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredSession,
  createSession,
  persistSession,
  readStoredSession,
  validateCredentials,
  type Session,
} from "@/lib/auth";

type LoginResult =
  | { success: true }
  | { success: false; message: string };

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  session: Session | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStorage = () =>
  typeof window !== "undefined" ? window.localStorage : null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedSession = readStoredSession(getStorage());
    setSession(storedSession);
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, password: string): LoginResult => {
    if (!validateCredentials(email, password)) {
      return {
        success: false,
        message: "Use the demo credentials shown below to start a session.",
      };
    }

    const nextSession = createSession(email);
    persistSession(getStorage(), nextSession);
    setSession(nextSession);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearStoredSession(getStorage());
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      isReady,
      session,
      login,
      logout,
    }),
    [isReady, login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
