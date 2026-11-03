import type { BankQuestion } from "../types";

const S = "foreign-pm";

export const FOREIGN_PM: BankQuestion[] = [
  {
    id: "pm-01",
    scenarioId: S,
    type: "自我介绍与产品经历",
    difficulty: 1,
    question: "Please introduce yourself and tell me about a product you're most proud of.",
    keyPoints: [
      "一句话定位：做什么类型的产品、多少年、面向什么用户",
      "讲一个产品：要解决的用户问题 → 你的关键决策 → 结果指标",
      "体现产品思维：用户洞察、数据驱动、跨团队推动",
      "收尾连接目标岗位",
    ],
    answer: `I'm a product manager with four years of experience in B2B SaaS. I currently own the collaboration features of a project-management tool used by about three thousand companies.

The product I'm most proud of is our approval workflow. Talking to customers, I noticed a pattern: managers approved requests in chat and email, so nothing was traceable, and finance teams spent days every month reconstructing who approved what.

Instead of building a heavy workflow engine, I proposed a lightweight approval step inside existing tasks. I ran a two-week beta with twenty customers, and their feedback changed the design a lot. For example, mobile approvals turned out to matter far more than we expected, so we prioritized them over custom approval chains.

Six months after launch, forty percent of active companies were using approvals every week, and it became one of the top three reasons customers upgraded to our business plan.

What I enjoy most is turning messy real-world behavior into a simple product, and that's what attracted me to this role.`,
  },
  {
    id: "pm-02",
    scenarioId: S,
    type: "产品设计",
    difficulty: 2,
    question: "How would you improve the onboarding experience of a language-learning app?",
    keyPoints: [
      "先明确目标与指标：如次日留存、首周完成课程数，而不是注册数",
      "拆解用户与流失点：不同动机的用户、漏斗中流失最大的步骤",
      "提出 2～3 个有优先级的方案，并说明理由",
      "说明如何验证：A/B 测试、核心指标与护栏指标",
    ],
    answer: `I'd start by defining what good onboarding means. For a language app, the real goal isn't sign-ups but getting new users to experience progress quickly, so I'd measure success by the share of new users who finish three lessons in their first week, and by day-seven retention.

Next, I'd look at who the users are and where they drop off. Learners have very different motivations, like travel, exams or work, and different starting levels. I'd check the funnel and probably find big drops at the account-creation wall and in the first lesson if it's too easy or too hard.

Then I'd propose three changes, in priority order. First, let people start a lesson before creating an account, and ask them to sign up only after they've seen value. Second, a thirty-second placement check plus a question about their goal, so the first lesson feels relevant and at the right level. Third, a small, achievable daily goal with a reminder at the time they chose.

I'd run these as A/B tests, watching the first-week lesson completion as the main metric, with guardrails like uninstall rate and notification opt-outs, so we don't improve engagement by annoying people.`,
  },
  {
    id: "pm-03",
    scenarioId: S,
    type: "指标设计",
    difficulty: 2,
    question: "What metrics would you use to measure the success of a new search feature?",
    keyPoints: [
      "从目标出发：搜索是为了让用户更快找到想要的东西",
      "核心指标：搜索成功率（点击/转化）、无结果率、找到所需的时间",
      "参与度与业务指标：搜索后的转化、留存；护栏指标：延迟、页面性能",
      "如何解读与验证：分人群、对照实验、注意指标被“做高”",
    ],
    answer: `I'd start from the purpose of search: helping users find what they want quickly. So the metrics should tell us whether searches succeed, not just whether people search more.

My north-star metric would be search success rate: the share of searches that lead to a meaningful action, like clicking a result and not bouncing straight back, adding to cart or opening a document. Alongside it, I'd track the zero-result rate, the query reformulation rate, since people retyping usually means the first results were poor, and the time from query to the first meaningful click.

Then I'd connect it to business outcomes, like conversion for users who search versus similar users who don't, and whether search users retain better.

I'd also set guardrails: search latency, error rate and overall page performance, because a smarter search that takes two seconds can still hurt.

Finally, I'd read the numbers carefully. I'd segment by new and returning users and by query type, and run the launch as an experiment, because more searches per user can be a bad sign if people simply can't find things.`,
  },
  {
    id: "pm-04",
    scenarioId: S,
    type: "优先级与决策",
    difficulty: 2,
    question: "Sales, engineering and leadership each bring you an urgent request at the same time. How do you prioritize?",
    keyPoints: [
      "先弄清每个需求背后的问题、影响和截止时间，区分“紧急”和“重要”",
      "用统一标准评估：对用户和业务的影响、成本、风险、与战略的契合度",
      "做出取舍并透明沟通理由，必要时找出替代方案",
      "需要时让决策者参与，记录决定，避免反复",
    ],
    answer: `First, I'd make sure I understand each request properly, because "urgent" often hides very different things. I'd ask each person what problem they're trying to solve, what happens if we wait two weeks, and whether there's a hard deadline.

Let's say sales needs a feature to close a large deal, engineering wants to fix a database issue that's causing slow pages, and leadership wants a demo for a board meeting.

Then I'd compare them on the same criteria: impact on customers and revenue, cost, risk, and fit with our current strategy. A stability issue affecting all users usually beats a single deal, unless the deal is strategically huge. Often there's a smarter option, like supporting the board demo with a prototype instead of production code, or offering the sales prospect a workaround plus a committed date.

Once I've decided, I'd explain the reasoning openly to all three, including what we're not doing and when we'll revisit it. If the trade-off is truly a business call above my level, I'd bring the options and my recommendation to my manager rather than deciding silently. And I'd document the decision, so it doesn't get re-argued every week.`,
  },
  {
    id: "pm-05",
    scenarioId: S,
    type: "产品设计",
    difficulty: 3,
    question: "Design a product for elderly people who live alone.",
    keyPoints: [
      "澄清范围：目标用户、地区、要解决的核心问题",
      "识别多方用户：老人本人、子女、社区或照护者，以及各自的痛点",
      "聚焦一个最重要的问题给出方案，交互要适老（简单、大字、少操作）",
      "说明 MVP、成功指标与风险（隐私、误报、接受度）",
    ],
    answer: `I'd start by clarifying the scope. Let's focus on people over seventy-five who live alone in cities, and whose adult children live elsewhere.

There are really three users here: the older person, who values independence and dislikes being monitored; their children, who worry about emergencies and loneliness; and local caregivers or community workers. Their biggest shared pain points are safety, like falls or a medical emergency going unnoticed, and social isolation.

I'd focus the first version on safety without feeling like surveillance. The product would be a simple daily check-in: once a day, a large button on a tablet or a smart speaker asks "Good morning, how are you today?" One tap or a spoken answer is enough. If there's no check-in by a set time, the family gets a gentle alert, then a phone call is placed, and finally a community contact is notified. Optional fall detection through a wearable could come later.

The design principles would be large text, voice-first interaction, almost no settings for the elderly user, and the family app handling configuration.

For the MVP, I'd pilot with fifty families and measure daily check-in rate, false-alarm rate and how families feel about their peace of mind. The main risks are privacy and acceptance, so the older person must always be able to see and control what's shared.`,
  },
  {
    id: "pm-06",
    scenarioId: S,
    type: "数据分析",
    difficulty: 3,
    question: "Daily active users dropped by 10% last week. How would you investigate?",
    keyPoints: [
      "先确认数据本身：埋点、口径、数据管道是否出错",
      "排查外部因素：节假日、季节性、竞品、平台政策",
      "拆解：新老用户、平台、版本、地区、渠道，找到集中下滑的分群",
      "关联内部变更：发布、实验、推送策略，验证假设并给出行动",
    ],
    answer: `My first question would be whether the drop is real. I'd check with the data team whether tracking or the pipeline changed, for example a new app version with a broken analytics event, or a change in how we count active users. A surprising number of drops turn out to be measurement problems.

If it's real, I'd look for external explanations: a public holiday, seasonality compared with the same week last year, an outage at an app store or login provider, or a big competitor launch.

Then I'd break the metric down to see where the drop is concentrated: new versus returning users, iOS versus Android, app version, country and acquisition channel. A ten percent drop is rarely spread evenly. If it's mostly Android users on the latest version, that points to a release issue; if it's new users from one ad channel, it's probably a marketing change.

At the same time, I'd list everything we changed internally that week, such as releases, experiments and notification settings, and line them up with the timing.

Once I have a likely cause, I'd confirm it with data, fix or roll back the change, and add an alert so we notice the next drop within a day rather than a week.`,
  },
  {
    id: "pm-07",
    scenarioId: S,
    type: "行为面试",
    difficulty: 2,
    question: "Tell me about a product decision you made that turned out to be wrong. What did you do afterwards?",
    keyPoints: [
      "选择真实、有一定分量的失误，坦诚承担",
      "说明当时的判断依据，以及哪里出了问题",
      "你如何发现、止损和纠正",
      "学到了什么，现在的工作方式有何改变",
    ],
    answer: `Last year I decided to replace our free trial with a freemium plan. My reasoning was that a permanent free tier would bring in more users, and some of them would upgrade over time. Early data looked great: sign-ups went up by sixty percent.

But after two months, I noticed paid conversions were actually lower than before. Digging into the cohorts, I realized the free plan was generous enough that small teams never hit a limit, so they never felt a reason to pay, and our sales team was spending time on accounts that would never buy.

I owned the mistake in our monthly review and presented a recovery plan. We kept the free plan but tightened it around the features that signal a growing team, like integrations and admin controls, and we added a fourteen-day trial of premium features inside the free plan. Within a quarter, conversion recovered to above the original level, while sign-ups stayed higher.

What I learned is to choose the success metric before launching, and to wait for the metric that matters, in this case revenue, not the one that moves first. Now every launch plan I write includes a guardrail metric and a date when we'll review it.`,
  },
  {
    id: "pm-08",
    scenarioId: S,
    type: "产品 sense",
    difficulty: 1,
    question: "What's your favorite product, and how would you improve it?",
    keyPoints: [
      "选一个真正熟悉的产品，说明它为谁解决了什么问题",
      "分析它做得好的地方（体现产品判断）",
      "提出 1～2 个具体改进，针对明确的用户痛点",
      "说明如何衡量改进效果",
    ],
    answer: `One of my favorite products is a popular map and navigation app. It solves a very concrete problem, getting from A to B reliably, for almost everyone, and it hides a lot of complexity behind a simple screen.

What I admire most is how it uses real-time data to build trust. Traffic estimates and arrival times are accurate enough that people plan their day around them, and small touches like suggesting when to leave for a saved event show deep understanding of the user's real goal.

One thing I'd improve is the experience for people who use public transport and walk in unfamiliar cities. Once you exit a large station, the app often doesn't know which direction you're facing, and people walk the wrong way for a minute before realizing it. I'd add a short "orient me" step at transitions: show the exit number, a landmark photo and the first turn, and use the camera to confirm direction when GPS is unreliable.

I'd measure it by how often users reverse direction in the first hundred meters after a transit leg, and by the navigation completion rate for walking trips in big cities.`,
  },
  {
    id: "pm-09",
    scenarioId: S,
    type: "跨团队协作",
    difficulty: 2,
    question: "Engineers tell you a feature will take three times longer than you expected. How do you handle it?",
    keyPoints: [
      "先理解而不是施压：估算背后的复杂度和风险在哪里",
      "回到目标，拆分范围：找出能先交付价值的最小版本",
      "讨论方案取舍：技术方案、分阶段发布、调整其他优先级",
      "同步干系人并更新计划，复盘估算差异",
    ],
    answer: `My first reaction would be curiosity, not pressure. A big gap between my expectation and the engineers' estimate usually means I'm missing something, so I'd sit down with them and ask what makes it complex: unclear requirements, old code that needs refactoring, a dependency on another team, or real technical risk.

Then I'd go back to the goal. What problem are we solving, and what's the smallest version that delivers most of the value? Often the expensive part is an edge case or a nice-to-have, like supporting every file type or a fully configurable layout, that we can defer.

Together we'd look at options. We could ship a first version in a third of the time and add the rest based on usage, choose a simpler technical approach, or, if the full feature really matters, decide what else to drop from the roadmap to make room.

Once we agree, I'd update the plan and tell stakeholders early, explaining the trade-off rather than just announcing a delay. Afterwards, I'd look at why my expectation was so far off, and involve engineers earlier in shaping the next feature, so estimates and scope evolve together.`,
  },
  {
    id: "pm-10",
    scenarioId: S,
    type: "商业化与策略",
    difficulty: 3,
    question: "Should our app launch a paid subscription tier? How would you decide?",
    keyPoints: [
      "明确商业目标与现状：收入来源、用户规模、付费意愿信号",
      "找到值得付费的价值：重度用户的需求，而不是把现有功能锁起来",
      "用证据验证：用户访谈、定价调研、灰度实验（假门测试）",
      "评估风险与指标：对免费用户留存和口碑的影响、ARPU、转化率、流失率",
    ],
    answer: `I'd treat it as a hypothesis to test rather than a yes-or-no opinion.

First, I'd clarify the goal and the starting point. Do we need more revenue, more predictable revenue, or less dependence on ads? How many active users do we have, and do we already see signals of willingness to pay, like people asking for features we can't afford to build?

Second, I'd look for value worth paying for. The best subscriptions give heavy users more, rather than taking things away from everyone. I'd analyze our most engaged ten percent of users and interview some of them to find the jobs they'd pay to do better: maybe offline access, advanced analytics or more storage.

Third, I'd test demand cheaply before building, with a pricing survey, a fake-door test that shows the premium offer to a small group, and a waitlist. If enough users click and sign up at a realistic price, that's a strong signal.

Finally, I'd weigh the risks. Free users must not feel the product got worse, so I'd watch free-user retention and app ratings as guardrails alongside conversion rate, revenue per user and subscriber churn. If the experiment shows healthy conversion without hurting free users, I'd launch gradually, market by market.`,
  },
];
