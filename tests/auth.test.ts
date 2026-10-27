import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
  signUserToken,
  verifyUserToken,
} from "../src/lib/auth";

describe("Authentication & Hashing", () => {
  it("hashes password and verifies successfully", async () => {
    const password = "secureExamPassword2026!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword("wrongpassword", hash);
    expect(invalid).toBe(false);
  });

  it("signs and verifies admin JWT tokens", () => {
    const payload = {
      username: "sumit045",
      role: "admin" as const,
      isDefaultPassword: true,
    };

    const token = signAdminToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyAdminToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.username).toBe("sumit045");
    expect(decoded?.role).toBe("admin");
  });

  it("signs and verifies user JWT tokens", () => {
    const payload = {
      uid: "user-12345",
      email: "candidate@example.com",
      displayName: "Candidate Student",
      role: "user" as const,
    };

    const token = signUserToken(payload);
    const decoded = verifyUserToken(token);
    expect(decoded?.uid).toBe("user-12345");
    expect(decoded?.role).toBe("user");
  });
});
