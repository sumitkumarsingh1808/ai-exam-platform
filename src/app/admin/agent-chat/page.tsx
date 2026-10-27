"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Plus,
  BookOpen,
  ArrowRight,
  Calculator,
  Languages,
  Brain,
  Building2,
  Cpu,
  Trash2,
  FileCheck2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GeneratedQuestion } from "@/lib/agent-chat";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  questions?: GeneratedQuestion[];
  suggestedPrompts?: string[];
  timestamp: string;
}

const PRESET_TOPICS = [
  { label: "Quantitative Aptitude", icon: Calculator, prompt: "Generate 5 Quantitative Aptitude questions on Time, Work and Distance with formulas and full solutions." },
  { label: "English Comprehension", icon: Languages, prompt: "Generate 5 English Language questions covering Error Spotting, Idioms, and Vocabulary." },
  { label: "Logical Reasoning", icon: Brain, prompt: "Generate 5 Logical Reasoning questions on Blood Relations, Syllogisms, and Number Series." },
  { label: "Banking & Finance", icon: Building2, prompt: "Generate 5 General Awareness questions on Indian Banking System, RBI Monetary Policy, and Inflation." },
  { label: "Computer Aptitude", icon: Cpu, prompt: "Generate 5 Computer Knowledge questions on Networking, OS, and Data Structures." },
];

