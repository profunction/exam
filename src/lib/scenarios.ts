import type { Lang, SessionConfig } from "./types";

export type ScenarioCategory = "job" | "cert" | "language" | "civil" | "study";

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  /** 场景说明：会写进系统提示词，也显示在卡片上 */
  description: string;
  defaultLanguage: Lang;
  /** 是否允许切换面试语言（雅思固定英文） */
  languageLocked?: boolean;
  /** 考官语气要求 */
  tone: string;
  /** 评分体系：百分制或雅思分数档 */
  scoreScale: "percent" | "ielts";
  defaultQuestions: number;
  /** 限时设置（秒）：准备时间 + 作答时间 */
  timer?: { prepSeconds?: number; answerSeconds: number };
  tags: string[];
  emoji: string;
  /** 侧栏答题技巧 */
  tips: string[];
  /** 背景信息输入框的提示 */
  backgroundHint: string;
}

export const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  job: "求职面试",
  cert: "考证面试",
  language: "语言考试",
  civil: "考公考编",
  study: "升学面试",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "foreign-frontend",
    title: "外企高级前端工程师面试",
    category: "job",
    description:
      "外资 / 跨国科技公司的高级前端工程师岗位。考查自我介绍与项目经历、JavaScript / TypeScript 原理、React 与性能优化、前端工程化与架构设计、跨团队协作与行为面试（STAR）。",
    defaultLanguage: "en",
    tone: "专业、友好、带鼓励性，像真实的外企 Hiring Manager，会针对候选人的回答追问细节。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["英文面试", "技术 + 行为", "STAR"],
    emoji: "💻",
    tips: [
      "先给结论，再展开细节（Answer first, then explain）。",
      "项目经历用 STAR：情境 → 任务 → 行动 → 结果，结果尽量量化。",
      "技术题讲清取舍（trade-off），别只背概念。",
      "主动说明你在团队里的角色和影响力。",
    ],
    backgroundHint: "例：5 年前端经验，主力 React + TypeScript，做过低代码平台；目标公司是某外企中国研发中心。",
  },
  {
    id: "foreign-backend",
    title: "外企后端 / 全栈工程师面试",
    category: "job",
    description:
      "外资 / 跨国科技公司的后端或全栈工程师岗位。考查项目经历、API 与数据库设计、分布式系统与高并发、系统设计、线上故障处理与行为面试（STAR）。",
    defaultLanguage: "en",
    tone: "专业、友好、带鼓励性，像真实的外企 Tech Lead，重视思路与权衡。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["英文面试", "系统设计", "STAR"],
    emoji: "🛠️",
    tips: [
      "系统设计先澄清需求和规模，再画架构、谈瓶颈。",
      "讲故障复盘时突出定位过程和长期改进。",
      "用具体数字说明规模：QPS、数据量、延迟。",
    ],
    backgroundHint: "例：Java/Go 后端 4 年，负责过订单系统，熟悉 MySQL、Redis、Kafka。",
  },
  {
    id: "foreign-pm",
    title: "外企产品经理面试",
    category: "job",
    description:
      "外资 / 跨国互联网公司的产品经理岗位。考查产品 sense、用户洞察、指标设计、需求优先级、跨部门协作与行为面试。",
    defaultLanguage: "en",
    tone: "专业、友好、带鼓励性，像真实的外企 Product Director，关注结构化思维与数据意识。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["英文面试", "产品 sense", "指标"],
    emoji: "📈",
    tips: [
      "用框架组织回答：用户 → 痛点 → 方案 → 指标。",
      "给出明确的取舍和优先级理由。",
      "指标要区分北极星指标和护栏指标。",
    ],
    backgroundHint: "例：3 年 B 端 SaaS 产品经验，负责过增长和商业化模块。",
  },
  {
    id: "teacher-cert",
    title: "教师资格证结构化面试",
    category: "cert",
    description:
      "教师资格证面试的结构化问答环节。题型包括综合分析、组织管理、应急应变、人际沟通、自我认知等，考查教育理念、师德修养与职业素养。",
    defaultLanguage: "zh",
    tone: "严肃、规范、公正，像正式考场上的考官，用语正式，不闲聊。",
    scoreScale: "percent",
    defaultQuestions: 4,
    timer: { answerSeconds: 150 },
    tags: ["结构化", "限时作答", "师德师风"],
    emoji: "🍎",
    tips: [
      "开头表明态度，中间分点作答，结尾升华回扣教师身份。",
      "应急应变题：先稳定、再处理、后反思，学生安全第一。",
      "人际沟通题：换位思考，主动沟通，落脚到学生发展。",
      "每题控制在 2～3 分钟，避免空话套话。",
    ],
    backgroundHint: "例：报考初中数学教师资格证，应届师范生。",
  },
  {
    id: "civil-service",
    title: "公务员结构化面试",
    category: "civil",
    description:
      "国考 / 省考公务员结构化面试。题型包括综合分析、计划组织协调、应急应变、人际关系、言语表达与情景模拟，考查综合素质与岗位匹配度。",
    defaultLanguage: "zh",
    tone: "严肃、规范、公正，像正式考场上的主考官，用语正式，不闲聊。",
    scoreScale: "percent",
    defaultQuestions: 4,
    timer: { prepSeconds: 60, answerSeconds: 180 },
    tags: ["结构化", "思考 + 作答限时", "国考省考"],
    emoji: "🏛️",
    tips: [
      "综合分析：亮观点 → 析原因 / 意义 → 提对策。",
      "组织协调：目的明确、准备充分、过程有亮点、总结有反馈。",
      "应急应变：分清轻重缓急，先控制局面再解决问题。",
      "语言要有条理：首先、其次、最后，避免口头禅。",
    ],
    backgroundHint: "例：报考某市税务局一级科员，法学专业应届生。",
  },
  {
    id: "ielts-part1",
    title: "雅思口语 Part 1",
    category: "language",
    description:
      "雅思口语第一部分：围绕家乡、学习工作、兴趣爱好等日常话题的简短问答，每题作答约 20～30 秒。按雅思官方口语评分标准（流利度与连贯性、词汇、语法、发音）评分。",
    defaultLanguage: "en",
    languageLocked: true,
    tone: "严格、中立，像真实的雅思考官，严格卡时间并检查是否扣题，不给答题提示。",
    scoreScale: "ielts",
    defaultQuestions: 6,
    timer: { answerSeconds: 30 },
    tags: ["日常话题", "限时 30 秒", "雅思评分"],
    emoji: "🗣️",
    tips: [
      "直接回答 + 一个理由或例子，2～4 句即可。",
      "避免只说 Yes / No，也别背模板。",
      "适当使用连接词：Well, Actually, To be honest。",
    ],
    backgroundHint: "例：目标 6.5 分，在读大三，计算机专业。",
  },
  {
    id: "ielts-part2",
    title: "雅思口语 Part 2（话题卡）",
    category: "language",
    description:
      "雅思口语第二部分：考官给出一张话题卡（Cue Card），考生准备 1 分钟后连续陈述 1～2 分钟，需覆盖卡片上的全部要点。按雅思官方口语评分标准评分。",
    defaultLanguage: "en",
    languageLocked: true,
    tone: "严格、中立，像真实的雅思考官，严格卡时间（准备 1 分钟、陈述 2 分钟）并检查是否覆盖话题卡要点。",
    scoreScale: "ielts",
    defaultQuestions: 3,
    timer: { prepSeconds: 60, answerSeconds: 120 },
    tags: ["话题卡", "准备 1 分钟", "陈述 2 分钟"],
    emoji: "🎤",
    tips: [
      "准备时写关键词，不要写整句。",
      "按卡片要点顺序讲，最后一点（explain why）多展开。",
      "讲满接近 2 分钟，用细节和感受撑起内容。",
    ],
    backgroundHint: "例：目标 7 分，Part 2 经常讲不满 2 分钟。",
  },
  {
    id: "ielts-part3",
    title: "雅思口语 Part 3（深入讨论）",
    category: "language",
    description:
      "雅思口语第三部分：围绕 Part 2 话题延伸的抽象讨论题，考查观点表达、比较分析与论证能力，每题作答约 40～60 秒。按雅思官方口语评分标准评分。",
    defaultLanguage: "en",
    languageLocked: true,
    tone: "严格、中立，像真实的雅思考官，会追问观点背后的理由。",
    scoreScale: "ielts",
    defaultQuestions: 5,
    timer: { answerSeconds: 60 },
    tags: ["抽象讨论", "观点论证", "雅思评分"],
    emoji: "💬",
    tips: [
      "观点 → 理由 → 例子 → 小结，结构清晰。",
      "可以比较不同人群 / 时代 / 国家的差异。",
      "使用让步与对比：While..., On the other hand...",
    ],
    backgroundHint: "例：目标 7 分，Part 3 容易答得太短。",
  },
  {
    id: "behavioral-en",
    title: "外企通用行为面试（HR 面）",
    category: "job",
    description:
      "外资企业通用的行为面试与 HR 面，适用于各类岗位。考查自我介绍、求职动机、优缺点、团队冲突、失败经历、领导力、压力处理与薪资沟通，要求用 STAR 法则讲清具体事例。",
    defaultLanguage: "en",
    tone: "专业、友好、带鼓励性，像真实的外企 HR 或 Hiring Manager，会针对模糊的回答追问具体细节和结果。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["英文面试", "STAR", "各岗位通用"],
    emoji: "🤝",
    tips: [
      "每个故事都要有具体情境、你的行动和可量化的结果。",
      "讲失败和缺点时要真诚，并说明你如何改进。",
      "回答「为什么来我们公司」前先研究公司产品和近期动态。",
      "准备 2～3 个反问问题，体现你的思考。",
    ],
    backgroundHint: "例：3 年市场营销经验，应聘外企区域市场经理。",
  },
  {
    id: "public-institution",
    title: "事业单位结构化面试",
    category: "civil",
    description:
      "事业单位公开招聘的结构化面试（含医疗、教育、文化、社区等单位）。题型包括综合分析、计划组织、应急应变、人际关系、岗位认知与自我认知，考查综合素质与岗位匹配度。",
    defaultLanguage: "zh",
    tone: "严肃、规范、公正，像正式考场上的主考官，用语正式，不闲聊。",
    scoreScale: "percent",
    defaultQuestions: 4,
    timer: { prepSeconds: 60, answerSeconds: 180 },
    tags: ["结构化", "思考 + 作答限时", "事业编"],
    emoji: "🏢",
    tips: [
      "岗位认知题：结合报考单位的公益服务属性来答。",
      "计划组织题：目的 → 准备 → 实施 → 总结，突出细节和亮点。",
      "应急应变题：先控制局面、保障安全，再解决问题、事后反思。",
      "人际关系题：摆正心态、主动沟通，以工作大局为重。",
    ],
    backgroundHint: "例：报考市人民医院行政岗，公共事业管理专业应届生。",
  },
  {
    id: "grad-retest",
    title: "考研复试面试",
    category: "study",
    description:
      "硕士研究生复试面试：英文自我介绍、英语口语问答、专业与科研经历、报考动机与研究规划、学术道德与综合素质，由导师组提问。",
    defaultLanguage: "zh",
    tone: "严谨但友善，像研究生复试的导师组，会围绕考生的科研经历和专业基础追问细节。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["中英混合", "科研经历", "导师组面试"],
    emoji: "🎓",
    tips: [
      "英文自我介绍控制在 1～2 分钟，突出与报考专业相关的经历。",
      "介绍毕业设计时，讲清自己的具体工作，而不是团队做了什么。",
      "遇到不会的问题，诚实说明，再讲自己的思考思路。",
      "提前了解报考学院导师的研究方向。",
    ],
    backgroundHint: "例：报考某高校计算机专业学硕，本科做过图像识别项目。",
  },
  {
    id: "bank-soe",
    title: "银行 / 国企校招面试",
    category: "job",
    description:
      "银行、国有企业的校园招聘面试（以半结构化面试为主）。考查自我介绍、求职动机、职业规划、营销与客户服务情景、团队协作、风险合规意识与抗压能力。",
    defaultLanguage: "zh",
    tone: "正式、稳重，像银行或国企的人力资源面试官，会通过追问考察求职动机的真实性和岗位匹配度。",
    scoreScale: "percent",
    defaultQuestions: 5,
    tags: ["校招", "情景模拟", "营销服务"],
    emoji: "🏦",
    tips: [
      "求职动机要具体：了解应聘银行或企业的特色业务和战略。",
      "情景题要体现客户至上和风险合规意识。",
      "营销模拟先了解客户需求，再介绍产品，不要硬推。",
      "压力面试题保持冷静，用事实证明自己。",
    ],
    backgroundHint: "例：金融学应届生，应聘国有大行管培生，有支行实习经历。",
  },
  {
    id: "cet-speaking",
    title: "大学英语四六级口语",
    category: "language",
    description:
      "按全国大学英语四、六级口语考试（CET-SET）的形式练习：自我介绍与简短问答、个人陈述（准备后限时陈述）、观点讨论。考查语言准确性、流利度与内容连贯性。",
    defaultLanguage: "en",
    languageLocked: true,
    tone: "中立、规范，像四六级口语考试的考官，按考试流程推进，严格控制时间。",
    scoreScale: "percent",
    defaultQuestions: 4,
    timer: { prepSeconds: 45, answerSeconds: 60 },
    tags: ["四六级", "个人陈述", "限时 1 分钟"],
    emoji: "📢",
    tips: [
      "个人陈述用「观点 → 理由一 → 理由二 → 结论」的结构。",
      "多用 first / besides / however / in conclusion 等连接词。",
      "宁可句子简单，也要保证语法正确、发音清晰。",
      "讨论题注意回应对方：I see your point, but…",
    ],
    backgroundHint: "例：准备四级口语，英语基础一般，开口容易紧张。",
  },
];

