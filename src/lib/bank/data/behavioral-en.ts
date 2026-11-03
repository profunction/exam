import type { BankQuestion } from "../types";

const S = "behavioral-en";

export const BEHAVIORAL_EN: BankQuestion[] = [
  {
    id: "bh-01",
    scenarioId: S,
    type: "自我介绍",
    difficulty: 1,
    question: "Tell me about yourself.",
    keyPoints: [
      "用「现在 → 过去 → 未来」结构，控制在 1～2 分钟",
      "现在：职位与核心职责；过去：1～2 个最相关的成就（有数字）",
      "未来：为什么想要这份工作，与岗位需求呼应",
      "不要背简历流水账，也不要聊过多私人信息",
    ],
    answer: `Sure. I'm currently a marketing specialist at a consumer electronics company, where I manage our social media campaigns across three markets, working closely with the product and sales teams.

Before that, I spent two years at a digital agency, which taught me to work fast with many different clients. My proudest achievement so far is a product-launch campaign I led last year: by focusing our budget on short videos made with real customers, we beat our engagement target by forty percent while spending about twenty percent less than planned.

Looking ahead, I want to take on broader responsibility for campaign strategy, not just execution, and to work in an international team. That's why this role excites me: it combines regional strategy with hands-on campaign work, and your company's focus on customer-led content matches the way I like to work.`,
  },
  {
    id: "bh-02",
    scenarioId: S,
    type: "自我认知",
    difficulty: 1,
    question: "What are your greatest strengths and weaknesses?",
    keyPoints: [
      "优势：选与岗位相关的 1～2 个，并用具体例子证明",
      "劣势：真实但不致命，避免「我太追求完美」这类套话",
      "说明你正在如何改进，以及已经看到的进步",
      "整体语气自信、诚恳",
    ],
    answer: `My biggest strength is turning messy situations into clear plans. For example, when our team inherited a delayed project with no documentation, I mapped out all the open tasks in two days, agreed priorities with the stakeholders, and we delivered the first milestone three weeks later. My manager now often asks me to kick off new projects for that reason.

As for a weakness, I used to find it hard to delegate. I'd take on too much myself because I felt it was faster, and that sometimes made me a bottleneck. I realized this when a teammate told me she wanted more ownership. Since then, I've changed how I work: at the start of each project I decide what only I can do and hand off the rest with clear expectations, and I schedule short check-ins instead of redoing work. It's still something I watch, but my team now delivers more, and I have time for the strategic work I'm supposed to focus on.`,
  },
  {
    id: "bh-03",
    scenarioId: S,
    type: "动机与匹配",
    difficulty: 1,
    question: "Why do you want to work for our company?",
    keyPoints: [
      "体现你做过功课：公司的产品、使命、近期动态",
      "说明你认同的点，并与自己的经历和价值观连接",
      "落到岗位：你能带来什么，以及你想在这里获得的成长",
      "避免只谈薪资、平台大等泛泛理由",
    ],
    answer: `There are three reasons. First, your product. I've been using your app for over a year to manage my own finances, and what stands out is how you make complex things simple, like the way you explain fees before every transfer. That's the kind of product I want to build.

Second, your direction. I read about your expansion into Southeast Asia and your plan to serve small businesses there. I've worked with SMEs for the past three years, and I understand the challenges they face with cash flow and cross-border payments, so I believe I could contribute from day one.

And third, the culture. In my conversations with your team, people talked a lot about ownership and learning from experiments. That fits how I work best: I like being given a clear goal and the freedom to figure out how to reach it.

So for me, this role is a chance to bring my SME experience to a product I already believe in.`,
  },
  {
    id: "bh-04",
    scenarioId: S,
    type: "团队协作",
    difficulty: 2,
    question: "Tell me about a time you had a conflict with a coworker. How did you resolve it?",
    keyPoints: [
      "STAR：选一个有实际分歧、但不涉及人身攻击的冲突",
      "先私下沟通、理解对方立场，聚焦问题而不是人",
      "找到共同目标，提出双方都能接受的方案",
      "结果 + 关系改善 + 你学到了什么",
    ],
    answer: `In my previous job, I worked with a colleague from the finance team on a monthly sales report. She kept sending the data late, which meant I had to rush the analysis, and I got frustrated, to the point where our emails became a bit tense.

Instead of escalating, I asked her for a short coffee to understand what was going on. It turned out she had to pull the data manually from three systems, and our report deadline fell in the same week as the finance month-end close, her busiest time.

Once I saw the full picture, we found a solution together. We agreed to move my report deadline by three days, and I helped her automate one of the three data exports with a simple script I'd written for my own work.

The next report arrived early, and the process stayed smooth after that. We actually ended up working well together on several other projects. What I learned is that most conflicts at work come from different pressures, not bad intentions, so I now try to ask about the other person's constraints before reacting.`,
  },
  {
    id: "bh-05",
    scenarioId: S,
    type: "挫折与成长",
    difficulty: 2,
    question: "Describe a time you failed. What did you learn?",
    keyPoints: [
      "选一个真实的失败，说清你自己的责任",
      "简洁交代经过，把重点放在你的反思和行动上",
      "具体说明学到的教训，并举例证明你后来做得更好",
      "避免把失败归咎于他人",
    ],
    answer: `In my first year as a team lead, I promised a client that we'd deliver a new reporting module in four weeks. I wanted to impress them, so I gave the estimate on the spot without checking with my team.

Two weeks in, it was clear we couldn't make it. Part of the work depended on another team's API that wasn't ready, and my developers had to work late to keep up. We delivered two weeks late, and the client was understandably unhappy.

I took responsibility. I called the client myself, explained what went wrong, and offered a revised plan with weekly progress updates, which helped rebuild trust. Internally, I apologized to my team for committing them without asking.

The lesson was clear: never commit to a date before understanding the dependencies and hearing from the people doing the work. Since then, I give clients a range first and confirm a date within forty-eight hours after a quick planning session. Over the last two years, my team has hit every committed deadline but one, and that one we flagged three weeks in advance.`,
  },
  {
    id: "bh-06",
    scenarioId: S,
    type: "压力与时间管理",
    difficulty: 2,
    question: "Tell me about a time you had to work under a very tight deadline.",
    keyPoints: [
      "交代背景：为什么时间紧、风险是什么",
      "你的具体做法：拆分任务、排优先级、取舍范围、协调资源",
      "如何管理压力和沟通预期",
      "结果与经验",
    ],
    answer: `Last spring, a major customer asked for a security review document as a condition for renewing their contract, and they needed it in three working days instead of the usual three weeks.

First, I broke the request down. Out of about a hundred and twenty questions, I found that around seventy could be answered from documents we already had, so I focused my time on the fifty new ones. I listed them by topic and asked the right experts, one from infrastructure and one from legal, for thirty minutes each instead of sending them long emails.

I also managed expectations. I told the customer which sections would be complete and which would include a commitment with a date, for two certifications that were still in progress, rather than promising everything and missing the deadline.

We delivered the document on time, the customer renewed, and our sales team later reused that document for four other deals. Beyond the result, I learned that under a tight deadline, the most valuable thing is deciding quickly what not to do.`,
  },
  {
    id: "bh-07",
    scenarioId: S,
    type: "领导力",
    difficulty: 3,
    question: "Give an example of a time you showed leadership without having formal authority.",
    keyPoints: [
      "选择你没有管理权限、却推动了事情发生的场景",
      "说明你如何影响他人：数据、愿景、先做示范、照顾各方利益",
      "如何获得支持与推动落地",
      "量化结果，以及对团队的长期影响",
    ],
    answer: `At my last company, customer support and engineering kept arguing about bug priorities. Support felt ignored, and engineers felt flooded with vague tickets. I was a support analyst at the time, so I had no authority over either team.

I noticed the real problem was that nobody could see which bugs actually affected the most customers. So, on my own initiative, I spent a few evenings building a simple dashboard that grouped tickets by bug and showed how many customers and how much revenue each one affected.

I shared it first with one friendly engineering lead and asked for feedback rather than presenting it as the answer. He liked it and suggested we review it together every Monday for fifteen minutes. I invited the support lead too, and kept the meeting short and focused on the top five issues.

Within two months, the average time to fix high-impact bugs dropped from five weeks to under two, and the weekly review became an official process. My manager later told me it was a key reason I was promoted to team lead. What I learned is that you can lead without a title if you make the problem visible and make it easy for others to say yes.`,
  },
  {
    id: "bh-08",
    scenarioId: S,
    type: "动机与匹配",
    difficulty: 2,
    question: "Why are you leaving your current job?",
    keyPoints: [
      "保持积极：讲「想获得什么」，而不是「想逃离什么」",
      "不批评现任公司、领导或同事",
      "理由要与应聘岗位能提供的东西相符",
      "简短真诚，然后把话题引回到新岗位",
    ],
    answer: `I've learned a lot in my current role and I'm grateful for it. Over the past three years I've grown from a junior analyst to leading the reporting work for our whole region.

The main reason I'm looking now is growth. Our team is focused on maintaining existing reports, and there are limited opportunities to work on predictive models and experimentation, which is where I want to develop. I've been building those skills on my own, for example through a forecasting project I volunteered for last year, and I'd like that to be the core of my next role.

This position is very much about using data to shape decisions before they're made, not just to report on them afterwards, and the team works with a scale of data I haven't had access to before. That's why it feels like the right next step for me.`,
  },
  {
    id: "bh-09",
    scenarioId: S,
    type: "薪资谈判",
    difficulty: 3,
    question: "What are your salary expectations?",
    keyPoints: [
      "提前调研市场行情，给出合理区间而非单一数字",
      "说明依据：岗位职责、经验、市场数据",
      "表达灵活性，强调关注整体待遇和发展",
      "也可礼貌地先了解对方的预算范围",
    ],
    answer: `Based on my research on similar roles in this city, and considering my five years of experience and the scope of this position, I'm looking at a total annual package in the range of four hundred and fifty to five hundred and twenty thousand yuan.

That said, salary is only one part of the picture for me. I'm also interested in the bonus structure, learning opportunities and the long-term growth path, so I'm open to discussing the overall package.

Could you share the budget range you have in mind for this role? I'm confident we can find something that works for both sides.`,
  },
  {
    id: "bh-10",
    scenarioId: S,
    type: "反问环节",
    difficulty: 1,
    question: "Do you have any questions for us?",
    keyPoints: [
      "一定要提问，体现兴趣和思考深度",
      "问岗位成功标准、团队挑战、协作方式、发展路径",
      "避免一上来问薪资假期，或问网上一查就知道的问题",
      "准备 2～3 个，根据面试中的内容灵活调整",
    ],
    answer: `Yes, thank you, I have a few.

First, what would success look like in this role after the first six months? I'd like to understand what you'd expect me to have achieved.

Second, what's the biggest challenge the team is facing right now, and how would this role help with it?

And finally, you mentioned earlier that the team works closely with colleagues in Singapore. Could you tell me a bit more about how that collaboration works day to day, and how decisions get made across the two offices?`,
  },
];
