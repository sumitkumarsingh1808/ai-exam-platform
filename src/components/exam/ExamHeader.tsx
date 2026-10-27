"use client";

import { useState } from "react";
import { Clock, Globe, FileText, HelpCircle, LogOut } from "lucide-react";
import { formatTimeLeft } from "@/lib/utils";

interface ExamHeaderProps {
  quizTitle: string;
  subject: string;
  candidateName: string;
  candidateRoll: string;
  candidatePhoto?: string;
  timeLeftSeconds: number;
  language: string;
  onLanguageChange: (lang: string) => void;
  onViewInstructions: () => void;
  onViewQuestionPaper: () => void;
  onSubmitClick: () => void;
}

export function ExamHeader({
  quizTitle,
  subject,
  candidateName,
  candidateRoll,
  candidatePhoto,
  timeLeftSeconds,
  language,
  onLanguageChange,
  onViewInstructions,
  onViewQuestionPaper,
  onSubmitClick,
}: ExamHeaderProps) {
  const isTimeCritical = timeLeftSeconds < 300; // Less than 5 mins

  return (
    <header className="bg-white border-b-2 border-blue-600 shadow-sm sticky top-0 z-30 select-none">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold tracking-wide">
            NATIONAL TESTING AGENCY (NTA) — COMPUTER BASED TEST (CBT)
          </span>
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <span>Server Status: Online & Encrypted</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Exam and Subject Name */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-11 h-11 bg-blue-700 text-white rounded flex items-center justify-center font-black text-lg shadow-inner">
            NTA
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1">
              {quizTitle}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-blue-700">Subject: {subject}</span>
              <span>•</span>
              <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-medium">
                Official Paper
              </span>
            </div>
          </div>
        </div>

        {/* Center: Prominent Digital Countdown Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg border-2 shadow-inner transition-colors ${
              isTimeCritical
                ? "bg-red-50 border-red-500 text-red-700 animate-pulse"
                : "bg-slate-900 border-slate-700 text-white"
            }`}
          >
            <Clock className={`w-5 h-5 ${isTimeCritical ? "text-red-600" : "text-amber-400"}`} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">
                Time Left
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-amber-300">
                {formatTimeLeft(timeLeftSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Candidate Info & Tools */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          {/* Quick links */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onViewInstructions}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Instructions
            </button>
            <button
              onClick={onViewQuestionPaper}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 rounded border border-slate-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Question Paper
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded border border-slate-300 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent border-none text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Candidate Card */}
          <div className="flex items-center space-x-2.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md">
            <img
              src={
                candidatePhoto ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt="Candidate"
              className="w-8 h-8 rounded-full border border-blue-300 object-cover"
            />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900 leading-tight line-clamp-1">{candidateName}</p>
              <p className="text-[11px] text-blue-800 font-mono">Roll: {candidateRoll}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
