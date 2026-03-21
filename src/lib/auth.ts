export const SESSION_STORAGE_KEY = "fellogic.session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const DEMO_CREDENTIALS = {
  email: "demo@fellogic.com",
  password: "fellogic123",
};

export type Session = {
  email: string;
  createdAt: string;
  expiresAt: string;
};

const isSession = (value: unknown): value is Session => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Record<string, unknown>;

  return (
    typeof session.email === "string" &&
    typeof session.createdAt === "string" &&
    typeof session.expiresAt === "string"
  );
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const validateCredentials = (email: string, password: string) => {
  return (
    normalizeEmail(email) === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  );
};

export const createSession = (email: string, now = Date.now()): Session => ({
  email: normalizeEmail(email),
  createdAt: new Date(now).toISOString(),
  expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
});

export const isSessionExpired = (session: Session, now = Date.now()) => {
  return new Date(session.expiresAt).getTime() <= now;
};

export const readStoredSession = (storage: Storage | null): Session | null => {
  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession);

    if (!isSession(parsedSession) || isSessionExpired(parsedSession)) {
      storage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return parsedSession;
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const persistSession = (storage: Storage | null, session: Session) => {
  storage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = (storage: Storage | null) => {
  storage?.removeItem(SESSION_STORAGE_KEY);
};
