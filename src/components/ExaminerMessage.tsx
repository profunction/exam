"use client";

import { useMemo, useState } from "react";
import { parseReply, type ParsedReview, type ParsedSummary, type Score } from "@/lib/parse";
import { Markdown } from "./Markdown";

function scoreLevel(score: Score): { text: string; className: string } {
  const ratio = score.value / score.max;
  if (score.max === 9) {
    if (score.value >= 7) return { text: "高分段", className: "text-emerald-700 dark:text-emerald-400" };
    if (score.value >= 6) return { text: "中等", className: "text-sky-700 dark:text-sky-400" };
    if (score.value >= 5) return { text: "待提升", className: "text-amber-700 dark:text-amber-400" };
    return { text: "需加强", className: "text-rose-700 dark:text-rose-400" };
  }
  if (ratio >= 0.85) return { text: "优秀", className: "text-emerald-700 dark:text-emerald-400" };
  if (ratio >= 0.7) return { text: "良好", className: "text-sky-700 dark:text-sky-400" };
  if (ratio >= 0.6) return { text: "合格", className: "text-amber-700 dark:text-amber-400" };
  return { text: "需加强", className: "text-rose-700 dark:text-rose-400" };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // 剪贴板不可用时忽略
        }
      }}
      className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--ink-2)] hover:bg-[var(--surface-muted)]"
    >
      {copied ? "已复制" : "复制范文"}
    </button>
  );
}

function ExaminerAvatar() {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white shadow-sm"
      aria-hidden="true"
    >
      🤖
    </div>
  );
}

export function ThinkingIndicator({ label = "考官正在思考…" }: { label?: string }) {
  return (
    <div className="flex items-start gap-3">
      <ExaminerAvatar />
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-3)]">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ink-3)] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ink-3)] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ink-3)]" />
        </span>
        <span role="status">{label}</span>
      </div>
    </div>
  );
}

function ReviewCard({ review, streaming }: { review: ParsedReview; streaming: boolean }) {
  const structured = review.score || review.corrections.length > 0 || review.modelAnswer;
  const level = review.score ? scoreLevel(review.score) : null;
  return (
    <section
      aria-label="上一轮表现复盘"
      className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/20"
    >
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold">📊 上一轮表现复盘</h3>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300">
          付费核心
        </span>
        <div className="ml-auto flex items-baseline gap-2">
          {review.score ? (
            <>
              <span className="text-2xl font-bold tabular-nums">{review.score.label}</span>
              {level ? <span className={`text-xs font-medium ${level.className}`}>{level.text}</span> : null}
            </>
          ) : review.scoreText ? (
            <span className="text-sm text-[var(--ink-2)]">{review.scoreText}</span>
          ) : null}
        </div>
      </header>

      {structured ? (
        <div className="mt-3 space-y-4">
          {review.corrections.length > 0 ? (
            <div>
              <h4 className="mb-1.5 text-sm font-semibold text-[var(--ink-2)]">语法与表达纠错</h4>
              <ol className="space-y-2">
                {review.corrections.map((item, i) => (
                  <li key={i} className="flex gap-2.5 rounded-lg bg-[var(--surface)] p-2.5 text-sm shadow-xs">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                      {i + 1}
                    </span>
                    <Markdown className="min-w-0 flex-1">{item}</Markdown>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {review.modelAnswer ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[var(--ink-2)]">高分参考范文</h4>
                {!streaming ? <CopyButton text={review.modelAnswer} /> : null}
              </div>
              <div className="rounded-lg border-l-4 border-emerald-500 bg-[var(--surface)] p-3 text-[15px] shadow-xs">
                <Markdown streaming={streaming}>{review.modelAnswer}</Markdown>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <Markdown className="mt-3 text-sm" streaming={streaming}>
          {review.body}
        </Markdown>
      )}
    </section>
  );
}

function SummaryCard({ summary, streaming }: { summary: ParsedSummary; streaming: boolean }) {
  const level = summary.score ? scoreLevel(summary.score) : null;
  return (
    <section
      aria-label="面试总结报告"
      className="overflow-hidden rounded-2xl border border-brand-100 bg-[var(--surface)] shadow-sm dark:border-brand-700/40"
    >
      <header className="flex flex-wrap items-end gap-3 bg-linear-to-r from-brand-600 to-violet-600 px-5 py-4 text-white">
        <div>
          <h3 className="text-base font-semibold">🏁 面试总结报告</h3>
          <p className="text-xs text-white/80">基于本场全部作答的综合评估</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-white/80">综合得分</div>
          <div className="text-3xl font-bold tabular-nums">{summary.score?.label ?? summary.scoreText ?? "—"}</div>
          {level ? <div className="text-xs font-medium text-white/90">{level.text}</div> : null}
        </div>
      </header>
      <Markdown className="px-5 py-4 text-[15px]" streaming={streaming}>
        {summary.details}
      </Markdown>
    </section>
  );
}

/** 一条考官回复：考官提问 → 上一轮复盘 → （结束时）总结报告 */
export function ExaminerMessage({ content, streaming = false }: { content: string; streaming?: boolean }) {
  const parsed = useMemo(() => parseReply(content), [content]);
  const questionStreaming = streaming && !parsed.review && !parsed.summary;
  const reviewStreaming = streaming && !parsed.summary;

  return (
    <div className="space-y-3">
      {parsed.question ? (
        <div className="flex items-start gap-3">
          <ExaminerAvatar />
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-xs font-medium text-[var(--ink-3)]">AI 考官</div>
            <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] shadow-xs">
              <Markdown streaming={questionStreaming}>{parsed.question}</Markdown>
            </div>
          </div>
        </div>
      ) : streaming ? (
        <ThinkingIndicator />
      ) : null}
      {parsed.review ? (
        <div className="sm:pl-12">
          <ReviewCard review={parsed.review} streaming={reviewStreaming} />
        </div>
      ) : null}
      {parsed.summary ? (
        <div className="sm:pl-12">
          <SummaryCard summary={parsed.summary} streaming={streaming} />
        </div>
      ) : null}
    </div>
  );
}
