import { getBankQuestion } from "./bank";
import { LIMITS } from "./limits";
import { CUSTOM_SCENARIO_ID, getScenario } from "./scenarios";
import type { ChatAction, ChatRequestBody, Lang, SessionConfig, TranscriptMessage } from "./types";

export { LIMITS };

export type ValidationResult = { ok: true; value: ChatRequestBody } | { ok: false; error: string };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function optionalString(v: unknown, max: number, name: string): string | undefined | Error {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string") return new Error(`${name} 必须是字符串`);
  if (v.length > max) return new Error(`${name} 不能超过 ${max} 个字符`);
  return v;
}

function validateConfig(raw: unknown): SessionConfig | Error {
  if (!isObject(raw)) return new Error("缺少场景配置");
  const { scenarioId, language, totalQuestions } = raw;
  if (typeof scenarioId !== "string" || (scenarioId !== CUSTOM_SCENARIO_ID && !getScenario(scenarioId))) {
    return new Error("未知的面试场景");
  }
  if (language !== "zh" && language !== "en") return new Error("面试语言只能是 zh 或 en");
  if (
    typeof totalQuestions !== "number" ||
    !Number.isInteger(totalQuestions) ||
    totalQuestions < LIMITS.minQuestions ||
    totalQuestions > LIMITS.maxQuestions
  ) {
    return new Error(`题目数量需为 ${LIMITS.minQuestions}～${LIMITS.maxQuestions} 的整数`);
  }
  const background = optionalString(raw.background, LIMITS.backgroundChars, "背景信息");
  if (background instanceof Error) return background;
  const customTitle = optionalString(raw.customTitle, LIMITS.customTitleChars, "场景名称");
  if (customTitle instanceof Error) return customTitle;
  const customDescription = optionalString(raw.customDescription, LIMITS.customDescriptionChars, "场景说明");
  if (customDescription instanceof Error) return customDescription;
  if (scenarioId === CUSTOM_SCENARIO_ID && !customTitle?.trim()) return new Error("自定义场景需要填写场景名称");

  const questionIds = validateQuestionIds(raw.questionIds, scenarioId, totalQuestions);
  if (questionIds instanceof Error) return questionIds;

  const preset = getScenario(scenarioId);
  const lang: Lang = preset?.languageLocked ? preset.defaultLanguage : language;
  return {
    scenarioId,
    language: lang,
    totalQuestions,
    ...(background ? { background } : {}),
    ...(scenarioId === CUSTOM_SCENARIO_ID ? { customTitle, customDescription } : {}),
    ...(questionIds ? { questionIds } : {}),
  };
}

/** 题库题目：必须存在、属于当前场景、不重复，且数量等于题目总数 */
function validateQuestionIds(raw: unknown, scenarioId: string, totalQuestions: number): string[] | undefined | Error {
  if (raw === undefined || raw === null) return undefined;
  if (!Array.isArray(raw) || raw.length === 0) return new Error("题库题目格式错误");
  if (raw.length !== totalQuestions) return new Error("题库题目数量与题目总数不一致");
  const ids: string[] = [];
  for (const id of raw) {
    if (typeof id !== "string") return new Error("题库题目格式错误");
    const q = getBankQuestion(id);
    if (!q || q.scenarioId !== scenarioId) return new Error("题库中没有这道题，请重新开始练习");
    if (ids.includes(id)) return new Error("题库题目重复");
    ids.push(id);
  }
  return ids;
}

function validateMessages(raw: unknown): TranscriptMessage[] | Error {
  if (!Array.isArray(raw)) return new Error("messages 必须是数组");
  if (raw.length > LIMITS.maxMessages) return new Error("本场对话过长，请开始新的练习");
  const out: TranscriptMessage[] = [];
  let total = 0;
  for (const item of raw) {
    if (!isObject(item)) return new Error("消息格式错误");
    const { role, content, elapsedSec } = item;
    if (role !== "user" && role !== "assistant") return new Error("消息角色错误");
    if (typeof content !== "string" || !content.trim()) return new Error("消息内容不能为空");
    const max = role === "user" ? LIMITS.userMessageChars : LIMITS.assistantMessageChars;
    if (content.length > max) {
      return new Error(role === "user" ? `单次回答不能超过 ${max} 个字符` : "历史消息过长");
    }
    total += content.length;
    const msg: TranscriptMessage = { role, content };
    if (role === "user" && elapsedSec !== undefined && elapsedSec !== null) {
      if (typeof elapsedSec !== "number" || !Number.isFinite(elapsedSec) || elapsedSec < 0 || elapsedSec > 36_000) {
        return new Error("作答用时格式错误");
      }
      msg.elapsedSec = elapsedSec;
    }
    out.push(msg);
  }
  if (total > LIMITS.totalChars) return new Error("本场对话过长，请开始新的练习");
  return out;
}

/** 对话必须以考官开场开头、双方交替；不同动作对结尾有不同要求 */
function validateStructure(messages: TranscriptMessage[], action: ChatAction): string | null {
  if (action === "start") return messages.length === 0 ? null : "开场请求不应包含历史消息";
  if (messages.length === 0) return "缺少对话记录";
  if (messages[0].role !== "assistant") return "对话需从考官开场开始";
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === messages[i - 1].role) return "对话记录顺序错误";
  }
  const last = messages[messages.length - 1].role;
  if (action === "answer" && last !== "user") return "请先输入你的回答";
  return null;
}

export function validateChatRequest(raw: unknown): ValidationResult {
  if (!isObject(raw)) return { ok: false, error: "请求格式错误" };
  const { action } = raw;
  if (action !== "start" && action !== "answer" && action !== "finish") return { ok: false, error: "未知的请求动作" };
  const config = validateConfig(raw.config);
  if (config instanceof Error) return { ok: false, error: config.message };
  const messages = validateMessages(raw.messages);
  if (messages instanceof Error) return { ok: false, error: messages.message };
  const structureError = validateStructure(messages, action);
  if (structureError) return { ok: false, error: structureError };
  return { ok: true, value: { config, messages, action } };
}
