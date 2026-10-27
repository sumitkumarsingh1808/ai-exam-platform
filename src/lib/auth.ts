import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { User, UserRole } from "./types";

const JWT_SECRET = process.env.SESSION_SECRET || "nta-ai-exam-secret-key-32-chars-long!";
const ADMIN_COOKIE_NAME = "nta_admin_session";
const USER_COOKIE_NAME = "nta_user_session";

// In-memory rate limiter for login
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

export function resetRateLimit(key: string) {
  loginAttempts.delete(key);
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export interface AdminPayload {
  username: string;
  role: "admin";
  isDefaultPassword?: boolean;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export interface UserPayload {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export function signUserToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts authenticated Admin session from cookies or headers
 */
export async function getAdminSession(req?: NextRequest): Promise<AdminPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Extracts authenticated User session from cookies or headers
 */
export async function getUserSession(req?: NextRequest): Promise<UserPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(USER_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyUserToken(token);
}

export const AUTH_COOKIES = {
  admin: ADMIN_COOKIE_NAME,
  user: USER_COOKIE_NAME,
};
