"use client"

import React from "react"
import type { FullSubjectData } from "@/lib/mold-types"
import { formatLabel } from "@/lib/mold-types"
import { RichText } from "@/components/mold/common/rich-text"

interface PrintLayoutProps {
  subject: FullSubjectData
}

export function PrintLayout({ subject }: PrintLayoutProps) {
  // Derive unique categories from questions to list them in the meta section
  const categories = Array.from(new Set(subject.questions.map((q) => q.category)))

  return (
    <div className="print-only p-8 font-sans text-black bg-white">
      {/* ─── COVER / HEADER PAGE ────────────────────────────────────────── */}
      <div className="border-b-2 border-black pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tight uppercase">
              {subject.name} Revision Sheet
            </h1>
            <p className="text-sm text-gray-700 mt-1 font-mono">
              Generated via Finalist Study System
            </p>
          </div>
          <div className="text-right font-mono text-xs text-gray-600 border border-gray-400 p-2">
            <div>DATE: {new Date().toLocaleDateString()}</div>
            <div>QUESTIONS: {subject.questions.length}</div>
          </div>
        </div>

        <div className="mt-4 text-sm leading-relaxed max-w-3xl">
          {subject.config.description}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
          <span className="font-bold">CATEGORIES:</span>
          {categories.map((c, i) => (
            <span key={c} className="bg-gray-100 border border-gray-300 px-2 py-0.5">
              {formatLabel(c)}{i < categories.length - 1 ? "" : ""}
            </span>
          ))}
        </div>
      </div>

      {/* ─── SECTION 1: QUESTIONS ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold font-mono uppercase tracking-wider border-b border-black pb-2 mb-6">
          Section 1: Questions & Scenarios
        </h2>

        <div className="space-y-8">
          {subject.questions.map((q, idx) => {
            return (
              <div 
                key={q.id} 
                id={`q-${q.id}`} 
                className="keep-together border-l border-gray-200 pl-4 py-1"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-2 font-mono text-xs text-gray-500">
                  <span>
                    QUESTION {idx + 1} // {q.difficulty.toUpperCase()} // {formatLabel(q.category).toUpperCase()}
                  </span>
                  <a 
                    href={`#ans-${q.id}`} 
                    className="text-blue-600 hover:underline hover:text-blue-800 font-bold"
                  >
                    [Go to Answer]
                  </a>
                </div>

                {/* Question Text */}
                <div className="text-base font-semibold leading-relaxed mb-4">
                  <RichText content={q.question} id={`print-q-${q.id}`} />
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                  {q.options.map((opt) => (
                    <div key={opt.label} className="flex items-start gap-2.5 text-sm">
                      <span className="font-mono border border-gray-400 w-5 h-5 flex items-center justify-center shrink-0 text-xs">
                        {opt.label}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 2: ANSWER KEY ──────────────────────────────────────── */}
      <div className="page-break-before pt-8">
        <h2 className="text-xl font-bold font-mono uppercase tracking-wider border-b border-black pb-2 mb-6">
          Section 2: Answer Key & Explanations
        </h2>

        <div className="space-y-8">
          {subject.questions.map((q, idx) => (
            <div 
              key={`ans-key-${q.id}`} 
              id={`ans-${q.id}`} 
              className="keep-together border-b border-gray-100 pb-6 mb-6"
            >
              {/* Answer Header */}
              <div className="flex justify-between items-start mb-3 font-mono text-xs text-gray-500">
                <span>
                  ANSWER KEY: QUESTION {idx + 1}
                </span>
                <a 
                  href={`#q-${q.id}`} 
                  className="text-blue-600 hover:underline hover:text-blue-800 font-bold"
                >
                  [Back to Question]
                </a>
              </div>

              {/* Correct Answer */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs text-gray-600 font-bold">CORRECT CHOICE:</span>
                <span className="font-mono text-lg font-bold border-2 border-black w-8 h-8 flex items-center justify-center bg-gray-100">
                  {q.answer}
                </span>
                <span className="text-sm font-semibold">
                  {q.options.find(o => o.label === q.answer)?.text}
                </span>
              </div>

              {/* Hint Box */}
              {q.hint && (
                <div className="bg-gray-50 border-l-4 border-yellow-500 p-3 mb-3 text-sm">
                  <div className="font-mono text-xs font-bold text-yellow-700 uppercase mb-1">
                    Socratic Hint
                  </div>
                  <div className="italic text-gray-700">
                    <RichText content={q.hint} id={`print-h-${q.id}`} />
                  </div>
                </div>
              )}

              {/* Explanation Box */}
              {q.explanation && (
                <div className="bg-gray-50 border-l-4 border-blue-500 p-3 text-sm">
                  <div className="font-mono text-xs font-bold text-blue-700 uppercase mb-1">
                    Metacognitive Explanation
                  </div>
                  <div className="text-gray-800 leading-relaxed">
                    <RichText content={q.explanation} id={`print-e-${q.id}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
