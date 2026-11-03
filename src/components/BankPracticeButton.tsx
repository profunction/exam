"use client";

import { useRouter } from "next/navigation";
import { pickRandom } from "@/lib/bank/pick";
import { getScenario } from "@/lib/scenarios";
import { newId, saveSession } from "@/lib/storage";
import type { PracticeSession } from "@/lib/types";

interface Props {
  scenarioId: string;
  questionIds: string[];
  /** 从 questionIds 中随机抽取的数量；不传则按顺序全部使用 */
  count?: number;
  label: string;
  variant?: "primary" | "secondary";
}

/** 用题库题目直接开始一场练习 */
export function BankPracticeButton({ scenarioId, questionIds, count, label, variant = "primary" }: Props) {
  const router = useRouter();

  const start = () => {
    const scenario = getScenario(scenarioId);
    if (!scenario || questionIds.length === 0) return;
    const ids = count !== undefined && count < questionIds.length ? pickRandom(questionIds, count) : questionIds;
    const now = Date.now();
    const session: PracticeSession = {
      scenarioId,
      language: scenario.defaultLanguage,
      totalQuestions: ids.length,
      questionIds: ids,
      id: newId(),
      createdAt: now,
      updatedAt: now,
      messages: [],
      finished: false,
    };
    saveSession(session);
    router.push(`/session/${session.id}`);
  };

  const style =
    variant === "primary"
      ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
      : "border border-[var(--border)] text-[var(--ink-2)] hover:bg-[var(--surface-muted)]";

  return (
    <button type="button" onClick={start} className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition ${style}`}>
      {label}
    </button>
  );
}
