/**
 * 演示模式：未配置 ANTHROPIC_API_KEY 时，用固定题库生成符合输出格式的示例回复，
 * 让网站在本地或预览环境中无需密钥也能完整跑通。内容明确标注为演示，不代表真实评估。
 */
import { QUESTION_HEADING, REVIEW_HEADING, SUMMARY_HEADING } from "./prompt";
import { resolveScenario, type Scenario } from "./scenarios";
import type { ChatAction, SessionConfig, TranscriptMessage } from "./types";

const DEMO_NOTE = "（演示模式：当前未接入 AI 模型，以下为示例点评，配置 ANTHROPIC_API_KEY 后即可获得真实评估）";

const BANK: Record<string, { en: string[]; zh: string[] }> = {
  "foreign-frontend": {
    en: [
      "Could you briefly introduce yourself and walk me through the most impactful front-end project you've worked on recently?",
      "How does React decide when to re-render a component, and what techniques have you used to avoid unnecessary renders?",
      "Imagine our dashboard takes 6 seconds to load on mobile. How would you investigate and improve its performance?",
      "How would you design the front-end architecture for a large application shared by several teams?",
      "Tell me about a time you disagreed with a product manager or designer. How did you handle it?",
    ],
    zh: [
      "请先简单做个自我介绍，并重点讲讲你最近做过的、最有影响力的一个前端项目。",
      "React 在什么情况下会重新渲染组件？你用过哪些手段避免不必要的渲染？",
      "假设我们的数据看板在手机上要 6 秒才能加载完，你会如何排查并优化？",
      "如果一个大型前端应用由多个团队共同开发，你会如何设计它的架构？",
      "讲一次你和产品经理或设计师意见不一致的经历，你是怎么处理的？",
    ],
  },
  "foreign-backend": {
    en: [
      "Please introduce yourself and describe a backend system you designed or significantly improved.",
      "How would you design a URL shortening service that handles 10,000 requests per second?",
      "Walk me through how you would troubleshoot a sudden spike in API latency in production.",
      "When would you choose a relational database over a NoSQL store, and why?",
      "Tell me about a production incident you owned. What did you learn from it?",
    ],
    zh: [
      "请做个自我介绍，并讲讲你设计过或大幅改进过的一个后端系统。",
      "如何设计一个每秒处理 1 万次请求的短链接服务？",
      "线上接口延迟突然飙升，你会如何排查？",
      "什么情况下你会选关系型数据库而不是 NoSQL？为什么？",
      "讲一次你负责处理的线上事故，你从中学到了什么？",
    ],
  },
  "foreign-pm": {
    en: [
      "Please introduce yourself and tell me about a product you are most proud of.",
      "How would you improve the onboarding experience of a language-learning app?",
      "Which metrics would you use to measure the success of a new search feature?",
      "You have three urgent requests from sales, engineering and leadership. How do you prioritize?",
      "Tell me about a product decision that turned out to be wrong. What did you do next?",
    ],
    zh: [
      "请做个自我介绍，并讲讲你最自豪的一个产品。",
      "你会如何改进一款语言学习 App 的新手引导体验？",
      "你会用哪些指标衡量一个新搜索功能是否成功？",
      "销售、研发和老板同时给你提了紧急需求，你如何排优先级？",
      "讲一个后来被证明是错误的产品决策，你之后做了什么？",
    ],
  },
  "teacher-cert": {
    zh: [
      "有人说「教师的爱是严慈相济的爱」，谈谈你对这句话的理解。",
      "学校安排你组织一次以「诚信」为主题的班会，你会如何组织？",
      "上课时，一名学生突然流鼻血，其他同学也开始骚动，你会怎么处理？",
      "家长认为你布置的作业太多，到学校找你理论，你会如何沟通？",
    ],
    en: [
      "Some say a teacher's love should be both strict and kind. What is your understanding of this?",
      "You are asked to organize a class meeting on honesty. How would you organize it?",
      "A student suddenly has a nosebleed in class and others become restless. What would you do?",
      "A parent complains that you assign too much homework. How would you communicate with them?",
    ],
  },
  "civil-service": {
    zh: [
      "有人说「基层是最好的课堂」，谈谈你的看法。",
      "单位要开展一次面向老年人的智能手机使用培训，由你负责，你会怎么组织？",
      "你在窗口办理业务时，群众因排队时间长情绪激动，与工作人员发生争执，你会如何处理？",
      "同事经常把自己的工作推给你，影响了你的工作进度，你会怎么办？",
    ],
    en: [
      "Some say the grassroots level is the best classroom. What is your view?",
      "You are in charge of organizing smartphone training for senior citizens. How would you organize it?",
      "At a service window, citizens become angry about long queues and argue with staff. How would you handle it?",
      "A colleague often pushes their work onto you, delaying your own tasks. What would you do?",
    ],
  },
  "ielts-part1": {
    en: [
      "Let's talk about your hometown. Where is your hometown, and what do you like most about it?",
      "Do you work or are you a student? What do you enjoy most about it?",
      "How do you usually spend your weekends?",
      "Do you like reading books? Why or why not?",
      "How often do you use your mobile phone?",
      "Do you prefer to cook at home or eat out?",
    ],
    zh: [],
  },
  "ielts-part2": {
    en: [
      "Describe a person who has influenced you a lot.\nYou should say:\n- who this person is\n- how you know this person\n- what this person has done\n- and explain why this person has influenced you.",
      "Describe a place you visited that you would like to go back to.\nYou should say:\n- where it is\n- when you went there\n- what you did there\n- and explain why you would like to go back.",
      "Describe a skill you learned that you think is useful.\nYou should say:\n- what the skill is\n- when and how you learned it\n- how often you use it\n- and explain why you think it is useful.",
    ],
    zh: [],
  },
  "ielts-part3": {
    en: [
      "Why do some young people look up to celebrities rather than people around them?",
      "Do you think the role models for children today are different from those in the past?",
      "How can schools help students develop good values?",
      "Is it better to learn practical skills at school or at work?",
      "What kinds of skills will be most important in the future?",
    ],
    zh: [],
  },
  custom: {
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
  },
};

