import { parseReply, type Score } from "./parse";
import type { TranscriptMessage } from "./types";

export interface RoundScore {
  round: number;
  score: Score;
}

/** 从考官回复里按顺序提取每一轮的得分，以及总结报告的综合得分 */
export function collectScores(messages: Pick<TranscriptMessage, "role" | "content">[]): {
  rounds: RoundScore[];
  overall?: Score;
} {
  const rounds: RoundScore[] = [];
  let overall: Score | undefined;
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    const parsed = parseReply(m.content);
    if (parsed.review?.score) rounds.push({ round: rounds.length + 1, score: parsed.review.score });
    if (parsed.summary?.score) overall = parsed.summary.score;
  }
  return { rounds, overall };
}

/** 当前进度：最近一次标注的题号 */
export function currentProgress(messages: Pick<TranscriptMessage, "role" | "content">[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "assistant") continue;
    const p = parseReply(m.content).progress;
    if (p) return p;
  }
  return undefined;
}
