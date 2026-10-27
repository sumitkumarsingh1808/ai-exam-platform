import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { answerUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    let attempt = await db.getAttempt(id);

    // Fallback if attempt was created on another serverless container
    if (!attempt && body.quizId) {
      const now = new Date();
      attempt = {
        id,
        quizId: body.quizId,
        quizTitle: "Examination",
        userId: "candidate",
        userName: "Candidate",
        userEmail: "candidate@nta.ac.in",
        status: "in_progress",
        startedAt: now.toISOString(),
        deadlineAt: new Date(now.getTime() + 7200000).toISOString(),
        answers: {},
      };
      await db.createAttempt(attempt);
    }

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    if (attempt.status !== "in_progress") {
      return NextResponse.json(
        { error: `Cannot save answers. Attempt is already ${attempt.status}.` },
        { status: 400 }
      );
    }

    // Check deadline with 30s grace period for auto-save network latency
    const now = Date.now();
    const deadlineTime = new Date(attempt.deadlineAt).getTime();
    if (now > deadlineTime + 30000) {
      return NextResponse.json(
        { error: "Examination time has expired. Please submit your answers." },
        { status: 403 }
      );
    }

    const parsed = answerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid answers payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const mergedAnswers = {
      ...attempt.answers,
      ...parsed.data.answers,
    };

    const updated = await db.updateAttempt(id, {
      answers: mergedAnswers,
    });

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
      updatedAnswersCount: Object.keys(parsed.data.answers).length,
    });
  } catch (error: any) {
    console.error("Save answers error:", error);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }
}
