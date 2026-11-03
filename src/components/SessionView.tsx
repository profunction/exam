"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatError, streamChat } from "@/lib/chatClient";
import { parseReply } from "@/lib/parse";
import { CATEGORY_LABELS, resolveScenario } from "@/lib/scenarios";
import { collectScores, currentProgress } from "@/lib/scores";
import { getSession, newId, saveSession } from "@/lib/storage";
import type { ChatAction, ChatMessage, PracticeSession, SessionConfig } from "@/lib/types";
import { Composer, type ComposerHandle } from "./Composer";
import { ExaminerMessage, ThinkingIndicator } from "./ExaminerMessage";
import { ScoreChart } from "./ScoreChart";
import { formatClock, useQuestionTimer } from "./useQuestionTimer";

interface ErrorState {
  message: string;
  action: ChatAction;
}

function toConfig(s: PracticeSession): SessionConfig {
  const { scenarioId, customTitle, customDescription, language, totalQuestions, background, questionIds } = s;
  return { scenarioId, customTitle, customDescription, language, totalQuestions, background, questionIds };
}

/** 去掉末尾的考官回复后，应该用哪个动作重新生成 */
function actionForRegenerate(messages: ChatMessage[]): ChatAction {
  if (messages.length === 0) return "start";
  return messages[messages.length - 1].role === "user" ? "answer" : "finish";
}

function nearBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 240;
}

