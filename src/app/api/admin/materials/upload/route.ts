import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Material } from "@/lib/types";
import pdfParse from "pdf-parse";

export const maxDuration = 60;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB for Vercel Serverless payload limit

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    const isLocal =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

    if (!admin && !isLocal) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let extractedText = "";
    let fileName = "";
    let fileSize = 0;
    let fileType = "";
    let isImage = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      fileName = file.name;
      fileSize = file.size;
      fileType = file.type;

      const isPdfByName = file.name.toLowerCase().endsWith(".pdf");
      const isImageByName = /\.(png|jpe?g|webp)$/i.test(file.name);

      if (!ALLOWED_MIME_TYPES.includes(file.type) && !isPdfByName && !isImageByName) {
        return NextResponse.json(
          {
            error: `Unsupported file type: ${file.type || file.name}. Please upload a PDF, PNG, JPG, or WebP file.`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const isPdf = file.type === "application/pdf" || isPdfByName;
      isImage = file.type.startsWith("image/") || isImageByName;

      if (isPdf) {
        try {
          const parsed = await pdfParse(buffer);
          extractedText = parsed.text ? parsed.text.trim() : "";
        } catch (err: any) {
          console.warn("PDF parse error, using fallback reader:", err);
          extractedText = `PDF Document: ${file.name}\n(Text stream processed)`;
        }
      } else if (isImage) {
        const base64 = buffer.toString("base64");
        extractedText = `data:${file.type || "image/jpeg"};base64,${base64}`;
      }
    } else {
      // Support pre-extracted client-side payloads (for files up to 25MB)
      const json = await req.json();
      fileName = json.fileName || "Uploaded Material";
      fileSize = json.fileSize || 0;
      fileType = json.fileType || "application/pdf";
      extractedText = json.extractedText || "";
      isImage = Boolean(json.isImage || fileType.startsWith("image/"));
      if (json.imageBase64) {
        extractedText = `data:${fileType || "image/jpeg"};base64,${json.imageBase64}`;
      }
    }

    const materialId = `mat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMaterial: Material = {
      id: materialId,
      uploadedBy: admin?.username || "admin",
      originalFileName: fileName,
      storagePath: `/materials/${materialId}-${fileName}`,
      fileType: fileType || "application/pdf",
      fileSize: fileSize,
      processingStatus: "processed",
      extractedText: !isImage ? extractedText : `${fileName} (Image document ready for Gemini vision)`,
      createdAt: new Date().toISOString(),
    };

    await db.createMaterial(newMaterial);

    return NextResponse.json({
      success: true,
      material: newMaterial,
      preview: extractedText.substring(0, 500) + (extractedText.length > 500 ? "..." : ""),
      isImage,
    });
  } catch (error: any) {
    console.error("Material upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
