/**
 * Client-Side Document & PDF Processing Engine
 * Enables support for files up to 25MB on serverless cloud platforms (Vercel).
 * 
 * Extracts text from PDFs directly in the browser (turning 20MB PDFs into ~100KB of text)
 * and automatically compresses high-res images / scanned pages to pass Vercel's 4.5MB edge limit.
 */

export interface ProcessedDocument {
  mode: "text" | "scanned_pdf" | "image" | "raw";
  extractedText?: string;
  imageBase64?: string;
  imageMimeType?: string;
  images?: Array<{ data: string; mimeType: string }>;
  originalFileName: string;
  originalFileSize: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

/**
 * Dynamically loads Mozilla's PDF.js library from official CDN with worker support.
 */
let pdfjsPromise: Promise<any> | null = null;

export function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjsLib);
      } else {
        reject(new Error("PDF.js loaded but pdfjsLib object not found on window"));
      }
    };
    script.onerror = () => {
      pdfjsPromise = null;
      reject(new Error("Failed to load PDF.js from CDN"));
    };
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

/**
 * Resizes and compresses an image file to JPEG under target bytes (typically ~1.5MB max).
 */
export async function compressImage(file: File, maxDim = 2048, quality = 0.82): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mimeType: "image/jpeg" });
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts text and/or page scans from a PDF file up to 25MB directly inside the browser.
 */
export async function extractFromPdf(file: File, onProgress?: (msg: string) => void): Promise<ProcessedDocument> {
  onProgress?.("Loading PDF document parser in browser...");
  const pdfjsLib = await loadPdfJs();

  onProgress?.("Reading PDF file buffer...");
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  onProgress?.(`Extracting text from ${numPages} page(s)...`);

  let fullText = "";
  let totalCharacters = 0;

  // Extract text layer page by page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ")
      .trim();

    if (pageText) {
      fullText += `\n[--- Page ${pageNum} ---]\n` + pageText + "\n";
      totalCharacters += pageText.length;
    }
  }

  // If text layer was extracted successfully, return text mode (ultra-fast, zero size issues!)
  if (totalCharacters > 80) {
    onProgress?.(`Successfully extracted ${totalCharacters.toLocaleString()} characters!`);
    return {
      mode: "text",
      extractedText: fullText.trim(),
      originalFileName: file.name,
      originalFileSize: file.size,
    };
  }

  // If text layer is missing or empty (scanned document), render pages to canvas images for Gemini vision
  onProgress?.("Scanned PDF detected without text layer. Rendering pages for AI Vision OCR...");
  const maxPagesToRender = Math.min(numPages, 6); // Render up to 6 pages to stay within payload limits
  const renderedImages: Array<{ data: string; mimeType: string }> = [];

  for (let pageNum = 1; pageNum <= maxPagesToRender; pageNum++) {
    onProgress?.(`Rendering page ${pageNum} of ${maxPagesToRender}...`);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.25 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      renderedImages.push({
        data: dataUrl.split(",")[1],
        mimeType: "image/jpeg",
      });
    }
  }

  return {
    mode: "scanned_pdf",
    images: renderedImages,
    originalFileName: file.name,
    originalFileSize: file.size,
  };
}

/**
 * Master processor for any uploaded file up to 25MB.
 */
export async function processFileForQuiz(
  file: File,
  onProgress?: (msg: string) => void
): Promise<ProcessedDocument> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. The maximum supported file size is 25MB.`
    );
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name);

  if (isPdf) {
    try {
      return await extractFromPdf(file, onProgress);
    } catch (err: any) {
      console.warn("Client PDF extraction failed, falling back to direct upload:", err);
      // If client parsing fails and file is < 4MB, send raw file as fallback
      if (file.size < 4.2 * 1024 * 1024) {
        return {
          mode: "raw",
          originalFileName: file.name,
          originalFileSize: file.size,
        };
      }
      throw new Error(`Failed to parse PDF document: ${err.message || "Unknown error"}`);
    }
  }

  if (isImage) {
    onProgress?.("Optimizing image resolution for AI vision...");
    const compressed = await compressImage(file);
    return {
      mode: "image",
      imageBase64: compressed.base64,
      imageMimeType: compressed.mimeType,
      originalFileName: file.name,
      originalFileSize: file.size,
    };
  }

  return {
    mode: "raw",
    originalFileName: file.name,
    originalFileSize: file.size,
  };
}
