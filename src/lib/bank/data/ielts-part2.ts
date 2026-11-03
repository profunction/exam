import type { BankQuestion } from "../types";

const S = "ielts-part2";

const P2_POINTS = [
  "准备 1 分钟时只写关键词；陈述接近 2 分钟（约 230～280 词）",
  "按话题卡要点顺序展开，最后一点（explain why/how）要多讲",
  "加入具体细节、感受和小故事，时态保持一致",
];

export const IELTS_PART2: BankQuestion[] = [
  {
    id: "i2-01",
    scenarioId: S,
    type: "人物",
    difficulty: 2,
    question: `Describe a person who has influenced you a lot.

You should say:
- who this person is
- how you know this person
- what this person has done
- and explain why this person has influenced you.`,
    keyPoints: [...P2_POINTS, "可用词：role model, patient, broaden my outlook, I owe a lot to"],
    answer: `I'd like to talk about my high school chemistry teacher, Mr. Zhang, who has probably influenced me more than anyone outside my family.

I first met him when I was sixteen. At that time, chemistry was my weakest subject, and to be honest, I had more or less given up on it. Mr. Zhang was in his fifties, quite soft-spoken, and he always wore the same grey jacket, so at first he didn't seem particularly special.

What changed my mind was the way he taught. Instead of making us memorize formulas, he brought everyday things into the classroom, like baking soda, vinegar and even a rusty bike chain, and asked us to work out what was happening before he explained anything. He was also incredibly patient. Every Wednesday he stayed after school for an hour to answer questions, and I started going regularly. Slowly, the subject began to make sense, and by the end of the year, chemistry had become one of my best subjects.

The reason he influenced me so much isn't really about chemistry, though. He showed me that being "bad" at something usually just means you haven't found the right way to learn it yet. Whenever I struggle with something new now, like learning English, I remind myself of that. He also made me realize how much a teacher can change a student's life, and that's partly why I'm considering a career in education. I still send him a message every Teachers' Day, and I genuinely owe a lot to him.`,
  },
  {
    id: "i2-02",
    scenarioId: S,
    type: "地点",
    difficulty: 2,
    question: `Describe a place you visited that you would like to go back to.

You should say:
- where it is
- when you went there
- what you did there
- and explain why you would like to go back.`,
    keyPoints: [...P2_POINTS, "可用词：breathtaking, off the beaten track, recharge, unforgettable"],
    answer: `The place I'd love to go back to is Dali, an old town in Yunnan Province in southwest China. It sits between a large lake called Erhai and a range of mountains, so the scenery is absolutely breathtaking.

I went there two summers ago with my university roommates, right after our final exams. We stayed for five days in a small family-run guesthouse in the old town, with a courtyard full of flowers and a cat that slept on our bags every morning.

We did quite a lot in those five days. We rented bicycles and rode along the lake, stopping in tiny villages that felt a bit off the beaten track. We tried the local food, especially a kind of grilled cheese made from cow's milk, which sounds strange but is delicious. One evening we climbed part of the mountain to watch the sunset over the lake, and I still remember how the sky turned pink and orange while the whole town below us lit up.

There are a few reasons I'd like to return. First, the pace of life there is very slow, and I found it really helped me recharge after a stressful semester. Second, we only saw a small part of the area, and I'd love to hike further into the mountains next time. But most of all, that trip was the last long holiday I had with those friends before we went in different directions after graduation, so going back would feel like revisiting a really happy chapter of my life.`,
  },
  {
    id: "i2-03",
    scenarioId: S,
    type: "技能与学习",
    difficulty: 2,
    question: `Describe a skill you learned that you think is useful.

You should say:
- what the skill is
- when and how you learned it
- how often you use it
- and explain why you think it is useful.`,
    keyPoints: [...P2_POINTS, "可用词：trial and error, come in handy, from scratch, second nature"],
    answer: `A skill I learned that has turned out to be really useful is cooking, and I mean proper everyday cooking, not just boiling instant noodles.

I learned it about three years ago, when I moved out of my parents' home to start university. In my first month, I lived on takeaway and quickly realized it was expensive and not very healthy. So I decided to learn from scratch. I watched short cooking videos online, called my mum almost every weekend to ask for her recipes, and learned a lot through trial and error. I burned quite a few pots of rice in the beginning, but after a couple of months, I could make five or six dishes confidently.

These days I cook around four times a week, usually simple things like stir-fried vegetables, tomato and egg, or a big pot of soup that lasts for two days. It has become second nature, so it doesn't feel like a chore anymore.

I think it's useful for several reasons. Most obviously, it saves money and it's much healthier than eating out all the time. But it also comes in handy socially. When friends visit, cooking for them is a great way to spend time together, and it's always a nice surprise for my parents when I cook dinner for them during the holidays. On top of that, I find cooking quite relaxing. After a long day of studying, chopping vegetables and listening to music helps me switch off, so for me it's not just a practical skill but also a way to look after myself.`,
  },
  {
    id: "i2-04",
    scenarioId: S,
    type: "事件与经历",
    difficulty: 2,
    question: `Describe a time when you helped someone.

You should say:
- who you helped
- when and where it happened
- how you helped this person
- and explain how you felt about it.`,
    keyPoints: [...P2_POINTS, "可用词：lend a hand, at a loss, it dawned on me, rewarding"],
    answer: `I'd like to talk about a time I helped an elderly man at a train station last winter.

It was during the Spring Festival travel rush, so the station in my city was incredibly crowded. I was waiting for my train home when I noticed an old man standing in front of a ticket machine, looking completely at a loss. He was holding his phone in one hand and a crumpled piece of paper in the other.

I went over and asked if I could lend a hand. It turned out his son had bought him a ticket online and sent him a message with the details, but he didn't know how to collect it, and his train was leaving in about twenty minutes. He also wasn't sure which gate to go to.

So first, I helped him find the ticket information on his phone and showed him that he could just scan his ID card at the gate, without a paper ticket. Then I checked the departure board, and because his gate was on the other side of the station, I walked him there and carried one of his bags. We made it with about five minutes to spare. On the way, he told me he was going to visit his grandchildren for the first time in two years.

I felt really happy afterwards, and a bit moved, to be honest. It was such a small thing for me, but it dawned on me how confusing modern technology can be for older people. It was a rewarding experience, and since then I've been more patient when helping my own grandparents with their phones.`,
  },
  {
    id: "i2-05",
    scenarioId: S,
    type: "物品",
    difficulty: 2,
    question: `Describe a book you read that you found useful.

You should say:
- what the book is
- when you read it
- what it is about
- and explain why you found it useful.`,
    keyPoints: [...P2_POINTS, "可用词：down-to-earth, put into practice, eye-opening, procrastinate"],
    answer: `The book I'd like to talk about is "Atomic Habits" by James Clear. It's a self-help book about how small habits can lead to big changes over time.

I read it during my first year at university. At that time, I had a real problem with procrastination. I'd plan to study for three hours and end up scrolling on my phone instead, and I was feeling quite frustrated with myself. A friend recommended this book, and I finished it in about a week.

The main idea is that you shouldn't focus on huge goals, but on improving by just one percent every day. The author explains that habits are built through cues, cravings, responses and rewards, and he gives lots of practical tips. For example, if you want to build a good habit, you should make it obvious and easy, like putting your running shoes next to your bed. And if you want to break a bad habit, you should make it harder, like leaving your phone in another room while you study.

I found it useful because the advice is so down-to-earth and easy to put into practice. After reading it, I started studying in two short, focused sessions every evening and kept my phone in a drawer. It sounds simple, but my grades improved noticeably that semester. More importantly, the book changed the way I think about change itself. It was eye-opening to realize that I didn't need more willpower, just a better system, and I still use some of those ideas today when I want to learn something new.`,
  },
  {
    id: "i2-06",
    scenarioId: S,
    type: "事件与经历",
    difficulty: 3,
    question: `Describe an important decision you made.

You should say:
- what the decision was
- when you made it
- how you made it
- and explain why it was important.`,
    keyPoints: [...P2_POINTS, "可用词：weigh up the pros and cons, step out of my comfort zone, in hindsight, turning point"],
    answer: `One of the most important decisions I've made was choosing to study computer science at university instead of accounting, which was what my parents had planned for me.

I made the decision in the summer after my college entrance exam, when I had about two weeks to fill in my university application. My parents both work in finance, and they felt accounting would give me a stable career. For a long time, I just assumed I would follow that path.

But during my last year of high school, I'd started teaching myself a bit of programming to build a simple website for our school club, and I found it fascinating. So instead of making a quick decision, I tried to weigh up the pros and cons carefully. I talked to two of my cousins, one an accountant and one a software engineer, about what their work was really like. I also looked at the course content of both majors and asked myself which one I'd still enjoy after four years. Finally, I sat down with my parents and explained my reasoning. They were worried at first, but they could see I'd thought it through, and in the end they supported me.

The decision was important because it was the first time I took responsibility for my own future rather than just following expectations. It meant stepping out of my comfort zone, because computer science turned out to be much harder than I expected. But in hindsight, it was a real turning point. I'm now doing an internship at a tech company, and I genuinely enjoy what I do every day.`,
  },
  {
    id: "i2-07",
    scenarioId: S,
    type: "物品",
    difficulty: 2,
    question: `Describe a piece of technology (for example, an app) that you use often.

You should say:
- what it is
- how often you use it
- what you use it for
- and explain how it has changed your life.`,
    keyPoints: [...P2_POINTS, "可用词：indispensable, user-friendly, keep track of, a game changer"],
    answer: `The piece of technology I'd like to talk about is a navigation and maps app on my phone. It's probably one of the apps I couldn't live without.

I use it pretty much every day, sometimes several times a day. Whenever I'm going somewhere I haven't been before, even just a new restaurant in my own city, I open it up.

I mainly use it for three things. The first is getting directions, whether I'm walking, cycling or taking public transport. It tells me exactly which metro line to take and even which carriage is closest to the exit, which is incredibly handy. The second is checking traffic in real time, so I can decide whether to take a taxi or the subway. And the third is discovering places. If I want to find a good coffee shop nearby, I can read reviews and see photos before I go.

It has changed my life in quite a few ways. Before I had it, I used to get lost quite often, and I was always a bit anxious about going to unfamiliar places. Now I feel much more confident exploring new areas, both in my own city and when I'm traveling. It also saves me a lot of time, because I can plan my route and avoid traffic jams. Of course, I've become a bit too dependent on it. I'm not sure I could find my way around without my phone anymore. But overall, it's been a real game changer, and it has made my daily life much more efficient and a lot less stressful.`,
  },
  {
    id: "i2-08",
    scenarioId: S,
    type: "事件与经历",
    difficulty: 2,
    question: `Describe a time when you were very busy.

You should say:
- when it was
- what you had to do
- how you managed your time
- and explain how you felt during that period.`,
    keyPoints: [...P2_POINTS, "可用词：juggle, run off my feet, prioritize, a sense of achievement"],
    answer: `The busiest time I can remember was the last month of my second year at university, around June last year.

During those few weeks, I had to juggle several things at once. I had four final exams, a group project for my marketing course that we had to present, and on top of that, I was helping to organize our department's graduation party, because I was on the student committee. I was also still doing my part-time job at a café two evenings a week. Honestly, I was running off my feet.

To manage my time, the first thing I did was write everything down in a planner and prioritize. Exams came first, so I blocked out every morning for revision, when my mind is clearest. Afternoons were for the group project, and I suggested we split the work clearly so we didn't waste time in long meetings. For the party, I delegated some tasks, like decorations and music, to other committee members instead of trying to do everything myself. I also asked my manager at the café if I could take one week off before the exams, and luckily she agreed.

During that period, I felt quite stressed and tired, especially in the first week, when I didn't have a clear plan. I wasn't sleeping well and kept worrying about forgetting something. But once I organized everything, I felt much more in control. When it was all over, the exams went well, our presentation got good feedback, and the party was a success, so I had a great sense of achievement. It also taught me that planning and asking for help are much more effective than just working longer hours.`,
  },
];
