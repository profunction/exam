import { describe, expect, it } from "vitest";
import { mockReply } from "./mock";
import { parseReply } from "./parse";
import { SCENARIOS } from "./scenarios";
import type { SessionConfig, TranscriptMessage } from "./types";

describe("mockReply follows the output contract", () => {
  for (const scenario of SCENARIOS) {
    it(scenario.id, () => {
      const config: SessionConfig = { scenarioId: scenario.id, language: scenario.defaultLanguage, totalQuestions: 2 };
      const transcript: TranscriptMessage[] = [];

      const opening = parseReply(mockReply(config, transcript, "start"));
      expect(opening.review).toBeUndefined();
      expect(opening.progress).toEqual({ current: 1, total: 2 });
      transcript.push({ role: "assistant", content: mockReply(config, [], "start") });
      transcript.push({ role: "user", content: "My first answer with a few words in it." });

      const second = parseReply(mockReply(config, transcript, "answer"));
      expect(second.progress).toEqual({ current: 2, total: 2 });
      expect(second.review?.score).toBeDefined();
      expect(second.review?.corrections.length).toBeGreaterThan(0);
      expect(second.review?.modelAnswer).toBeTruthy();
      expect(second.summary).toBeUndefined();
      transcript.push({ role: "assistant", content: mockReply(config, transcript, "answer") });
      transcript.push({ role: "user", content: "Second answer." });

      const closing = parseReply(mockReply(config, transcript, "answer"));
      expect(closing.review?.score).toBeDefined();
      expect(closing.summary?.score).toBeDefined();
      if (scenario.scoreScale === "ielts") expect(closing.summary?.score?.max).toBe(9);
      else expect(closing.summary?.score?.max).toBe(100);
    });
  }

  it("early finish without answers reports N/A", () => {
    const config: SessionConfig = { scenarioId: "foreign-frontend", language: "en", totalQuestions: 5 };
    const r = parseReply(mockReply(config, [{ role: "assistant", content: "Q1" }], "finish"));
    expect(r.summary).toBeDefined();
    expect(r.summary?.score).toBeUndefined();
    expect(r.review).toBeUndefined();
  });
});

describe("mockReply with bank questions", () => {
  it("asks the picked questions and uses the bank reference answer", async () => {
    const { getBankQuestion } = await import("./bank");
    const config: SessionConfig = { scenarioId: "teacher-cert", language: "zh", totalQuestions: 2, questionIds: ["tc-05", "tc-09"] };
    const opening = parseReply(mockReply(config, [], "start"));
    expect(opening.question).toContain(getBankQuestion("tc-05")!.question);

    const transcript: TranscriptMessage[] = [
      { role: "assistant", content: mockReply(config, [], "start") },
      { role: "user", content: "我会先让学生前倾捏住鼻翼，再安排同学送医务室。" },
    ];
    const next = parseReply(mockReply(config, transcript, "answer"));
    expect(next.question).toContain(getBankQuestion("tc-09")!.question);
    expect(next.review?.modelAnswer?.replace(/\s+/g, "")).toBe(getBankQuestion("tc-05")!.answer.replace(/\s+/g, ""));
    expect(next.review?.corrections.some((c) => c.includes("本题评分要点"))).toBe(true);
  });
});
