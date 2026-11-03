import type { BankQuestion } from "../types";

const S = "cet-speaking";

export const CET_SPEAKING: BankQuestion[] = [
  {
    id: "cet-01",
    scenarioId: S,
    type: "自我介绍与简短问答",
    difficulty: 1,
    question: "Please introduce yourself briefly.",
    keyPoints: [
      "20～30 秒：姓名、学校与专业、兴趣或特点",
      "句子简单准确，语音清晰",
      "避免背诵过长的模板",
    ],
    answer: `Good morning. My name is Chen Jing, and I'm a sophomore at a university in Wuhan, majoring in civil engineering. In my free time, I enjoy playing badminton and reading detective novels. I'm an outgoing person and I like making new friends, so I'm looking forward to talking with you today.`,
  },
  {
    id: "cet-02",
    scenarioId: S,
    type: "自我介绍与简短问答",
    difficulty: 1,
    question: "What do you usually do to relax after classes?",
    keyPoints: [
      "直接回答 + 一个理由或细节",
      "作答约 20 秒",
      "注意一般现在时和第三人称单数",
    ],
    answer: `After classes, I usually go for a run on the school playground with my roommates. Running helps me clear my mind after a long day of study, and chatting with friends while we exercise is really relaxing. If it rains, I just stay in the dorm and listen to music or watch a short comedy show.`,
  },
  {
    id: "cet-03",
    scenarioId: S,
    type: "个人陈述",
    difficulty: 2,
    question: "Individual presentation: Talk about the advantages and disadvantages of online learning.",
    keyPoints: [
      "开头点题 → 优点（灵活、资源丰富、可回看）→ 缺点（自律要求高、缺少互动）→ 结论",
      "用 first / besides / however / in conclusion 串联",
      "约 1 分钟，内容平衡",
    ],
    answer: `Nowadays, online learning has become more and more popular among college students. In my opinion, it has both advantages and disadvantages.

On the one hand, online learning is very flexible. We can study anytime and anywhere, and we can watch the recorded lessons again if we don't understand something. Besides, there are a lot of excellent courses online from top universities, which are usually free.

On the other hand, online learning requires strong self-discipline. It's easy to get distracted by our phones at home. Moreover, there is less face-to-face interaction between teachers and students, so we can't always ask questions immediately.

In conclusion, I think online learning is a useful supplement to classroom teaching, but it can't fully replace it.`,
  },
  {
    id: "cet-04",
    scenarioId: S,
    type: "个人陈述",
    difficulty: 2,
    question: "Individual presentation: Should college students take part-time jobs? Why or why not?",
    keyPoints: [
      "表明立场（支持，但要适度）",
      "给出 2 个理由并举例：积累经验、锻炼能力、减轻负担",
      "提出前提：不能影响学业",
      "约 1 分钟",
    ],
    answer: `I think college students should take part-time jobs, as long as they don't affect their studies.

Firstly, part-time jobs help us gain work experience. For example, last summer I worked as a tutor for a middle school student. I learned how to explain things clearly and how to be patient, which will be useful for my future career.

Secondly, part-time jobs can make us more independent. By earning some money ourselves, we understand that money doesn't come easily, and we learn to spend it more wisely. It can also reduce the financial burden on our parents.

However, studying is still our main task. If a job takes up too much time, our grades may suffer. So I believe college students should choose part-time jobs carefully and manage their time well.`,
  },
  {
    id: "cet-05",
    scenarioId: S,
    type: "个人陈述",
    difficulty: 2,
    question: "Individual presentation: Talk about the importance of physical exercise for college students.",
    keyPoints: [
      "现状：很多大学生缺乏锻炼",
      "重要性：身体健康、缓解压力、提高学习效率、结交朋友",
      "建议：坚持适合自己的运动",
      "约 1 分钟",
    ],
    answer: `Nowadays, many college students spend most of their time sitting in front of computers and phones, and they seldom do physical exercise. In my opinion, regular exercise is very important for us.

First of all, exercise keeps us healthy. It makes our bodies stronger and helps us avoid problems like poor eyesight and back pain caused by sitting too long.

What's more, exercise is a good way to relieve stress. When I feel nervous before exams, playing basketball for an hour always makes me feel relaxed and energetic again, so I can study more efficiently afterwards.

Finally, team sports help us make friends and learn teamwork.

Therefore, I suggest every college student find a sport they enjoy and stick to it, even if it's just thirty minutes a day.`,
  },
  {
    id: "cet-06",
    scenarioId: S,
    type: "个人陈述",
    difficulty: 2,
    question: "Individual presentation: Describe your plan after graduation.",
    keyPoints: [
      "说明计划（工作 / 读研 / 出国等）",
      "解释原因，与专业和兴趣结合",
      "说明为实现计划正在做的准备",
      "约 1 分钟，注意将来时",
    ],
    answer: `After graduation, I plan to work for a few years before deciding whether to go to graduate school.

I'm majoring in marketing, and I think practical experience is especially important in this field. I hope to work in the marketing department of a consumer company, where I can learn how real products are promoted and how to understand customers' needs.

To prepare for this goal, I'm doing several things now. I'm improving my English, because many companies work with international partners. I've also joined the marketing team of our student union, and I'm planning to find an internship next summer.

After working for two or three years, I'll know more clearly what I want to specialize in. Then, if necessary, I'll go back to school for a master's degree.`,
  },
  {
    id: "cet-07",
    scenarioId: S,
    type: "观点讨论",
    difficulty: 3,
    question: "Discussion: Some people think college students should focus only on their studies. Do you agree?",
    keyPoints: [
      "表明观点（部分同意 / 不同意）",
      "承认学习是主要任务，再说明课外活动、实践的价值",
      "给出平衡建议",
      "讨论中注意回应对方观点：I see your point, but…",
    ],
    answer: `I partly agree with this idea. It's true that studying is our main task at college. We need to master professional knowledge, which is the foundation for our future careers.

However, I don't think we should focus only on our studies. College is also the best time to develop other abilities. By joining clubs, doing volunteer work or taking internships, we can improve our communication skills and teamwork, and learn things that can't be found in textbooks. These abilities are also what employers look for.

So I think the key is balance. We should put our studies first, but also spend some time on activities that help us grow in other ways.`,
  },
  {
    id: "cet-08",
    scenarioId: S,
    type: "观点讨论",
    difficulty: 3,
    question: "Discussion: How has the smartphone changed the way college students study?",
    keyPoints: [
      "积极影响：查资料方便、学习类 App、随时学习",
      "消极影响：分心、碎片化、依赖搜索",
      "给出合理使用的建议",
      "约 1 分钟",
    ],
    answer: `I think smartphones have changed the way we study a lot, both positively and negatively.

On the positive side, smartphones make learning much more convenient. We can look up new words, search for information and watch online lectures anytime. Many students also use apps to memorize vocabulary or practice listening on the bus, so they can make use of small pieces of time.

On the negative side, smartphones are also a big distraction. It's very easy to start checking messages or watching short videos while studying, and we may lose focus. Some students also rely too much on searching for answers instead of thinking for themselves.

So I believe we should use smartphones as a learning tool, but control the time we spend on entertainment.`,
  },
];
