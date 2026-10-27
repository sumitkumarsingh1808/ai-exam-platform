import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateQuizWithGemini } from "@/lib/gemini";
import { aiGenerationConfigSchema } from "@/lib/validation";

export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const material = await db.getMaterial(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = aiGenerationConfigSchema.safeParse(body);
    const config = parsed.success ? parsed.data : {
      title: material.originalFileName.replace(/\.[^/.]+$/, ""),
      subject: "General",
      numQuestions: 5,
      difficulty: "mixed" as const,
      language: "English",
    };

    let content = material.extractedText || "";
    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (content.startsWith("data:image/")) {
      const parts = content.split(";base64,");
      imageMimeType = parts[0].replace("data:", "");
      imageBase64 = parts[1];
      content = `Study Material Image: ${material.originalFileName}`;
    }

    const generated = await generateQuizWithGemini({
      content,
      title: config.title || material.originalFileName,
      subject: config.subject,
      numQuestions: config.numQuestions,
      difficulty: config.difficulty,
      language: config.language,
      customPrompt: config.customPrompt,
      imageBase64,
      imageMimeType,
    });

    return NextResponse.json({
      success: true,
      quiz: generated,
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { error: "AI Question Generation Failed: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
