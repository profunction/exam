import { describe, expect, it } from "vitest";
import { validateChatRequest } from "./validate";

const config = { scenarioId: "foreign-frontend", language: "en", totalQuestions: 5 };

describe("validateChatRequest", () => {
  it("accepts a start request", () => {
    const r = validateChatRequest({ action: "start", config, messages: [] });
    expect(r.ok).toBe(true);
  });

  it("accepts an answer request", () => {
    const r = validateChatRequest({
      action: "answer",
      config,
      messages: [
        { role: "assistant", content: "Q1" },
        { role: "user", content: "A1", elapsedSec: 30 },
      ],
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.messages[1].elapsedSec).toBe(30);
  });

  it("rejects unknown scenarios and bad question counts", () => {
    expect(validateChatRequest({ action: "start", config: { ...config, scenarioId: "nope" }, messages: [] }).ok).toBe(false);
    expect(validateChatRequest({ action: "start", config: { ...config, totalQuestions: 99 }, messages: [] }).ok).toBe(false);
  });

  it("requires a custom title for custom scenarios", () => {
    const bad = validateChatRequest({ action: "start", config: { ...config, scenarioId: "custom" }, messages: [] });
    expect(bad.ok).toBe(false);
    const good = validateChatRequest({
      action: "start",
      config: { ...config, scenarioId: "custom", customTitle: "考研复试" },
      messages: [],
    });
    expect(good.ok).toBe(true);
  });

  it("forces English for language-locked scenarios", () => {
    const r = validateChatRequest({
      action: "start",
      config: { scenarioId: "ielts-part1", language: "zh", totalQuestions: 6 },
      messages: [],
    });
    expect(r.ok && r.value.config.language).toBe("en");
  });

  it("enforces alternation and endings", () => {
    const twoUsers = validateChatRequest({
      action: "answer",
      config,
      messages: [
        { role: "assistant", content: "Q1" },
        { role: "user", content: "A" },
        { role: "user", content: "B" },
      ],
    });
    expect(twoUsers.ok).toBe(false);
    const endsWithAssistant = validateChatRequest({
      action: "answer",
      config,
      messages: [{ role: "assistant", content: "Q1" }],
    });
    expect(endsWithAssistant.ok).toBe(false);
    const finishAfterAssistant = validateChatRequest({
      action: "finish",
      config,
      messages: [{ role: "assistant", content: "Q1" }],
    });
    expect(finishAfterAssistant.ok).toBe(true);
  });

  it("rejects oversized answers and empty content", () => {
    const long = validateChatRequest({
      action: "answer",
      config,
      messages: [
        { role: "assistant", content: "Q1" },
        { role: "user", content: "x".repeat(7000) },
      ],
    });
    expect(long.ok).toBe(false);
    const empty = validateChatRequest({
      action: "answer",
      config,
      messages: [
        { role: "assistant", content: "Q1" },
        { role: "user", content: "   " },
      ],
    });
    expect(empty.ok).toBe(false);
  });
});

describe("questionIds", () => {
  const civil = { scenarioId: "civil-service", language: "zh", totalQuestions: 2 };

  it("accepts valid bank questions", () => {
    const r = validateChatRequest({ action: "start", config: { ...civil, questionIds: ["cs-01", "cs-02"] }, messages: [] });
    expect(r.ok && r.value.config.questionIds).toEqual(["cs-01", "cs-02"]);
  });

  it("rejects unknown, foreign, duplicate or miscounted ids", () => {
    const bad = [
      ["cs-01", "nope"],
      ["cs-01", "fe-01"],
      ["cs-01", "cs-01"],
      ["cs-01"],
    ];
    for (const questionIds of bad) {
      expect(validateChatRequest({ action: "start", config: { ...civil, questionIds }, messages: [] }).ok).toBe(false);
    }
  });

  it("rejects bank questions on custom scenarios", () => {
    const r = validateChatRequest({
      action: "start",
      config: { scenarioId: "custom", customTitle: "x", language: "zh", totalQuestions: 1, questionIds: ["cs-01"] },
      messages: [],
    });
    expect(r.ok).toBe(false);
  });
});
