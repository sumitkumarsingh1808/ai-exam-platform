import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { QuizGenerationResponse, QuestionDifficulty } from "./types";
import { db } from "./db";

const generatedQuestionZod = z.object({
  questionText: z.string().min(5),
  options: z.array(z.string()).min(2),
  correctAnswerIndex: z.number().int().min(0),
  explanation: z.string().default(""),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  topic: z.string().default("General"),
  sourceReference: z.string().optional(),
});

const generatedQuizZod = z.object({
  title: z.string().default("Generated Examination"),
  description: z.string().default("AI-generated assessment based on provided study material"),
  questions: z.array(generatedQuestionZod).min(1),
});

export interface GenerateQuizParams {
  content: string; // extracted text or document content
  title?: string;
  subject?: string;
  numQuestions?: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  language?: string;
  customPrompt?: string;
  imageBase64?: string; // Optional image data for multimodal
  imageMimeType?: string;
  images?: Array<{ data: string; mimeType: string }>; // Multi-page scanned PDF or images
  apiKey?: string; // Optional override key
}

/**
 * Intelligent question extractor that parses structured test papers (e.g. Q1, Q2, (a), (b))
 * or synthesizes concept questions directly from the document text when offline.
 */
export function extractQuestionsFromText(
  text: string,
  title: string,
  subject: string,
  numQuestions: number,
  difficulty: string
): QuizGenerationResponse {
  // Normalize whitespace
  const cleanText = text.replace(/\r\n/g, "\n");

  // Check if text contains structured questions like Q1., 1., Question 1
  const qRegex = /(?:^|\n)\s*(?:Q(?:uestion)?\s*(\d+)[\.\:\)]|\b(\d+)[\.\)])\s*([\s\S]*?)(?=(?:\n\s*(?:Q(?:uestion)?\s*\d+[\.\:\)]|\b\d+[\.\)]))|$)/gi;
  const parsedQuestions: any[] = [];
  let match;

  while ((match = qRegex.exec(cleanText)) !== null && parsedQuestions.length < numQuestions) {
    const qNum = match[1] || match[2];
    const rawBody = match[3].trim();

    // Look for options like (a), (b), (c), (d), (e) or (1), (2), (3), (4) or A., B., C., D.
    const optRegex = /(?:\n|^)\s*(?:\(([a-eA-E1-5])\)|([a-eA-E1-5])[\.\)])\s*([\s\S]*?)(?=(?:\n\s*(?:\([a-eA-E1-5]\)|[a-eA-E1-5][\.\)]))|$)/g;
    const options: string[] = [];
    let optMatch;

    const firstOptIndex = rawBody.search(/(?:\n|^)\s*(?:\([a-eA-E1-5]\)|[a-eA-E1-5][\.\)])/);
    let questionText = rawBody;

    if (firstOptIndex !== -1) {
      questionText = rawBody.substring(0, firstOptIndex).trim();
      const optionsPart = rawBody.substring(firstOptIndex);
      while ((optMatch = optRegex.exec(optionsPart)) !== null) {
        const optText = optMatch[3].replace(/\s+/g, " ").trim();
        if (optText.length > 0) {
          options.push(optText);
        }
      }
    }

    if (questionText.length > 15 && options.length >= 2) {
      // Ensure exactly 4 options for NTA standard
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }
      const fourOptions = options.slice(0, 4);

      parsedQuestions.push({
        questionText: questionText.replace(/\s+/g, " ").trim(),
        options: fourOptions,
        correctAnswerIndex: 0, // default to first option if key not parsed
        explanation: `Sourced from Question ${qNum} of ${title || subject}.`,
        difficulty: (difficulty === "mixed" ? (parsedQuestions.length % 2 === 0 ? "medium" : "hard") : difficulty) as QuestionDifficulty,
        topic: subject || "Comprehensive",
        sourceReference: `Question ${qNum}`,
      });
    }
  }

  // If structured questions were found in the document, return them!
  if (parsedQuestions.length >= 1) {
    return {
      title: title || `${subject} Examination Paper`,
      description: `Official practice questions extracted from ${title || subject} document.`,
      questions: parsedQuestions,
    };
  }

  // If text is notes/syllabus without Q1/Q2 formatting, synthesize questions from key sentences
  const sentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s.length > 40 && s.length < 250);

  if (sentences.length >= 2) {
    const synthesized: any[] = [];
    const count = Math.min(numQuestions, sentences.length);

    for (let i = 0; i < count; i++) {
      const sentence = sentences[i];
      const words = sentence.split(" ");
      const keyPhrase = words.slice(0, Math.min(4, words.length)).join(" ");

      synthesized.push({
        questionText: `Based on the provided study material, which statement accurately reflects the discussion regarding "${keyPhrase}"?`,
        options: [
          sentence,
          `Contrary to the text, ${sentence.toLowerCase().replace(/ is | are | was | were /g, " is not ")}`,
          `The study material states that this principle applies only under arbitrary theoretical scenarios.`,
          `None of the above statements can be confirmed from the source material.`,
        ],
        correctAnswerIndex: 0,
        explanation: `Directly supported by the study text: "${sentence}"`,
        difficulty: (difficulty === "mixed" ? "medium" : difficulty) as QuestionDifficulty,
        topic: subject || "Study Material",
        sourceReference: `Excerpt ${i + 1}`,
      });
    }

    return {
      title: title || `${subject} Assessment`,
      description: `Assessment questions synthesized directly from the uploaded study material.`,
      questions: synthesized,
    };
  }

  // Fallback to sample bank if text was too sparse
  return generateFallbackQuestions(title, subject, numQuestions, difficulty);
}

