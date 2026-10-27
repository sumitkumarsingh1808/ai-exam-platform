import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signUserToken, hashPassword, verifyPassword, AUTH_COOKIES } from "@/lib/auth";
import { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, displayName, mode = "login" } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Application Number / Email and Password are required." },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes("@");
    const now = new Date().toISOString();

    // Check existing users in database
    const allUsers = await db.listUsers();
    let existingUser = allUsers.find(
      (u) =>
        u.email?.toLowerCase() === cleanId ||
        u.uid?.toLowerCase() === cleanId ||
        (u as any).applicationNumber?.toLowerCase() === cleanId
    );

    if (mode === "register") {
      if (existingUser) {
        return NextResponse.json(
          { error: "A candidate with this Application Number or Email already exists. Please sign in." },
          { status: 400 }
        );
      }

      const uid = `cand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const pwdHash = await hashPassword(password);

      const newUser: User = {
        uid,
        displayName: displayName?.trim() || (isEmail ? cleanId.split("@")[0] : `Candidate ${cleanId}`),
        email: isEmail ? cleanId : `${cleanId}@candidate.nta.gov.in`,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "user",
        createdAt: now,
        lastLoginAt: now,
      };

      (newUser as any).passwordHash = pwdHash;
      (newUser as any).applicationNumber = cleanId;

      await db.saveUser(newUser);

      const token = signUserToken({
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
      });

      const response = NextResponse.json({
        success: true,
        message: "Candidate registered successfully.",
        user: newUser,
      });

      response.cookies.set({
        name: AUTH_COOKIES.user,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // Login mode
    if (!existingUser) {
      // If user doesn't exist, automatically onboard as candidate for smooth examination access
      const uid = `cand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const pwdHash = await hashPassword(password);

      const newUser: User = {
        uid,
        displayName: displayName?.trim() || (isEmail ? cleanId.split("@")[0] : `Candidate ${cleanId.toUpperCase()}`),
        email: isEmail ? cleanId : `${cleanId}@candidate.nta.gov.in`,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "user",
        createdAt: now,
        lastLoginAt: now,
      };

      (newUser as any).passwordHash = pwdHash;
      (newUser as any).applicationNumber = cleanId;

      await db.saveUser(newUser);
      existingUser = newUser;
    } else {
      // If passwordHash exists, verify it
      if ((existingUser as any).passwordHash) {
        const isValid = await verifyPassword(password, (existingUser as any).passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid password or credentials. Please check your credentials." },
            { status: 401 }
          );
        }
      }
      existingUser.lastLoginAt = now;
      await db.saveUser(existingUser);
    }

    const token = signUserToken({
      uid: existingUser.uid,
      email: existingUser.email,
      displayName: existingUser.displayName,
      role: existingUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Candidate signed in successfully.",
      user: existingUser,
    });

    response.cookies.set({
      name: AUTH_COOKIES.user,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Candidate login error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process candidate authentication." },
      { status: 500 }
    );
  }
}