export default function AgentChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content:
        "Hello! I am your NTA Examination Paper AI Agent. You can ask me to generate questions for any subject, exam level, or topic (e.g. 'generate 5 apti questions on profit and loss', 'give me 5 hard english reading comprehension questions', or 'create reasoning puzzles'). What kind of questions would you like to prepare today?",
      suggestedPrompts: [
        "Generate 5 Quantitative Aptitude questions on Percentages & Profit/Loss",
        "Generate 5 English Vocabulary and Error Detection questions",
        "Generate 5 Logical Reasoning Syllogism questions",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState("Quantitative Aptitude");

  // Save as Exam Modal State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [examToSave, setExamToSave] = useState<{
    title: string;
    subject: string;
    category: string;
    isDailyPaper: boolean;
    durationMinutes: number;
    questions: GeneratedQuestion[];
  } | null>(null);
  const [isSavingExam, setIsSavingExam] = useState(false);
  const [savedExamResult, setSavedExamResult] = useState<{ id: string; title: string } | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: textToSend.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    if (!customText) setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          numQuestions: numQuestions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to receive response from AI Agent.");
      }

      const assistantMsgId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: data.reply || "Questions generated successfully.",
          questions: data.questions || [],
          suggestedPrompts: data.suggestedPrompts || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Note: ${err.message || "An issue occurred while connecting to the agent."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openSaveExamModal = (questions: GeneratedQuestion[], defaultTopic?: string) => {
    const topic = defaultTopic || selectedSubject || "General";
    const lowerTopic = topic.toLowerCase();
    const defaultCat =
      lowerTopic.includes("bank") || lowerTopic.includes("quant") || lowerTopic.includes("apti")
        ? "Banking"
        : lowerTopic.includes("ugc") || lowerTopic.includes("net") || lowerTopic.includes("research") || lowerTopic.includes("teach")
        ? "UGC NET"
        : "Banking";

    setExamToSave({
      title: `${topic} Mock Examination - ${new Date().toLocaleDateString()}`,
      subject: topic,
      category: defaultCat,
      isDailyPaper: false,
      durationMinutes: Math.max(15, questions.length * 2),
      questions,
    });
    setSavedExamResult(null);
    setSaveModalOpen(true);
  };

  const handleConfirmSaveExam = async () => {
    if (!examToSave || examToSave.questions.length === 0) return;
    setIsSavingExam(true);

    try {
      const res = await fetch("/api/admin/agent-chat/save-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: examToSave.title,
          subject: examToSave.subject,
          category: examToSave.category,
          isDailyPaper: examToSave.isDailyPaper,
          durationMinutes: examToSave.durationMinutes,
          status: "published",
          marksPerQuestion: 4,
          negativeMarks: 1,
          questions: examToSave.questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish exam paper.");
      }

      setSavedExamResult({
        id: data.quiz.id,
        title: data.quiz.title,
      });
    } catch (err: any) {
      alert(err.message || "Could not save exam paper.");
    } finally {
      setIsSavingExam(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                AI Examination Paper Agent
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Gemini 3.5 Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Prompt in natural language for Aptitude, English, Reasoning, Banking, or Custom Exam Questions
            </p>
          </div>
        </div>

        {/* Quick Config Bar */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Count:</span>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="3">3 Questions</option>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Target:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Quantitative Aptitude">Aptitude (Quant)</option>
              <option value="English Language & Comprehension">English Language</option>
              <option value="Logical Reasoning">Logical Reasoning</option>
              <option value="General Awareness & Banking">General Awareness</option>
              <option value="Computer Aptitude">Computer Aptitude</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preset Topics Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Fast Topics:
        </span>
        {PRESET_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.label}
              onClick={() => {
                setSelectedSubject(topic.label);
                handleSendMessage(topic.prompt);
              }}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-medium whitespace-nowrap shadow-xs transition-colors disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-blue-600" />
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Header info */}
            <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
              {msg.role === "assistant" ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    AI
                  </div>
                  <span className="font-semibold text-slate-700">NTA Exam Agent</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-700">You (Controller)</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-3xl rounded-2xl p-4 shadow-xs text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

              {/* Render Structured Questions if available */}
              {msg.questions && msg.questions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {msg.questions.length}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        Questions Formatted for Examination Paper
                      </span>
                    </div>

                    <button
                      onClick={() => openSaveExamModal(msg.questions!, selectedSubject)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Publish as Exam Paper</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {msg.questions.map((q, qIndex) => {
                      const cardId = `${msg.id}-q-${qIndex}`;
                      const isExpanded = expandedCards[cardId] ?? true;

                      return (
                        <div
                          key={cardId}
                          className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                Q{qIndex + 1}
                              </span>
                              <div>
                                <h4 className="text-slate-900 font-semibold text-sm leading-snug">
                                  {q.questionText}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                    {q.topic || selectedSubject}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                      q.difficulty === "easy"
                                        ? "bg-green-100 text-green-800"
                                        : q.difficulty === "hard"
                                        ? "bg-rose-100 text-rose-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {q.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  handleCopyQuestion(
                                    `Q: ${q.questionText}\n` +
                                      q.options.map((opt, i) => `(${String.fromCharCode(65 + i)}) ${opt}`).join("\n") +
                                      `\nCorrect: (${String.fromCharCode(65 + q.correctAnswerIndex)})\nExplanation: ${q.explanation}`,
                                    cardId
                                  )
                                }
                                title="Copy Question text"
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded"
                              >
                                {copiedIndex === cardId ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => toggleCardExpand(cardId)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-3.5 space-y-2 border-t border-slate-200/60 pt-3">
                              {/* Options */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options.map((opt, optIndex) => {
                                  const isCorrect = optIndex === q.correctAnswerIndex;
                                  return (
                                    <div
                                      key={optIndex}
                                      className={`flex items-center space-x-2.5 p-2 rounded-lg text-xs font-medium border ${
                                        isCorrect
                                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                                          : "bg-white border-slate-200 text-slate-700"
                                      }`}
                                    >
                                      <span
                                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                          isCorrect
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-200 text-slate-700"
                                        }`}
                                      >
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <span className="flex-1">{opt}</span>
                                      {isCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Explanation */}
                              {q.explanation && (
                                <div className="mt-2.5 bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-lg text-xs text-amber-900 leading-relaxed">
                                  <span className="font-bold text-amber-950 block mb-0.5">
                                    💡 Solution & Explanation:
                                  </span>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts pills */}
            {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-3xl">
                {msg.suggestedPrompts.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    disabled={isLoading}
                    className="text-xs bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-3 py-1 rounded-full shadow-2xs font-medium transition-colors disabled:opacity-50 text-left"
                  >
                    ⚡ {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
              AI
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs text-xs text-slate-600 flex items-center space-x-3">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>
                Gemini AI Agent is synthesizing standardized examination questions and explanations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock */}
      <div className="bg-white border-t border-slate-200 p-4 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex items-end space-x-3"
        >
          <div className="flex-1 relative">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="e.g. Generate 5 aptitude questions on time and work with step-by-step solutions..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-400">
              Shift + Enter for new line
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Generate</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Save Exam Paper Modal */}
      {saveModalOpen && examToSave && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            {savedExamResult ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Examination Paper Published!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    "{savedExamResult.title}" is now active in the examination portal for candidate attempts.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={`/exam/${savedExamResult.id}`}
                    target="_blank"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Attempt Examination (CBT Screen)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/admin/quizzes"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>View in Quiz Management</span>
                  </Link>
                  <button
                    onClick={() => {
                      setSaveModalOpen(false);
                      setSavedExamResult(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 mt-1 font-semibold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2 text-slate-900">
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-base">Publish Examination Paper</h3>
                  </div>
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Examination Title:
                    </label>
                    <input
                      type="text"
                      value={examToSave.title}
                      onChange={(e) =>
                        setExamToSave({ ...examToSave, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Subject:
                      </label>
                      <input
                        type="text"
                        value={examToSave.subject}
                        onChange={(e) =>
                          setExamToSave({ ...examToSave, subject: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Duration (Minutes):
                      </label>
                      <input
                        type="number"
                        value={examToSave.durationMinutes}
                        onChange={(e) =>
                          setExamToSave({
                            ...examToSave,
                            durationMinutes: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Stream / Category:
                      </label>
                      <select
                        value={examToSave.category}
                        onChange={(e) =>
                          setExamToSave({ ...examToSave, category: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                      >
                        <option value="Banking">Banking</option>
                        <option value="UGC NET">UGC NET</option>
                        <option value="Engineering & GATE">Engineering &amp; GATE</option>
                        <option value="Civil Services / UPSC">Civil Services / UPSC</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-bold text-[11px] bg-amber-50 p-2 rounded-lg border border-amber-200 w-full">
                        <input
                          type="checkbox"
                          checked={examToSave.isDailyPaper}
                          onChange={(e) =>
                            setExamToSave({ ...examToSave, isDailyPaper: e.target.checked })
                          }
                          className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                        />
                        <span>🌟 Today&apos;s Target Task</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Questions to Publish:</span>
                      <span className="font-bold text-slate-900">
                        {examToSave.questions.length} Questions
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-1">
                      <span>Standard Marking Scheme:</span>
                      <span className="font-bold text-slate-900">
                        +4 for correct, -1 for incorrect
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSaveExam}
                    disabled={isSavingExam || !examToSave.title.trim()}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isSavingExam ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Publish Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
