"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS, SCENARIOS, resolveScenario, type Scenario, type ScenarioCategory } from "@/lib/scenarios";
import { collectScores } from "@/lib/scores";
import { deleteSession, listSessions, newId, saveSession } from "@/lib/storage";
import type { PracticeSession, SessionConfig } from "@/lib/types";
import { SetupDialog } from "./SetupDialog";
import { useServiceMode } from "./useServiceMode";

type Filter = "all" | ScenarioCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "job", label: CATEGORY_LABELS.job },
  { id: "cert", label: CATEGORY_LABELS.cert },
  { id: "civil", label: CATEGORY_LABELS.civil },
  { id: "language", label: CATEGORY_LABELS.language },
];

const FEATURES = [
  { icon: "🎯", title: "实时评分", text: "每答完一题立刻给分，雅思按官方分数档，其余按百分制。" },
  { icon: "🩺", title: "痛点纠错", text: "逐句指出语法、用词、逻辑和扣题问题，并给出修改建议。" },
  { icon: "📝", title: "高分范文", text: "基于你自己的回答润色出高分参考答案，一键复制背诵。" },
];

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function HistoryItem({ session, onDelete }: { session: PracticeSession; onDelete: () => void }) {
  const scenario = resolveScenario(session);
  const answered = session.messages.filter((m) => m.role === "user").length;
  const { rounds, overall } = collectScores(session.messages);
  const lastScore = overall ?? rounds[rounds.length - 1]?.score;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
      <span className="text-2xl" aria-hidden="true">
        {scenario.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{scenario.title}</span>
          {session.finished ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              已完成
            </span>
          ) : (
            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300">
              进行中
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-[var(--ink-3)]">
          {formatDate(session.updatedAt)} · 已答 {answered}/{session.totalQuestions} 题
          {lastScore ? ` · ${overall ? "综合" : "最近"} ${lastScore.label}` : ""}
        </div>
      </div>
      <Link
        href={`/session/${session.id}`}
        className="shrink-0 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
      >
        {session.finished ? "查看报告" : "继续练习"}
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-full p-1.5 text-[var(--ink-3)] hover:bg-[var(--surface-muted)] hover:text-rose-600"
        aria-label={`删除「${scenario.title}」的练习记录`}
      >
        <span aria-hidden="true">🗑</span>
      </button>
    </li>
  );
}

function ScenarioCard({ scenario, onPick }: { scenario: Scenario; onPick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        className="group flex h-full w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-brand-500/60 hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-3xl" aria-hidden="true">
            {scenario.emoji}
          </span>
          <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--ink-2)]">
            {CATEGORY_LABELS[scenario.category]}
          </span>
        </div>
        <h3 className="mt-3 font-semibold">{scenario.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-[var(--ink-3)]">{scenario.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-600/20 dark:text-brand-100">
            {scenario.defaultLanguage === "en" ? "English" : "中文"}
          </span>
          {scenario.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[11px] text-[var(--ink-2)]">
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-auto pt-4 text-sm font-medium text-brand-600 group-hover:underline">开始对练 →</span>
      </button>
    </li>
  );
}

export function HomeView() {
  const router = useRouter();
  const mode = useServiceMode();
  const [filter, setFilter] = useState<Filter>("all");
  const [picked, setPicked] = useState<Scenario | null>(null);
  const [custom, setCustom] = useState(false);
  const [history, setHistory] = useState<PracticeSession[]>([]);

  useEffect(() => {
    setHistory(listSessions());
  }, []);

  const scenarios = useMemo(() => (filter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.category === filter)), [filter]);

  const start = (config: SessionConfig) => {
    const now = Date.now();
    const session: PracticeSession = { ...config, id: newId(), createdAt: now, updatedAt: now, messages: [], finished: false };
    saveSession(session);
    router.push(`/session/${session.id}`);
  };

  const remove = (id: string) => {
    deleteSession(id);
    setHistory(listSessions());
  };

  return (
    <div className="min-h-dvh">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white" aria-hidden="true">
            🤖
          </span>
          <span className="font-semibold">AI 考官</span>
          <span className="hidden text-sm text-[var(--ink-3)] sm:inline">面试 · 考证真题模拟对练</span>
          {mode === "demo" ? (
            <span className="ml-auto rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
              演示模式
            </span>
          ) : mode === "live" ? (
            <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              AI 考官在线
            </span>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-10 sm:py-14">
          <p className="text-sm font-medium text-brand-600">垂直面试 / 考证真题 AI 模拟对练</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            跟 AI 考官一对一练真题，
            <br className="hidden sm:block" />
            每答一题都有评分、纠错和高分范文
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
            选择场景，AI 考官会像真实考场一样逐题提问。外企与雅思全英文对话，考公教资严肃规范，限时题目自动计时。
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <span aria-hidden="true">{f.icon}</span>
                  {f.title}
                </div>
                <p className="mt-1 text-sm text-[var(--ink-3)]">{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {history.length > 0 ? (
          <section className="mb-10" aria-labelledby="history-title">
            <h2 id="history-title" className="mb-3 text-lg font-semibold">
              最近的练习
            </h2>
            <ul className="space-y-2">
              {history.slice(0, 5).map((s) => (
                <HistoryItem key={s.id} session={s} onDelete={() => remove(s.id)} />
              ))}
            </ul>
            <p className="mt-2 text-xs text-[var(--ink-3)]">练习记录只保存在当前浏览器中。</p>
          </section>
        ) : null}

        <section aria-labelledby="scenarios-title">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="scenarios-title" className="text-lg font-semibold">
              选择练习场景
            </h2>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="按类别筛选">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    filter === f.id
                      ? "bg-[var(--ink)] text-[var(--page)]"
                      : "border border-[var(--border)] text-[var(--ink-2)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} onPick={() => setPicked(s)} />
            ))}
            <li>
              <button
                type="button"
                onClick={() => setCustom(true)}
                className="flex h-full min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] p-5 text-center transition hover:border-brand-500/60 hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                <span className="text-3xl" aria-hidden="true">
                  ✨
                </span>
                <span className="mt-2 font-semibold">自定义场景</span>
                <span className="mt-1 text-sm text-[var(--ink-3)]">考研复试、银行面试、托福口语……描述一下就能练</span>
              </button>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--ink-3)]">
        AI 考官的评分与范文仅供练习参考，不代表任何官方考试的评分结果。
      </footer>

      <SetupDialog
        scenario={picked}
        custom={custom}
        onClose={() => {
          setPicked(null);
          setCustom(false);
        }}
        onStart={start}
      />
    </div>
  );
}