export const CUSTOM_SCENARIO_ID = "custom";

const CUSTOM_BASE: Omit<Scenario, "title" | "description" | "defaultLanguage"> = {
  id: CUSTOM_SCENARIO_ID,
  category: "job",
  tone: "专业、客观，符合该场景的真实考官风格。",
  scoreScale: "percent",
  defaultQuestions: 5,
  tags: ["自定义"],
  emoji: "✨",
  tips: ["先给结论，再分点展开。", "多用具体例子和数据支撑观点。", "注意回答的结构和时间控制。"],
  backgroundHint: "例：目标岗位、个人经历、希望重点练习的题型。",
};

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/** 根据会话配置得到完整场景（包含自定义场景） */
export function resolveScenario(config: Pick<SessionConfig, "scenarioId" | "customTitle" | "customDescription" | "language">): Scenario {
  const preset = getScenario(config.scenarioId);
  if (preset) return preset;
  return {
    ...CUSTOM_BASE,
    title: config.customTitle?.trim() || "自定义面试",
    description: config.customDescription?.trim() || "用户自定义的面试场景，请按该场景的真实考查要求出题。",
    defaultLanguage: config.language,
  };
}

export function displayTitle(config: Pick<SessionConfig, "scenarioId" | "customTitle" | "customDescription" | "language">): string {
  return resolveScenario(config).title;
}