export async function generateQuizWithGemini(
  params: GenerateQuizParams
): Promise<QuizGenerationResponse> {
  const {
    content,
    title = "Assessment Quiz",
    subject = "General Subject",
    numQuestions = 5,
    difficulty = "mixed",
    language = "English",
    customPrompt = "",
    imageBase64,
    imageMimeType,
    images = [],
    apiKey,
  } = params;

  // Check API key from params, env, or database settings
  let effectiveApiKey =
    apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!effectiveApiKey) {
    try {
      const dbCreds = await db.getAdminCredentials();
      if ((dbCreds as any)?.geminiApiKey) {
        effectiveApiKey = (dbCreds as any).geminiApiKey;
      }
    } catch {}
  }

  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const candidateModels = [preferredModel, "gemini-3.5-flash", "gemini-3.6-flash"];

  if (!effectiveApiKey) {
    console.warn("GEMINI_API_KEY not configured. Using intelligent document content parser.");
    if (content && content.length > 20) {
      return extractQuestionsFromText(content, title, subject, numQuestions, difficulty);
    }
    return generateFallbackQuestions(title, subject, numQuestions, difficulty);
  }

  try {
    const genAI = new GoogleGenerativeAI(effectiveApiKey);
    let responseText = "";

    const promptText = `
You are an expert exam paper creator for official standardized tests (similar to NTA / national examinations).
Generate high-quality multiple-choice questions based strictly on the provided study material.

EXAMINATION SPECIFICATIONS:
- Title: "${title}"
- Subject: "${subject}"
- Number of Questions requested: ${numQuestions}
- Difficulty Level: ${difficulty}
- Language: ${language}
${customPrompt ? `- Additional Instructions: ${customPrompt}` : ""}

RULES:
1. Every question must have exactly 4 answer options.
2. Only ONE option must be correct.
3. The 'correctAnswerIndex' must be 0, 1, 2, or 3 representing the index in the options array.
4. Base all questions strictly on the facts, concepts, definitions, formulas, or details present in the study material.
5. If the material is already a question paper, reproduce the exact questions and options faithfully.
6. Provide an educational explanation for the correct answer.
7. Include the topic or chapter name for each question.

OUTPUT JSON FORMAT ONLY:
{
  "title": "String",
  "description": "String",
  "questions": [
    {
      "questionText": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why Option A is correct...",
      "difficulty": "easy" | "medium" | "hard",
      "topic": "Specific subtopic",
      "sourceReference": "Section or Question Ref"
    }
  ]
}

STUDY MATERIAL:
${content ? content.substring(0, 35000) : "Refer to the attached image/document."}
`;

    const contents: any[] = [];
    if (imageBase64 && imageMimeType) {
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      });
    }
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img?.data && img?.mimeType) {
          contents.push({
            inlineData: {
              data: img.data,
              mimeType: img.mimeType,
            },
          });
        }
      }
    }
    contents.push(promptText);

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });
        const result = await model.generateContent(contents);
        responseText = result.response.text();
        if (responseText) break;
      } catch (mErr: any) {
        console.warn(`Gemini model ${modelName} error:`, mErr?.message || mErr);
      }
    }

    if (!responseText) {
      throw new Error("All Gemini candidate models failed to return content.");
    }

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleanJson);
    const validated = generatedQuizZod.parse(parsed);

    const sanitizedQuestions = validated.questions.map((q) => {
      let options = [...q.options];
      while (options.length < 4) {
        options.push(`Option ${options.length + 1}`);
      }
      if (options.length > 4) {
        options = options.slice(0, 4);
      }
      let correctIdx = Math.max(0, Math.min(3, q.correctAnswerIndex));
      return {
        ...q,
        options,
        correctAnswerIndex: correctIdx,
        difficulty: q.difficulty as QuestionDifficulty,
      };
    });

    return {
      title: validated.title || title,
      description: validated.description || `Assessment on ${subject}`,
      questions: sanitizedQuestions,
    };
  } catch (error: any) {
    console.error("Gemini AI API Call Error, falling back to document parser:", error);
    if (content && content.length > 20) {
      return extractQuestionsFromText(content, title, subject, numQuestions, difficulty);
    }
    return generateFallbackQuestions(title, subject, numQuestions, difficulty);
  }
}

