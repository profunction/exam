import { describe, expect, it } from "vitest";
import { QUESTION_BANK, bankFor, bankIndex, bankTypes, getBankQuestion } from "./index";
import { pickRandom } from "./pick";
import { SCENARIOS } from "../scenarios";

describe("question bank integrity", () => {
  it("has unique ids", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question belongs to a known scenario and is complete", () => {
    const scenarioIds = new Set(SCENARIOS.map((s) => s.id));
    for (const q of QUESTION_BANK) {
      expect(scenarioIds.has(q.scenarioId), q.id).toBe(true);
      expect(q.type.trim(), q.id).not.toBe("");
      expect(q.question.trim().length, q.id).toBeGreaterThan(5);
      expect(q.answer.trim().length, q.id).toBeGreaterThan(80);
      expect(q.keyPoints.length, q.id).toBeGreaterThanOrEqual(3);
      expect([1, 2, 3]).toContain(q.difficulty);
      // 内容不能含会破坏解析的 Markdown 标题
      expect(/^#{2,4}\s/m.test(q.answer), q.id).toBe(false);
      expect(/^#{2,4}\s/m.test(q.question), q.id).toBe(false);
    }
  });

  it("covers every preset scenario with enough questions", () => {
    for (const s of SCENARIOS) {
      expect(bankFor(s.id).length, s.id).toBeGreaterThanOrEqual(8);
      expect(bankFor(s.id).length, s.id).toBeGreaterThanOrEqual(s.defaultQuestions);
    }
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(120);
  });

  it("builds a light index without answers", () => {
    const index = bankIndex();
    const item = index["civil-service"][0];
    expect(Object.keys(item).sort()).toEqual(["difficulty", "id", "type"]);
    expect(bankTypes("civil-service")).toContain("综合分析");
    expect(getBankQuestion(item.id)?.scenarioId).toBe("civil-service");
  });
});

describe("pickRandom", () => {
  it("picks n unique items", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const picked = pickRandom(items, 5);
    expect(picked).toHaveLength(5);
    expect(new Set(picked).size).toBe(5);
    picked.forEach((x) => expect(items).toContain(x));
  });

  it("caps at the pool size and does not mutate input", () => {
    const items = [1, 2, 3];
    expect(pickRandom(items, 10)).toHaveLength(3);
    expect(items).toEqual([1, 2, 3]);
    expect(pickRandom(items, 0)).toEqual([]);
  });

  it("is deterministic with an injected random function", () => {
    expect(pickRandom(["a", "b", "c", "d"], 2, () => 0)).toEqual(["a", "b"]);
  });
});
