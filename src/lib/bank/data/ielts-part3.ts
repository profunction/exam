import type { BankQuestion } from "../types";

const S = "ielts-part3";

const P3_POINTS = [
  "观点 → 理由 → 例子 → 小结，作答 40～60 秒",
  "可从不同人群、时代、国家的角度比较分析",
  "使用让步与对比结构：While…, On the other hand…, That said…",
];

export const IELTS_PART3: BankQuestion[] = [
  {
    id: "i3-01",
    scenarioId: S,
    type: "人物与榜样",
    difficulty: 2,
    question: "Why do some young people look up to celebrities rather than people around them?",
    keyPoints: [...P3_POINTS, "可从媒体曝光、生活方式的吸引力、身边人的「平凡感」分析"],
    answer: `I think there are a couple of reasons. The most obvious one is exposure. Young people see celebrities on their phones every day, so these stars feel familiar and attractive, almost like friends. Celebrities also represent a glamorous lifestyle that seems exciting compared with ordinary life.

On the other hand, the people around them, like parents or teachers, are so familiar that young people often take them for granted. Their achievements are less visible, because nobody posts a video of a nurse working a night shift.

That said, I think this usually changes with age. As people grow up and face real challenges, they tend to appreciate the quiet strengths of the people close to them much more.`,
  },
  {
    id: "i3-02",
    scenarioId: S,
    type: "人物与榜样",
    difficulty: 2,
    question: "Do you think the role models for children today are different from those in the past?",
    keyPoints: [...P3_POINTS, "对比过去（英雄、科学家）与现在（网红、运动员、创业者）"],
    answer: `Yes, I'd say they've changed quite a lot. In my parents' generation, children usually looked up to national heroes, scientists or model workers, people who were promoted in textbooks and on television.

Today, partly because of social media, the range is much wider. Kids might admire a professional gamer, a YouTuber or an entrepreneur, and many of these role models became famous quite recently and quite quickly.

I think there's a positive side to this, because children can find someone who matches their own interests. But it also has a downside: some online stars are admired mainly for being rich or famous, not for their character or hard work. So parents and schools have an important role in helping children think about why they admire someone.`,
  },
  {
    id: "i3-03",
    scenarioId: S,
    type: "教育与技能",
    difficulty: 2,
    question: "Is it better to learn practical skills at school or at work?",
    keyPoints: [...P3_POINTS, "辩证：学校打基础（通用技能），工作中学岗位技能"],
    answer: `I think both have their place, but they suit different kinds of skills.

Schools are better for general practical skills that everyone needs, like managing money, cooking basic meals or using computers safely. Teaching these at school ensures that every young person gets them, regardless of their family background.

However, job-specific skills are usually learned more effectively at work. You can read about customer service in a classroom, but you only really learn it when you're dealing with an angry customer. The workplace gives you real situations, immediate feedback and the motivation of real consequences.

So ideally, schools should lay the foundations and offer things like internships, and employers should take responsibility for training people in the specific skills their jobs require.`,
  },
  {
    id: "i3-04",
    scenarioId: S,
    type: "教育与技能",
    difficulty: 3,
    question: "What kinds of skills do you think will be most important in the future?",
    keyPoints: [...P3_POINTS, "技术相关能力 + 机器难以替代的能力（沟通、创造力、适应力）"],
    answer: `I think there are two broad groups. The first is digital and technical skills. As artificial intelligence and automation spread, being able to work with these tools, and understanding data in particular, will be essential in almost every job, not just in tech.

But perhaps more importantly, the second group is skills that machines find hard to replace. Things like creativity, critical thinking, communication and empathy will become even more valuable. A computer can analyze information very quickly, but it's still people who need to ask the right questions, persuade others and understand customers.

And underlying both of these is adaptability. Jobs are changing so fast that the ability to keep learning new things throughout your life might be the most important skill of all.`,
  },
  {
    id: "i3-05",
    scenarioId: S,
    type: "旅行与地点",
    difficulty: 2,
    question: "What are the advantages and disadvantages of tourism for local communities?",
    keyPoints: [...P3_POINTS, "优点：就业收入、基础设施、文化交流；缺点：物价上涨、环境压力、文化商业化"],
    answer: `On the positive side, tourism brings a lot of money into local communities. It creates jobs in hotels, restaurants and shops, and local governments often use the income to improve roads and public facilities. It can also encourage people to protect their traditional culture, because visitors are interested in it.

However, there are clear downsides as well. In popular destinations, prices for housing and everyday goods often rise, which can push local residents out. Large numbers of tourists can damage the environment and create problems like noise and litter. And sometimes local culture becomes too commercialized, turning traditions into performances just for visitors.

So I think tourism is beneficial overall, but it needs careful management, like limiting visitor numbers in sensitive areas.`,
  },
  {
    id: "i3-06",
    scenarioId: S,
    type: "社会与社区",
    difficulty: 2,
    question: "Why do some people not want to help others?",
    keyPoints: [...P3_POINTS, "原因：怕惹麻烦、旁观者效应、忙碌、不信任"],
    answer: `I don't think most people are unwilling to help, but there are several things that hold them back.

One reason is fear of getting into trouble. In China, for example, there have been well-known cases where people helped an elderly person who had fallen and were then wrongly blamed, so some people hesitate. Another reason is what psychologists call the bystander effect: when many people are around, everyone assumes someone else will step in.

Modern life also plays a role. People are busy and stressed, and in big cities we often don't know our neighbors, so there's less sense of community.

The good news is that this can change. Clear laws that protect helpers, and community activities that bring neighbors together, both encourage people to lend a hand.`,
  },
  {
    id: "i3-07",
    scenarioId: S,
    type: "阅读与媒体",
    difficulty: 2,
    question: "Do you think people read less nowadays than in the past?",
    keyPoints: [...P3_POINTS, "区分：长篇书籍阅读减少，但碎片化阅读总量未必减少"],
    answer: `It depends on what we mean by reading. If we're talking about reading books, especially long novels, then yes, I think many people read less than before, because there are so many other forms of entertainment competing for their attention, like short videos and streaming series.

On the other hand, people probably read more text overall than ever before. We read messages, news articles and social media posts all day long. The difference is that this kind of reading is fragmented and quick, so it doesn't build the same concentration or depth of understanding as reading a book.

So I'd say the amount of reading hasn't necessarily dropped, but its quality has changed, and that's something schools and parents should pay attention to.`,
  },
  {
    id: "i3-08",
    scenarioId: S,
    type: "科技与生活",
    difficulty: 3,
    question: "How has technology changed the way people communicate with each other?",
    keyPoints: [...P3_POINTS, "积极：即时、跨距离、多形式；消极：面对面交流减少、误解、信息过载"],
    answer: `Technology has transformed communication in many ways. The most obvious change is speed and distance. We can now message or video call someone on the other side of the world instantly and almost for free, which has made it much easier for families and friends to stay close when they live apart.

Communication has also become more visual. People use photos, emojis and short videos to express themselves, not just words.

However, there are some negative effects. Many people spend less time talking face to face, and it's easy to misunderstand a short text message because you can't hear the tone of voice. There's also pressure to reply immediately, which can be quite stressful.

So overall, technology has made communication more convenient, but perhaps less deep.`,
  },
  {
    id: "i3-09",
    scenarioId: S,
    type: "工作与生活",
    difficulty: 2,
    question: "Why do many people feel so busy these days?",
    keyPoints: [...P3_POINTS, "原因：工作竞争、技术让工作与生活边界模糊、选择过多"],
    answer: `I think there are a few main reasons. First, competition at work has become very intense, especially in big cities, so many people feel they need to work longer hours just to keep their jobs or get promoted.

Second, technology has blurred the line between work and personal life. Because we can be contacted at any time through our phones, many people end up answering work messages in the evening and at weekends, so they never really switch off.

Third, people simply have more options than before. There are so many things we feel we should do, like exercising, learning new skills and keeping up with friends online, that our free time fills up quickly.

So in a way, the feeling of being busy comes from both outside pressure and our own expectations.`,
  },
  {
    id: "i3-10",
    scenarioId: S,
    type: "决策与选择",
    difficulty: 3,
    question: "Should parents make important decisions for their children, such as choosing a university major?",
    keyPoints: [...P3_POINTS, "辩证：父母提供经验与建议，但最终决定应由孩子作出"],
    answer: `I believe parents should be involved, but they shouldn't make the final decision.

Parents usually have more life experience and a better understanding of the job market, so their advice can be really valuable. Many teenagers don't know much about what different careers actually involve, and parents can help them think things through.

However, it's the child who will spend four years studying the subject and possibly decades working in that field. If they're forced into a major they don't like, they're likely to lose motivation and may even end up changing paths later, which wastes time and money.

So I think the ideal approach is a discussion. Parents can share information and concerns, but young people should make the final choice and take responsibility for it. That's also an important step in becoming independent.`,
  },
];
