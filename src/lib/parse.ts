/**
 * 解析 AI 考官的 Markdown 回复（支持流式过程中的不完整文本）。
 * 输出格式由 prompt.ts 中的系统提示词约定：
 *   ### 🤖 AI 考官提问 / ### 📊 上一轮表现复盘（付费核心） / ### 🏁 面试总结报告
 */

export interface Score {
  value: number;
  max: 100 | 9;
  /** 展示文案，如 "85/100"、"雅思 6.5" */
  label: string;
}

export interface ParsedReview {
  /** 复盘部分的完整 Markdown（解析失败时直接渲染） */
  body: string;
  scoreText?: string;
  score?: Score;
  corrections: string[];
  modelAnswer?: string;
}

export interface ParsedSummary {
  body: string;
  scoreText?: string;
  score?: Score;
  /** 去掉「综合得分」一行后的 Markdown */
  details: string;
}

export interface ParsedReply {
  /** 考官提问部分（若模型没有按格式输出，则为全文） */
  question: string;
  review?: ParsedReview;
  summary?: ParsedSummary;
  progress?: { current: number; total: number };
}

type SectionKind = "question" | "review" | "summary";

function classifyHeading(heading: string): SectionKind | null {
  if (/考官提问|examiner/i.test(heading)) return "question";
  if (/复盘|review/i.test(heading)) return "review";
  if (/总结报告|summary|report/i.test(heading)) return "summary";
  return null;
}

/** 去掉分隔线和首尾空行 */
function cleanBlock(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line))
    .join("\n")
    .trim();
}

export function parseScore(text: string | undefined): Score | undefined {
  if (!text) return undefined;
  const t = text.replace(/\*/g, "");
  const band = t.match(/(?:雅思|IELTS|band)\s*(?:band\s*)?[:：]?\s*(\d(?:\.\d)?)/i);
  if (band) {
    const value = Number(band[1]);
    if (value >= 0 && value <= 9) return { value, max: 9, label: `雅思 ${band[1]}` };
  }
  const percent = t.match(/(\d{1,3}(?:\.\d+)?)\s*\/\s*100/);
  if (percent) {
    const value = Number(percent[1]);
    if (value >= 0 && value <= 100) return { value, max: 100, label: `${percent[1]}/100` };
  }
  const points = t.match(/(\d{1,3}(?:\.\d+)?)\s*分/);
  if (points) {
    const value = Number(points[1]);
    if (value >= 0 && value <= 100) return { value, max: 100, label: `${points[1]}/100` };
  }
  return undefined;
}

/** 读取形如 `* **当前得分**：85/100` 的字段值 */
function readField(body: string, name: string): string | undefined {
  const re = new RegExp(`${name}\\s*\\**\\s*[：:]\\s*(.*)`);
  const m = body.match(re);
  if (!m) return undefined;
  const value = m[1].replace(/\*\*/g, "").trim();
  return value || undefined;
}

function stripBullet(line: string): string {
  return line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "").trim();
}

function parseReview(body: string): ParsedReview {
  const scoreText = readField(body, "当前得分");
  const lines = body.split("\n");
  const corrections: string[] = [];
  const answerLines: string[] = [];
  let mode: "none" | "corrections" | "answer" = "none";

  for (const line of lines) {
    if (/语法与表达纠错|纠错|痛点/.test(line) && /^\s*[-*+]\s+\*\*/.test(line)) {
      mode = "corrections";
      const rest = line.split(/[：:]/).slice(1).join("：").replace(/\*\*/g, "").trim();
      if (rest) corrections.push(rest);
      continue;
    }
    if (/高分参考范文|参考范文|范文/.test(line) && /^\s*[-*+]\s+\*\*/.test(line)) {
      mode = "answer";
      const rest = line.split(/[：:]/).slice(1).join("：").replace(/\*\*/g, "").trim();
      if (rest) answerLines.push(rest.replace(/^>\s?/, ""));
      continue;
    }
    if (/^\s*[-*+]\s+\*\*/.test(line) && !/^\s{2,}/.test(line)) {
      // 新的一级字段（如「当前得分」），结束当前收集
      mode = "none";
      continue;
    }
    if (mode === "corrections") {
      if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
        corrections.push(stripBullet(line));
      } else if (line.trim() && corrections.length > 0) {
        corrections[corrections.length - 1] += `\n${line.trim()}`;
      }
    } else if (mode === "answer") {
      answerLines.push(line.replace(/^\s*>\s?/, "").replace(/^\s{2,}/, ""));
    }
  }

  const modelAnswer = answerLines.join("\n").trim() || undefined;
  return { body, scoreText, score: parseScore(scoreText), corrections, modelAnswer };
}

function parseSummary(body: string): ParsedSummary {
  const scoreText = readField(body, "综合得分");
  const details = body
    .split("\n")
    .filter((line) => !/综合得分/.test(line))
    .join("\n")
    .trim();
  return { body, scoreText, score: parseScore(scoreText), details };
}

export function parseProgress(text: string): { current: number; total: number } | undefined {
  const zh = text.match(/第\s*(\d+)\s*\/\s*(\d+)\s*题/);
  const en = text.match(/Question\s*(\d+)\s*(?:\/|of)\s*(\d+)/i);
  const m = zh ?? en;
  if (!m) return undefined;
  const current = Number(m[1]);
  const total = Number(m[2]);
  if (!Number.isFinite(current) || !Number.isFinite(total) || current < 1 || total < 1) return undefined;
  return { current, total };
}

export function parseReply(raw: string): ParsedReply {
  const text = raw.replace(/\r\n/g, "\n");
  const parts = text.split(/^#{2,4}\s+(.+)$/m);
  // parts: [前言, 标题1, 内容1, 标题2, 内容2, ...]
  const sections: Partial<Record<SectionKind, string>> = {};
  let preamble = parts[0] ?? "";
  for (let i = 1; i < parts.length; i += 2) {
    const kind = classifyHeading(parts[i]);
    const content = parts[i + 1] ?? "";
    if (kind) {
      sections[kind] = (sections[kind] ? `${sections[kind]}\n\n` : "") + content;
    } else {
      // 不认识的标题：并入考官提问，保证内容不丢
      preamble += `\n\n**${parts[i].trim()}**\n${content}`;
    }
  }

  const question = cleanBlock([preamble, sections.question ?? ""].filter((s) => s.trim()).join("\n\n"));
  const reply: ParsedReply = { question };
  if (sections.review !== undefined) reply.review = parseReview(cleanBlock(sections.review));
  if (sections.summary !== undefined) reply.summary = parseSummary(cleanBlock(sections.summary));
  const progress = parseProgress(question);
  if (progress) reply.progress = progress;
  return reply;
}
