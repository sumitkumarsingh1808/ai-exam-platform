import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { generateQuizWithGemini } from "@/lib/gemini";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    // Allow if admin session exists OR if running on localhost development environment
    const isLocal =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

    if (!admin && !isLocal) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to Admin portal." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    let content = "";
    let title = "Generated Quiz";
    let subject = "General";
    let numQuestions = 5;
    let difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed";
    let language = "English";
    let customPrompt = "";
    let apiKey: string | undefined;
    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      title = (formData.get("title") as string) || title;
      subject = (formData.get("subject") as string) || subject;
      numQuestions = parseInt((formData.get("numQuestions") as string) || "5", 10);
      difficulty = ((formData.get("difficulty") as string) || "mixed") as any;
      language = (formData.get("language") as string) || language;
      customPrompt = (formData.get("customPrompt") as string) || "";
      apiKey = (formData.get("apiKey") as string) || undefined;
      const textNotes = (formData.get("textNotes") as string) || "";

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          try {
            const parsed = await pdfParse(buffer);
            content = parsed.text || textNotes;
          } catch (pdfErr) {
            console.warn("PDF parse warning:", pdfErr);
            content = textNotes || file.name;
          }
        } else if (file.type.startsWith("image/")) {
          imageBase64 = buffer.toString("base64");
          imageMimeType = file.type;
          content = textNotes ? `Notes: ${textNotes}\n(Study Material image attached)` : `Study Material image attached`;
        }
      } else {
        content = textNotes;
      }
    } else {
      const json = await req.json();
      content = json.content || "";
      title = json.title || title;
      subject = json.subject || subject;
      numQuestions = json.numQuestions || 5;
      difficulty = json.difficulty || "mixed";
      language = json.language || "English";
      customPrompt = json.customPrompt || "";
      apiKey = json.apiKey || undefined;
    }

    if (!content && !imageBase64) {
      return NextResponse.json(
        { error: "Please upload a PDF or enter study text to generate questions." },
        { status: 400 }
      );
    }

    const quiz = await generateQuizWithGemini({
      content,
      title,
      subject,
      numQuestions,
      difficulty,
      language,
      customPrompt,
      imageBase64,
      imageMimeType,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      quiz,
      extractedLength: content.length,
    });
  } catch (error: any) {
    console.error("Direct generation error:", error);
    return NextResponse.json(
      { error: "Generation failed: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
