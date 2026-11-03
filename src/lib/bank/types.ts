export type Difficulty = 1 | 2 | 3;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = { 1: "基础", 2: "进阶", 3: "挑战" };

/** 题库中的一道题（原创仿真题，附评分要点与参考答案） */
export interface BankQuestion {
  /** 全局唯一，如 "fe-01" */
  id: string;
  scenarioId: string;
  /** 题型，如「综合分析」「系统设计」 */
  type: string;
  difficulty: Difficulty;
  /** 题目（Markdown，话题卡可用列表） */
  question: string;
  /** 评分要点 / 答题思路 */
  keyPoints: string[];
  /** 参考答案（Markdown） */
  answer: string;
}

/** 传给浏览器的轻量索引（不含题目正文与答案） */
export interface BankIndexItem {
  id: string;
  type: string;
  difficulty: Difficulty;
}
