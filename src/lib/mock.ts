/**
 * 演示模式：未配置 ANTHROPIC_API_KEY 时，用题库题目和参考答案生成符合输出格式的示例回复，
 * 让网站在本地或预览环境中无需密钥也能完整跑通。评分为按长度估算的示例，不代表真实评估。
 */
import { bankFor, getBankQuestion } from "./bank";
import type { BankQuestion } from "./bank/types";
import { QUESTION_HEADING, REVIEW_HEADING, SUMMARY_HEADING } from "./prompt";
import { resolveScenario, type Scenario } from "./scenarios";
import type { ChatAction, SessionConfig, TranscriptMessage } from "./types";

const DEMO_NOTE = "（演示模式：当前未接入 AI 模型，以下为示例点评，配置 ANTHROPIC_API_KEY 后即可获得真实评估）";

/** 自定义场景没有题库时使用的通用题目 */
const CUSTOM_QUESTIONS = {
  en: [
    "Please introduce yourself and explain why you are interested in this opportunity.",
    "What is the most challenging thing you have done that is relevant to this role?",
    "How do you handle pressure and tight deadlines?",
    "Describe a time you had to learn something new quickly.",
    "Where do you see yourself in three years?",
  ],
  zh: [
    "请先做个自我介绍，并说说你为什么想参加这次面试。",
    "讲一件你做过的、与本场景最相关的、最有挑战的事。",
    "你如何应对压力和紧迫的截止时间？",
    "讲一次你必须快速学习新东西的经历。",
    "你对未来三年有什么规划？",
  ],
};

/** 第 k 题（从 1 开始）对应的题库题目：优先用本场抽到的题，否则按题库顺序 */
function bankQuestionAt(scenario: Scenario, config: SessionConfig, k: number): BankQuestion | undefined {
  const ids = config.questionIds ?? [];
  if (ids.length > 0) return getBankQuestion(ids[(k - 1) % ids.length]);
  const bank = bankFor(scenario.id);
  return bank.length > 0 ? bank[(k - 1) % bank.length] : undefined;
}

function questionFor(scenario: Scenario, config: SessionConfig, k: number): string {
  const q = bankQuestionAt(scenario, config, k);
  if (q) return q.question;
  const list = config.language === "en" ? CUSTOM_QUESTIONS.en : CUSTOM_QUESTIONS.zh;
  return list[(k - 1) % list.length];
}

function label(config: SessionConfig, k: number): string {
  return config.language === "en" ? `**Question ${k}/${config.totalQuestions}**` : `**第 ${k}/${config.totalQuestions} 题**`;
}

function lengthOf(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const cjk = (answer.match(/[一-鿿]/g) ?? []).length;
  return cjk > words ? Math.round(cjk / 2.5) : words; // 中文按字数折算成"词"
}

function demoScore(scenario: Scenario, answer: string): string {
  const n = lengthOf(answer);
  if (scenario.scoreScale === "ielts") {
    const band = n < 15 ? "5.0" : n < 40 ? "5.5" : n < 80 ? "6.0" : "6.5";
    return `雅思 ${band} 分`;
  }
  const base = n < 15 ? 48 : n < 40 ? 63 : n < 80 ? 74 : 82;
  return `${base + (n % 5)}/100`;
}

function excerpt(answer: string): string {
  const oneLine = answer.replace(/\s+/g, " ").trim();
  return oneLine.length > 40 ? `${oneLine.slice(0, 40)}…` : oneLine;
}

/** 把多段文字放进 Markdown 引用块（空行也保留引用符号） */
function quote(text: string): string {
  return text
    .split("\n")
    .map((line) => `  > ${line}`.trimEnd())
    .join("\n");
}