export function SessionView({ id }: { id: string }) {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null | undefined>(undefined);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const autoStarted = useRef(false);
  const composerRef = useRef<ComposerHandle>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const streaming = pending !== null;

  useEffect(() => {
    setSession(getSession(id) ?? null);
  }, [id]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const commit = useCallback((next: PracticeSession) => {
    const saved = { ...next, updatedAt: Date.now() };
    setSession(saved);
    setSaveFailed(!saveSession(saved));
  }, []);

  const run = useCallback(
    async (action: ChatAction, base: PracticeSession) => {
      autoStarted.current = true; // 任何一次生成开始后都不再自动开场，避免重复请求
      const controller = new AbortController();
      abortRef.current = controller;
      setError(null);
      setNotice(null);
      setPending("");
      let text = "";
      let servedMode: "live" | "demo" | null = null;

      const appendReply = () => {
        const reply: ChatMessage = { id: newId(), role: "assistant", content: text, createdAt: Date.now() };
        commit({
          ...base,
          messages: [...base.messages, reply],
          finished: parseReply(text).summary !== undefined,
          demo: base.demo || servedMode === "demo",
        });
      };

      try {
        const result = await streamChat(
          {
            config: toConfig(base),
            action,
            messages: base.messages.map(({ role, content, elapsedSec }) => ({ role, content, elapsedSec })),
          },
          {
            signal: controller.signal,
            onMeta: (meta) => {
              servedMode = meta.mode;
              setMode(meta.mode);
            },
            onDelta: (delta) => {
              text += delta;
              setPending(text);
            },
          },
        );
        if (!text.trim()) throw new ChatError("考官没有返回内容，请重试。", "empty");
        appendReply();
        if (result.stopReason === "max_tokens") setNotice("这条回复太长被截断了，可以点击「重新生成」。");
      } catch (err) {
        const e = err instanceof ChatError ? err : new ChatError("生成失败，请重试。", "unknown");
        if (e.code === "aborted" && text.trim()) {
          appendReply(); // 用户主动停止：保留已生成的部分
          setNotice("已停止生成。需要的话可以点击「重新生成」。");
        } else if (e.code === "aborted") {
          setError({ message: "已停止生成。", action });
        } else {
          // 出错时丢弃不完整的回复（例如中途被拒答），保持对话记录完整
          setError({ message: e.message, action });
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setPending(null);
      }
    },
    [commit],
  );

  // 新会话自动开场（延迟一帧，避免开发模式下 StrictMode 重复触发）
  useEffect(() => {
    if (!session || session.messages.length > 0 || autoStarted.current) return;
    const timer = window.setTimeout(() => {
      if (!autoStarted.current) void run("start", session);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [session, run]);

  // 有新内容时，若用户停留在底部则自动滚动
  useEffect(() => {
    if (nearBottom()) endRef.current?.scrollIntoView({ block: "end" });
  }, [pending, session?.messages.length]);

  const scenario = useMemo(() => (session ? resolveScenario(session) : null), [session]);
  const scores = useMemo(() => collectScores(session?.messages ?? []), [session?.messages]);
  const progress = useMemo(() => currentProgress(session?.messages ?? []), [session?.messages]);

  const lastMessage = session?.messages[session.messages.length - 1];
  const awaitingAnswer = !!session && !session.finished && lastMessage?.role === "assistant" && !streaming;
  const timerKey = awaitingAnswer && lastMessage ? lastMessage.id : null;
  const timer = useQuestionTimer(scenario?.timer, timerKey);

  if (session === undefined) {
    return <div className="p-10 text-center text-[var(--ink-3)]">加载中…</div>;
  }
  if (session === null || !scenario) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-lg font-semibold">找不到这场练习</p>
        <p className="mt-2 text-sm text-[var(--ink-3)]">练习记录只保存在当前浏览器里，换了设备或清除了浏览器数据就会丢失。</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white">
          返回首页
        </Link>
      </div>
    );
  }

  const answered = session.messages.filter((m) => m.role === "user").length;
  const total = session.totalQuestions;
  const scoreMax = scenario.scoreScale === "ielts" ? 9 : 100;
  const demo = mode === "demo" || session.demo;

  const send = (text: string) => {
    if (!session || streaming) return;
    const elapsedSec = scenario.timer ? timer.elapsedAnswerSec() : undefined;
    const msg: ChatMessage = {
      id: newId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      ...(elapsedSec !== undefined ? { elapsedSec } : {}),
    };
    const next = { ...session, messages: [...session.messages, msg] };
    commit(next);
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }));
    void run("answer", next);
  };

  const retry = () => {
    if (!error) return;
    void run(error.action, session);
  };

  const undoLastAnswer = () => {
    const last = session.messages[session.messages.length - 1];
    if (!last || last.role !== "user") return;
    commit({ ...session, messages: session.messages.slice(0, -1) });
    setError(null);
    composerRef.current?.setText(last.content);
    composerRef.current?.focus();
  };

  const regenerate = () => {
    const last = session.messages[session.messages.length - 1];
    if (!last || last.role !== "assistant" || streaming) return;
    const trimmed = { ...session, messages: session.messages.slice(0, -1), finished: false };
    commit(trimmed);
    void run(actionForRegenerate(trimmed.messages), trimmed);
  };

  const finish = () => {
    if (streaming || session.finished) return;
    void run("finish", session);
  };

  const restart = () => {
    const now = Date.now();
    const fresh: PracticeSession = { ...toConfig(session), id: newId(), createdAt: now, updatedAt: now, messages: [], finished: false };
    saveSession(fresh);
    router.push(`/session/${fresh.id}`);
  };

  const timerTone = !timer.active
    ? ""
    : timer.phase === "over"
      ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-[#2a1418] dark:text-rose-300"
      : timer.phase === "prep"
        ? "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-[#0f2030] dark:text-sky-200"
        : "border-[var(--border)] bg-[var(--surface)]";
  const timerLabel = !timer.active ? "" : timer.phase === "prep" ? "准备时间" : timer.phase === "answer" ? "作答剩余" : "已超时";
  const timerClock = timer.active ? `${timer.phase === "over" ? "+" : ""}${formatClock(timer.seconds)}` : "";
  const skipButton =
    timer.active && timer.phase === "prep" ? (
      <button type="button" onClick={timer.skipPrep} className="rounded-md border border-current/30 px-2 py-0.5 text-xs font-medium">
        开始作答
      </button>
    ) : null;

  const timerPanel = timer.active ? (
    <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${timerTone}`} role="timer" aria-live="off">
      <div>
        <div className="text-xs font-medium opacity-80">{timerLabel}</div>
        <div className="text-2xl font-bold tabular-nums">{timerClock}</div>
      </div>
      <div className="space-y-1 text-right text-xs opacity-80">
        {timer.spec.prepSeconds ? <div>准备 {formatClock(timer.spec.prepSeconds)}</div> : null}
        <div>作答 {formatClock(timer.spec.answerSeconds)}</div>
        {skipButton}
      </div>
    </div>
  ) : null;

  /** 小屏幕上的单行计时条 */
  const timerBar = timer.active ? (
    <div className={`flex items-center gap-3 rounded-xl border px-3 py-1.5 text-sm ${timerTone}`} role="timer" aria-live="off">
      <span className="text-xs font-medium opacity-80">{timerLabel}</span>
      <span className="font-bold tabular-nums">{timerClock}</span>
      <span className="ml-auto text-xs opacity-70">限时 {formatClock(timer.spec.answerSeconds)}</span>
      {skipButton}
    </div>
  ) : null;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--page)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full p-1.5 text-[var(--ink-2)] hover:bg-[var(--surface-muted)]" aria-label="返回首页">
            <span aria-hidden="true">←</span>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold">
              <span aria-hidden="true">{scenario.emoji} </span>
              {scenario.title}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[var(--ink-3)]">
              <span>{CATEGORY_LABELS[scenario.category]}</span>
              <span aria-hidden="true">·</span>
              <span>{session.language === "en" ? "英文面试" : "中文面试"}</span>
              <span aria-hidden="true">·</span>
              <span>
                已答 {answered}/{total} 题{progress && !session.finished ? `（当前第 ${Math.min(progress.current, total)} 题）` : ""}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={streaming || session.finished || answered === 0}
            title={answered === 0 ? "至少完成一道题后才能生成报告" : undefined}
            className="hidden rounded-full border border-[var(--border)] px-3.5 py-1.5 text-sm font-medium hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
          >
            结束并出报告
          </button>
        </div>
        <div className="h-0.5 bg-[var(--surface-muted)]">
          <div
            className="h-full bg-brand-600 transition-[width] duration-500"
            style={{ width: `${Math.min(100, (answered / total) * 100)}%` }}
          />
        </div>
      </header>

      {demo ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          演示模式：服务端未配置 ANTHROPIC_API_KEY，题目与点评为固定示例。配置后即可获得 AI 考官的真实评估。
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <ol className="space-y-6" aria-label="面试对话">
            {session.messages.map((m, i) => {
              const isLast = i === session.messages.length - 1;
              return (
                <li key={m.id}>
                  {m.role === "assistant" ? (
                    <div>
                      <ExaminerMessage content={m.content} />
                      {isLast && !streaming ? (
                        <div className="mt-2 flex justify-end sm:pl-12">
                          <button
                            type="button"
                            onClick={regenerate}
                            className="rounded-md px-2 py-1 text-xs text-[var(--ink-3)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink-2)]"
                          >
                            ↻ 重新生成
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="mb-1 text-xs font-medium text-[var(--ink-3)]">我的回答</div>
                      <div className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-[15px] leading-relaxed text-white shadow-sm">
                        {m.content}
                      </div>
                      {typeof m.elapsedSec === "number" && scenario.timer ? (
                        <div
                          className={`mt-1 text-xs tabular-nums ${
                            m.elapsedSec > scenario.timer.answerSeconds ? "text-rose-600 dark:text-rose-400" : "text-[var(--ink-3)]"
                          }`}
                        >
                          用时 {formatClock(m.elapsedSec)}
                          {m.elapsedSec > scenario.timer.answerSeconds ? "（超时）" : ""}
                        </div>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
            {pending !== null ? (
              <li aria-live="polite" aria-busy="true">
                {pending ? <ExaminerMessage content={pending} streaming /> : <ThinkingIndicator />}
              </li>
            ) : null}
          </ol>

          {error ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
            >
              <p>{error.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={retry} className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-medium text-white">
                  重试
                </button>
                {error.action === "answer" ? (
                  <button
                    type="button"
                    onClick={undoLastAnswer}
                    className="rounded-full border border-rose-300 px-4 py-1.5 text-xs font-medium dark:border-rose-800"
                  >
                    撤回回答并修改
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {notice ? <p className="mt-4 text-center text-xs text-[var(--ink-3)]">{notice}</p> : null}
          {saveFailed ? (
            <p className="mt-4 text-center text-xs text-amber-700 dark:text-amber-400">浏览器禁止了本地存储，本场记录不会被保存。</p>
          ) : null}

          <div ref={endRef} className="h-4" />

          <div className="sticky bottom-0 z-10 -mx-4 bg-[var(--page)] px-4 pb-3 pt-2 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-[var(--page)] before:to-transparent sm:pb-4">
            {session.finished ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <p className="font-semibold">本场练习已结束 🎉</p>
                <p className="mt-1 text-sm text-[var(--ink-3)]">报告已保存在本机，可随时从首页回看。</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    {session.questionIds?.length ? "同样题目再练一遍" : "同样设置再练一场"}
                  </button>
                  <Link href="/" className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]">
                    换个场景
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="lg:hidden">{timerBar}</div>
                <Composer
                  ref={composerRef}
                  language={session.language}
                  disabled={session.messages.length === 0 || (!!error && error.action === "answer")}
                  streaming={streaming}
                  onSend={send}
                  onStop={() => abortRef.current?.abort()}
                />
                <div className="flex justify-end sm:hidden">
                  <button
                    type="button"
                    onClick={finish}
                    disabled={streaming || answered === 0}
                    className="text-xs text-[var(--ink-3)] underline disabled:opacity-40"
                  >
                    结束并出报告
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="练习数据">
          <div className="hidden lg:block">{timerPanel}</div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">成绩曲线</h2>
              {scores.overall ? (
                <span className="text-xs text-[var(--ink-3)]">
                  综合 <strong className="text-[var(--ink)]">{scores.overall.label}</strong>
                </span>
              ) : null}
            </div>
            <ScoreChart rounds={scores.rounds} max={scoreMax} />
            {scores.rounds.length > 0 ? (
              <table className="mt-3 w-full text-sm">
                <caption className="sr-only">每题得分</caption>
                <thead>
                  <tr className="text-left text-xs text-[var(--ink-3)]">
                    <th className="pb-1 font-medium">题目</th>
                    <th className="pb-1 text-right font-medium">得分</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.rounds.map((r) => (
                    <tr key={r.round} className="border-t border-[var(--border)]">
                      <td className="py-1.5 text-[var(--ink-2)]">第 {r.round} 题</td>
                      <td className="py-1.5 text-right font-medium tabular-nums">{r.score.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </section>

          {session.questionIds?.length ? (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h2 className="text-sm font-semibold">本场题目来自题库</h2>
              <p className="mt-1 text-xs text-[var(--ink-3)]">答完后可以对照评分要点和参考答案复盘。</p>
              <ul className="mt-2 space-y-1 text-sm">
                {session.questionIds.map((qid, i) => (
                  <li key={qid}>
                    <a
                      href={`/bank/${session.scenarioId}#${qid}`}
                      target="_blank"
                      rel="noopener"
                      className="text-brand-600 hover:underline"
                    >
                      第 {i + 1} 题参考答案 ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="mb-2 text-sm font-semibold">答题技巧</h2>
            <ul className="space-y-1.5 text-sm text-[var(--ink-2)]">
              {scenario.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-brand-600" aria-hidden="true">
                    •
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