function questionFor(scenario: Scenario, config: SessionConfig, k: number): string {
  const bank = BANK[scenario.id] ?? BANK.custom;
  const list = config.language === "en" ? bank.en : bank.zh.length ? bank.zh : bank.en;
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

function review(scenario: Scenario, config: SessionConfig, answer: string): string {
  const en = config.language === "en";
  const sample = en
    ? "Sure. In my most recent role, I led the redesign of a customer-facing dashboard used by over 50,000 users. The main challenge was slow load times, so I introduced code splitting and caching, which cut the load time by 60%. What I learned is that measuring first and optimizing second saves a lot of effort."
    : "好的。我的观点是：这个问题需要辩证看待。首先，……（结合原因分析）；其次，……（结合具体事例）；最后，……（提出可落地的对策）。总之，……（回扣岗位要求，升华主题）。";
  return `${REVIEW_HEADING}
* **当前得分**：${demoScore(scenario, answer)}
* **语法与表达纠错**：
  - ${DEMO_NOTE}
  - 原句「${excerpt(answer)}」：建议先用一句话直接回答问题，再展开细节，让考官第一时间抓住重点。
  - 回答中可以加入具体数据或例子（如「提升了 30%」「负责 5 人小组」），增强说服力。
* **高分参考范文**：
  > ${sample}`;
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
  - 针对得分最低的题型再练一场，并对照高分范文复述一遍。`;
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

  if (action === "finish" || asked >= config.totalQuestions) {
    const closing = en
      ? "Thank you for your answers. That's the end of the interview."
      : "好的，感谢你的作答，本场面试到此结束。";
    const parts = [`---\n${QUESTION_HEADING}\n${closing}`];
    if (last?.role === "user") parts.push(review(scenario, config, last.content));
    parts.push(summary(scenario, answers));
    return `${parts.join("\n\n")}\n---`;
  }

  const answer = last?.role === "user" ? last.content : "";
  const next = asked + 1;
  const ack = en ? "Thank you for your answer. Let's move on." : "好的，了解了。我们进入下一题。";
  return `---\n${QUESTION_HEADING}\n${ack}\n\n${label(config, next)}\n\n${questionFor(scenario, config, next)}\n\n${review(scenario, config, answer)}\n---`;
}

/** 把文本切成小块，模拟流式输出 */
export function* chunkText(text: string, size = 8): Generator<string> {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i += size) yield chars.slice(i, i + size).join("");
}
