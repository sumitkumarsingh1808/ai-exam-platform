import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { askExamAgent } from "@/lib/agent-chat";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    const isLocal =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

    if (!admin && !isLocal) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to the Admin portal." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      message,
      history = [],
      subject = "General",
      difficulty = "medium",
      numQuestions = 5,
      apiKey,
    } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a message or prompt for the AI Agent." },
        { status: 400 }
      );
    }

    const response = await askExamAgent({
      message: message.trim(),
      history,
      subject,
      difficulty,
      numQuestions: Math.min(Math.max(Number(numQuestions) || 5, 1), 20),
      apiKey,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("AI Agent Chat error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to communicate with AI Agent." },
      { status: 500 }
    );
  }
}