function review(scenario: Scenario, config: SessionConfig, answer: string, bankQ?: BankQuestion): string {
  const en = config.language === "en";
  const fallback = en
    ? "Sure. In my most recent role, I led the redesign of a customer-facing dashboard used by over 50,000 users. The main challenge was slow load times, so I introduced code splitting and caching, which cut the load time by 60%. What I learned is that measuring first and optimizing second saves a lot of effort."
    : "好的。我的观点是：这个问题需要辩证看待。首先，……（结合原因分析）；其次，……（结合具体事例）；最后，……（提出可落地的对策）。总之，……（回扣岗位要求，升华主题）。";
  const pointsLine = bankQ ? `\n  - 本题评分要点：${bankQ.keyPoints.join("；")}。` : "";
  return `${REVIEW_HEADING}
* **当前得分**：${demoScore(scenario, answer)}
* **语法与表达纠错**：
  - ${DEMO_NOTE}
  - 原句「${excerpt(answer)}」：建议先用一句话直接回答问题，再展开细节，让考官第一时间抓住重点。
  - 回答中可以加入具体数据或例子（如「提升了 30%」「负责 5 人小组」），增强说服力。${pointsLine}
* **高分参考范文**：
${quote(bankQ?.answer ?? fallback)}`;
}

function summary(scenario: Scenario, answers: string[]): string {
  if (answers.length === 0) {
    return `${SUMMARY_HEADING}
* **综合得分**：N/A
* **分项评价**：
  - 本场没有作答记录，无法评分。
* **核心优势**：
  - 暂无
* **重点提升**：
  - 至少完成一道题再结束，才能获得有效评估。
* **下一步练习建议**：
  - 重新开始一场练习，先从自我介绍类题目热身。`;
  }
  const avgLen = answers.reduce((s, a) => s + lengthOf(a), 0) / answers.length;
  const overall = demoScore(scenario, "x ".repeat(Math.round(avgLen)));
  return `${SUMMARY_HEADING}
* **综合得分**：${overall}
* **分项评价**：
  - ${DEMO_NOTE}
  - 内容与扣题：基本围绕题目作答，个别回答展开不足。
  - 逻辑结构：建议固定使用「结论 → 理由 → 例子 → 总结」的结构。
  - 语言表达：整体清晰，可以增加衔接词让表达更连贯。
* **核心优势**：
  - 完成了 ${answers.length} 道题的作答，态度积极。
* **重点提升**：
  - 每道题都给出至少一个具体例子。
* **下一步练习建议**：
  - 针对得分最低的题型再练一场，并对照题库参考答案复述一遍。`;
}

/** 生成一条演示回复（格式与真实模型输出一致） */
export function mockReply(config: SessionConfig, transcript: TranscriptMessage[], action: ChatAction): string {
  const scenario = resolveScenario(config);
  const en = config.language === "en";
  const asked = transcript.filter((m) => m.role === "assistant").length;
  const answers = transcript.filter((m) => m.role === "user").map((m) => m.content);
  const last = transcript[transcript.length - 1];

  if (action === "start") {
    const greeting = en
      ? `Hello, and welcome! I'll be your examiner for today's **${scenario.title}** practice session.\n\nHere's how it works: there are ${config.totalQuestions} questions, and I'll ask them one at a time. After each answer you'll get a score, corrections and a model answer.\n\nLet's begin.`
      : `你好，欢迎参加今天的「${scenario.title}」模拟练习。\n\n规则说明：本场共 ${config.totalQuestions} 道题，我每次只问一个问题，你作答后我会给出评分、纠错和高分范文。\n\n下面开始。`;
    return `---\n${QUESTION_HEADING}\n${greeting}\n\n${label(config, 1)}\n\n${questionFor(scenario, config, 1)}\n---`;
  }

  // 刚答完的是第 asked 题
  const answeredQ = bankQuestionAt(scenario, config, Math.max(1, asked));

  if (action === "finish" || asked >= config.totalQuestions) {
    const closing = en
      ? "Thank you for your answers. That's the end of the interview."
      : "好的，感谢你的作答，本场面试到此结束。";
    const parts = [`---\n${QUESTION_HEADING}\n${closing}`];
    if (last?.role === "user") parts.push(review(scenario, config, last.content, answeredQ));
    parts.push(summary(scenario, answers));
    return `${parts.join("\n\n")}\n---`;
  }

  const answer = last?.role === "user" ? last.content : "";
  const next = asked + 1;
  const ack = en ? "Thank you for your answer. Let's move on." : "好的，了解了。我们进入下一题。";
  return `---\n${QUESTION_HEADING}\n${ack}\n\n${label(config, next)}\n\n${questionFor(scenario, config, next)}\n\n${review(scenario, config, answer, answeredQ)}\n---`;
}

/** 把文本切成小块，模拟流式输出 */
export function* chunkText(text: string, size = 8): Generator<string> {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i += size) yield chars.slice(i, i + size).join("");
}
