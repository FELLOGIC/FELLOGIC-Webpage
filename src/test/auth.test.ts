import { beforeEach, describe, expect, it } from "vitest";
import {
  DEMO_CREDENTIALS,
  SESSION_STORAGE_KEY,
  createSession,
  readStoredSession,
  validateCredentials,
} from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("accepts the seeded demo credentials", () => {
    expect(validateCredentials(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true);
    expect(validateCredentials("wrong@example.com", DEMO_CREDENTIALS.password)).toBe(false);
  });

  it("restores valid sessions from storage", () => {
    const session = createSession(DEMO_CREDENTIALS.email, Date.UTC(2026, 0, 1));
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    expect(readStoredSession(window.localStorage)).toEqual(session);
  });

  it("drops expired sessions from storage", () => {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        email: DEMO_CREDENTIALS.email,
        createdAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-01T00:00:01.000Z",
      }),
    );

    expect(readStoredSession(window.localStorage)).toBeNull();
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });
});
