"use client";

import { useCallback, useEffect, useState } from "react";

export interface TimerSpec {
  prepSeconds?: number;
  answerSeconds: number;
}

export type TimerPhase = "prep" | "answer" | "over";

interface TimerState {
  key: string;
  readyAt: number;
  answerAt: number;
}

/**
 * 限时场景的计时器：新题出现后先进入准备阶段（如有），再进入作答阶段，超时后转为超时计时。
 * key 变化（出现新题）时重新计时。
 */
export function useQuestionTimer(spec: TimerSpec | undefined, key: string | null) {
  const [state, setState] = useState<TimerState | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!spec || !key) {
      setState(null);
      return;
    }
    const readyAt = Date.now();
    setState({ key, readyAt, answerAt: readyAt + (spec.prepSeconds ?? 0) * 1000 });
    setNow(readyAt);
  }, [spec, key]);

  useEffect(() => {
    if (!state) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [state]);

  const skipPrep = useCallback(() => {
    setState((s) => (s && Date.now() < s.answerAt ? { ...s, answerAt: Date.now() } : s));
  }, []);

  /** 提交时调用：返回作答用时（秒） */
  const elapsedAnswerSec = useCallback((): number | undefined => {
    if (!state) return undefined;
    const t = Date.now();
    // 准备阶段内就提交：把从出题到提交的时间都算作作答用时
    return Math.round((t - (t <= state.answerAt ? state.readyAt : state.answerAt)) / 1000);
  }, [state]);

  if (!spec || !state) return { active: false as const, skipPrep, elapsedAnswerSec };

  let phase: TimerPhase;
  let seconds: number;
  if (now < state.answerAt) {
    phase = "prep";
    seconds = Math.ceil((state.answerAt - now) / 1000);
  } else {
    const used = Math.floor((now - state.answerAt) / 1000);
    if (used < spec.answerSeconds) {
      phase = "answer";
      seconds = spec.answerSeconds - used;
    } else {
      phase = "over";
      seconds = used - spec.answerSeconds;
    }
  }
  return { active: true as const, phase, seconds, spec, skipPrep, elapsedAnswerSec };
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