/**
 * Fallback questions if no content provided
 */
export function generateFallbackQuestions(
  title: string,
  subject: string,
  count: number,
  difficulty: string
): QuizGenerationResponse {
  const sampleBank = [
    {
      questionText: `Which of the following best defines the primary principle of ${subject}?`,
      options: [
        "Systematic observation and empirical testing",
        "Subjective interpretation without verification",
        "Random selection of variables",
        "Purely theoretical extrapolation without evidence",
      ],
      correctAnswerIndex: 0,
      explanation: "Empirical verification and systematic observation form the cornerstone of the domain.",
      difficulty: "easy" as const,
      topic: `${subject} Fundamentals`,
      sourceReference: "Section 1",
    },
    {
      questionText: `Under standard methodology, how is statistical variance related to standard deviation?`,
      options: [
        "Variance is the square root of standard deviation",
        "Variance is the square of standard deviation",
        "Variance is equal to standard deviation divided by 2",
        "There is no direct mathematical relationship",
      ],
      correctAnswerIndex: 1,
      explanation: "Variance is defined as the square of the standard deviation (σ²).",
      difficulty: "medium" as const,
      topic: "Quantitative Analysis",
      sourceReference: "Section 2",
    },
    {
      questionText: `Which constitutional article or international treaty recognizes the universal right to education?`,
      options: [
        "Article 26 of Universal Declaration of Human Rights",
        "Article 5 of Geneva Convention",
        "Article 10 of Kyoto Protocol",
        "Article 15 of Rome Statute",
      ],
      correctAnswerIndex: 0,
      explanation: "Article 26 of the UDHR explicitly affirms that everyone has the right to education.",
      difficulty: "medium" as const,
      topic: "Civics & Governance",
      sourceReference: "Section 3",
    },
    {
      questionText: `What is the computational complexity of binary search on a sorted array of N elements?`,
      options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
      correctAnswerIndex: 1,
      explanation: "Binary search repeatedly halves the search interval, yielding logarithmic time O(log N).",
      difficulty: "hard" as const,
      topic: "Algorithms",
      sourceReference: "Section 4",
    },
    {
      questionText: `In cognitive learning theory, what is the highest level of Bloom's revised taxonomy?`,
      options: ["Evaluating", "Creating", "Analyzing", "Remembering"],
      correctAnswerIndex: 1,
      explanation: "In Anderson and Krathwohl's revised taxonomy, 'Creating' is the highest cognitive order.",
      difficulty: "hard" as const,
      topic: "Pedagogy",
      sourceReference: "Section 5",
    },
  ];

  return {
    title: title || `${subject} Practice Examination`,
    description: `Standardized multiple-choice assessment covering ${subject}.`,
    questions: sampleBank.slice(0, Math.min(count, sampleBank.length)),
  };
}
