import { describe, expect, it } from "vitest";
import { parseProgress, parseReply, parseScore } from "./parse";

const FULL = `---
### 🤖 AI 考官提问
Thank you for your answer. That gives me a clear picture of your background.

**Question 2/5**

How does React decide when to re-render a component?

### 📊 上一轮表现复盘（付费核心）
* **当前得分**：78/100
* **语法与表达纠错**：
  - 原句 "I am responsible for develop the system"：应为 "responsible for developing"。
  - 原句 "very very good"：重复用词，建议改为 "highly effective"。
    补充：避免口语化的重复。
* **高分参考范文**：
  > I'm a front-end engineer with five years of experience.
  >
  > Most recently I led the rebuild of our analytics dashboard.
---`;

describe("parseReply", () => {
  it("splits question, review and progress", () => {
    const r = parseReply(FULL);
    expect(r.question).toContain("How does React decide");
    expect(r.question).not.toContain("---");
    expect(r.progress).toEqual({ current: 2, total: 5 });
    expect(r.review?.score).toEqual({ value: 78, max: 100, label: "78/100" });
    expect(r.review?.corrections).toHaveLength(2);
    expect(r.review?.corrections[0]).toContain("developing");
    expect(r.review?.corrections[1]).toContain("避免口语化的重复");
    expect(r.review?.modelAnswer).toBe(
      "I'm a front-end engineer with five years of experience.\n\nMost recently I led the rebuild of our analytics dashboard.",
    );
    expect(r.summary).toBeUndefined();
  });

  it("handles the opening turn without a review", () => {
    const r = parseReply("### 🤖 AI 考官提问\n你好，欢迎参加面试。\n\n**第 1/4 题**\n\n请做个自我介绍。");
    expect(r.review).toBeUndefined();
    expect(r.progress).toEqual({ current: 1, total: 4 });
  });

  it("parses a closing turn with review and summary", () => {
    const text = `### 🤖 AI 考官提问
感谢作答，本场面试结束。

### 📊 上一轮表现复盘（付费核心）
* **当前得分**：雅思 6.5 分
* **语法与表达纠错**：
  - 时态错误。
* **高分参考范文**：
  > Sample answer.

### 🏁 面试总结报告
* **综合得分**：雅思 6.0 分
* **分项评价**：
  - 流利度：尚可。
* **核心优势**：
  - 词汇丰富。`;
    const r = parseReply(text);
    expect(r.review?.score).toEqual({ value: 6.5, max: 9, label: "雅思 6.5" });
    expect(r.summary?.score).toEqual({ value: 6, max: 9, label: "雅思 6.0" });
    expect(r.summary?.details).not.toContain("综合得分");
    expect(r.summary?.details).toContain("词汇丰富");
  });

  it("falls back to the whole text when headings are missing", () => {
    const r = parseReply("Sorry, could you repeat that?");
    expect(r.question).toBe("Sorry, could you repeat that?");
    expect(r.review).toBeUndefined();
  });

  it("is safe on partial streaming text", () => {
    const partial = FULL.slice(0, FULL.indexOf("语法与表达") + 3);
    const r = parseReply(partial);
    expect(r.review?.score?.value).toBe(78);
    expect(r.review?.modelAnswer).toBeUndefined();
  });

  it("returns no score for N/A", () => {
    const r = parseReply("### 📊 上一轮表现复盘（付费核心）\n* **当前得分**：N/A（暂无作答）");
    expect(r.review?.scoreText).toBe("N/A（暂无作答）");
    expect(r.review?.score).toBeUndefined();
  });
});

describe("parseScore", () => {
  it.each([
    ["85/100", 85, 100],
    ["85 / 100 分", 85, 100],
    ["72分", 72, 100],
    ["雅思 7 分", 7, 9],
    ["IELTS Band 5.5", 5.5, 9],
    ["Band: 6.0", 6, 9],
  ])("%s", (input, value, max) => {
    expect(parseScore(input)).toMatchObject({ value, max });
  });

  it("rejects out-of-range values", () => {
    expect(parseScore("150/100")).toBeUndefined();
    expect(parseScore("N/A")).toBeUndefined();
  });
});

describe("parseProgress", () => {
  it("reads Chinese and English labels", () => {
    expect(parseProgress("**第 3/5 题**")).toEqual({ current: 3, total: 5 });
    expect(parseProgress("**Question 4 of 6**")).toEqual({ current: 4, total: 6 });
    expect(parseProgress("no label")).toBeUndefined();
  });
});
