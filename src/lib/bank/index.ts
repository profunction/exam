import "server-only";

import { BANK_SOE } from "./data/bank-soe";
import { BEHAVIORAL_EN } from "./data/behavioral-en";
import { CET_SPEAKING } from "./data/cet-speaking";
import { CIVIL_SERVICE } from "./data/civil-service";
import { FOREIGN_BACKEND } from "./data/foreign-backend";
import { FOREIGN_FRONTEND } from "./data/foreign-frontend";
import { FOREIGN_PM } from "./data/foreign-pm";
import { GRAD_RETEST } from "./data/grad-retest";
import { IELTS_PART1 } from "./data/ielts-part1";
import { IELTS_PART2 } from "./data/ielts-part2";
import { IELTS_PART3 } from "./data/ielts-part3";
import { PUBLIC_INSTITUTION } from "./data/public-institution";
import { TEACHER_CERT } from "./data/teacher-cert";
import type { BankIndexItem, BankQuestion } from "./types";

/**
 * 题库：全部为原创仿真题（按真实考试题型编写），附评分要点与参考答案。
 * 只在服务端使用：题目正文与答案不会打包进首页等客户端代码。
 */
export const QUESTION_BANK: readonly BankQuestion[] = [
  ...FOREIGN_FRONTEND,
  ...FOREIGN_BACKEND,
  ...FOREIGN_PM,
  ...BEHAVIORAL_EN,
  ...TEACHER_CERT,
  ...CIVIL_SERVICE,
  ...PUBLIC_INSTITUTION,
  ...GRAD_RETEST,
  ...BANK_SOE,
  ...IELTS_PART1,
  ...IELTS_PART2,
  ...IELTS_PART3,
  ...CET_SPEAKING,
];

const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));

export function getBankQuestion(id: string): BankQuestion | undefined {
  return byId.get(id);
}

export function bankFor(scenarioId: string): BankQuestion[] {
  return QUESTION_BANK.filter((q) => q.scenarioId === scenarioId);
}

/** 某场景下的题型（按首次出现的顺序） */
export function bankTypes(scenarioId: string): string[] {
  return [...new Set(bankFor(scenarioId).map((q) => q.type))];
}

/** 给浏览器用的轻量索引：每个场景的题目 id / 题型 / 难度 */
export function bankIndex(): Record<string, BankIndexItem[]> {
  const index: Record<string, BankIndexItem[]> = {};
  for (const q of QUESTION_BANK) {
    (index[q.scenarioId] ??= []).push({ id: q.id, type: q.type, difficulty: q.difficulty });
  }
  return index;
}
