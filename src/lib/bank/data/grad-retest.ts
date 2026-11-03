import type { BankQuestion } from "../types";

const S = "grad-retest";

export const GRAD_RETEST: BankQuestion[] = [
  {
    id: "gr-01",
    scenarioId: S,
    type: "英文自我介绍",
    difficulty: 1,
    question: "Please introduce yourself in English.",
    keyPoints: [
      "1～2 分钟：基本信息 → 学业与专业基础 → 科研或实践经历 → 报考动机与规划",
      "突出与报考专业相关的亮点，用具体经历代替形容词",
      "语言简洁自然，避免背诵腔和复杂长句",
      "结尾礼貌致谢",
    ],
    answer: `Good morning, dear professors. It's a great honor to be here for this interview. My name is Li Ming, and I'm a senior student majoring in computer science at a university in Hunan Province.

During my undergraduate years, I built a solid foundation in core courses such as data structures, operating systems and machine learning, and I ranked in the top ten percent of my major.

Outside the classroom, I joined a research project on image recognition led by my supervisor. I was responsible for cleaning the dataset and training several baseline models, and our work was later published as a short paper at a domestic conference. This experience taught me how to read papers, design experiments and learn from failure.

I've chosen to apply to your university because of its strong research in computer vision, and I'm especially interested in medical image analysis. If I have the chance to study here, I hope to deepen my knowledge and contribute to meaningful research.

That's all about me. Thank you very much.`,
  },
  {
    id: "gr-02",
    scenarioId: S,
    type: "动机与规划",
    difficulty: 1,
    question: "你为什么报考我们学校和这个专业？",
    keyPoints: [
      "对专业的兴趣要有来源：课程、项目、实践中的具体经历",
      "对学校的了解要具体：研究方向、团队、平台，而不是只说「名校」",
      "说明个人基础与目标的匹配",
      "态度真诚，避免夸张吹捧",
    ],
    answer: `我报考贵校这个专业，主要有三个原因。

第一，是对专业的兴趣。本科期间，我在「数据库原理」和「机器学习」课程中第一次接触到用数据解决实际问题的方法，后来参加大学生创新项目，做了一个校园用电量预测的小系统。这个过程让我觉得非常有意思，也让我确定想在这个方向上继续深造。

第二，是对贵校的了解。我认真查阅了学院的网站和老师们近几年发表的论文，贵校在数据挖掘与智能决策方向的研究很有特色，特别是在能源大数据方面有很多和企业合作的实际项目，这和我本科阶段的兴趣非常契合。

第三，我觉得自己具备一定的基础。我的专业课成绩比较扎实，有一定的编程和实验能力，也已经阅读过这个方向的一些论文。

所以，我希望能在贵校的平台上，跟随老师们系统地学习和研究，把兴趣变成真正的研究能力。`,
  },
  {
    id: "gr-03",
    scenarioId: S,
    type: "专业与科研",
    difficulty: 2,
    question: "请介绍一下你的本科毕业设计（论文）。你在其中具体做了哪些工作？遇到过什么困难？",
    keyPoints: [
      "说明研究背景和要解决的问题",
      "讲清方法与自己的具体工作，区分个人贡献与团队成果",
      "举一个遇到的困难以及如何解决",
      "说明结果、不足和可改进方向，体现反思能力",
    ],
    answer: `我的毕业设计题目是「基于深度学习的路面裂缝检测方法研究」。

研究背景是，传统的道路巡检主要依靠人工，效率低、漏检多。我的目标是利用无人机拍摄的路面图像，自动识别出裂缝的位置。

我主要做了三方面的工作：第一，整理数据，对两千多张公开数据集的图片和学校合作单位提供的图片进行筛选和标注；第二，以一个常用的语义分割网络为基础，针对裂缝细长的特点，加入了注意力模块，并调整了损失函数；第三，设计对比实验，验证改进的效果。

过程中遇到的最大困难是样本不均衡：图片中裂缝像素只占很小的比例，模型一开始几乎把所有像素都判成「无裂缝」。我查阅了相关论文，尝试了加权交叉熵和 Dice 损失，最后组合使用，使裂缝识别的 F1 值提高了大约八个百分点。

不足之处在于，我的数据主要是晴天拍摄的，在阴影、积水条件下效果还不够好。如果继续研究，我希望引入更多复杂场景的数据，并考虑模型的轻量化，让它能在无人机端实时运行。`,
  },
  {
    id: "gr-04",
    scenarioId: S,
    type: "专业与科研",
    difficulty: 3,
    question: "你读过的一篇印象最深的专业论文是什么？它解决了什么问题？你认为它有什么不足？",
    keyPoints: [
      "选择自己真正读懂的论文，说清题目或核心思想",
      "按「问题 → 方法 → 结果」简要概括",
      "给出自己的评价：亮点与不足，体现批判性思维",
      "联系自己的研究兴趣",
    ],
    answer: `我印象最深的是 Transformer 的那篇经典论文《Attention Is All You Need》。

它要解决的问题是：当时的序列模型主要依赖循环神经网络，需要按顺序逐个处理词语，训练很难并行，长距离的依赖关系也不容易学到。

论文提出完全基于自注意力机制的模型结构，让序列中的每个位置都能直接关注到其他所有位置，同时通过多头注意力从不同角度捕捉信息，并用位置编码弥补顺序信息的缺失。结果在机器翻译任务上取得了更好的效果，训练速度也大大提高。后来的很多大模型都是在它的基础上发展起来的。

我认为它也有一些不足：一是自注意力的计算量和序列长度的平方成正比，处理很长的文本时开销很大，后来很多研究都在想办法降低这一成本；二是模型需要大量数据和算力，在数据少的场景下不一定有优势；三是论文对模型「为什么有效」的解释还比较有限。

这篇论文让我对注意力机制产生了浓厚的兴趣，研究生阶段我希望能在高效注意力机制的方向上做一些探索。`,
  },
  {
    id: "gr-05",
    scenarioId: S,
    type: "动机与规划",
    difficulty: 2,
    question: "研究生阶段你有什么学习和研究规划？毕业后打算做什么？",
    keyPoints: [
      "分阶段规划：研一打基础，研二深入研究，研三完成论文与就业准备",
      "规划要具体可执行，与学校培养方案和导师方向相符",
      "毕业去向要真实合理，可以说明多种可能",
      "体现主动性和执行力",
    ],
    answer: `我把研究生阶段的规划分为三个阶段。

研一，以打基础为主。我会认真学好学位课程，特别是矩阵分析、最优化方法等数学基础课；同时在导师的指导下系统阅读本方向的经典论文和最新进展，坚持写读书笔记，尽早确定自己的研究问题。

研二，以深入研究为主。我会积极参与课题组的项目，在实验中提出并验证自己的想法，争取在毕业前发表一到两篇有质量的论文。同时，我也会提高英文文献阅读和学术写作能力，争取参加一次学术会议。

研三，主要完成毕业论文，并做好就业准备。

关于毕业后的打算，我目前更倾向于到企业的研发部门工作，把研究成果应用到实际产品中。如果在研究过程中发现自己特别适合做科研，我也会考虑继续攻读博士学位。无论选择哪条路，我都希望研究生的这几年能让我真正具备独立发现问题和解决问题的能力。`,
  },
  {
    id: "gr-06",
    scenarioId: S,
    type: "英语口语",
    difficulty: 1,
    question: "What is your hometown like? Please describe it briefly.",
    keyPoints: [
      "说出家乡的位置与基本特点",
      "挑 1～2 个具体细节：美食、风景、生活节奏、变化",
      "加一点个人感受，让回答有温度",
      "句子简单清楚，时态正确",
    ],
    answer: `My hometown is a small city in Sichuan Province, in the southwest of China. It's surrounded by green hills, and a river runs right through the center of the city, so the scenery is really beautiful, especially in spring.

The thing people love most about my hometown is the food. It's famous for spicy dishes, and in the evening, the streets along the river are full of small restaurants and food stalls. My favorite is a kind of spicy noodle soup that I always eat first whenever I go back home.

Over the past ten years, my hometown has changed a lot. There's now a high-speed railway station, and many new parks have been built. But the pace of life is still relaxed, and people like to spend their afternoons drinking tea with friends. I'm proud of my hometown, and I hope more people will visit it.`,
  },
  {
    id: "gr-07",
    scenarioId: S,
    type: "英语口语",
    difficulty: 2,
    question: "Why do you want to pursue a master's degree?",
    keyPoints: [
      "说清真实动机：学术兴趣、能力提升、职业发展",
      "结合具体经历，避免空泛",
      "说明读研与个人目标的关系",
      "语言连贯，可用 first / second / finally 组织",
    ],
    answer: `I want to pursue a master's degree for two main reasons.

First, I'm genuinely interested in research. During my undergraduate studies, I took part in a small project on air-quality prediction. It was the first time I tried to solve an open problem rather than an exercise with a standard answer, and I found the process very exciting. But I also realized how much I still need to learn, especially in statistics and machine learning. A master's program would give me the systematic training I'm missing.

Second, it's important for my career. In my field, many positions in research and development require deeper knowledge and the ability to work independently on complex problems. I believe a master's degree, with guidance from experienced professors, is the best way to build those abilities.

So for me, graduate study is not just about getting a degree. It's about becoming someone who can find problems and solve them independently.`,
  },
  {
    id: "gr-08",
    scenarioId: S,
    type: "综合素质",
    difficulty: 2,
    question: "如果你的研究兴趣和导师安排的课题方向不一致，你会怎么办？",
    keyPoints: [
      "态度：尊重导师安排，认识到课题背后的考虑",
      "先投入：认真完成导师安排的课题，在实践中可能发现新兴趣",
      "沟通：寻找两者的结合点，主动、适时地和导师沟通",
      "体现团队意识与成长心态",
    ],
    answer: `如果遇到这种情况，我会尊重导师的安排，同时积极沟通，寻找两者的结合点。

首先，我会认真对待导师安排的课题。导师安排课题，一般会综合考虑课题组的研究积累、项目需要和学生的培养，有他的考虑。而且我作为研究生新生，对研究方向的认识也还不够深入，很多方向只有真正做进去，才会发现其中的乐趣。所以我会先全身心投入，把安排的任务完成好。

其次，我会主动寻找两者的结合点。很多研究方向之间是相通的，比如课题中用到的方法也许可以应用到我感兴趣的问题上。我会在完成本职任务的基础上，利用课余时间阅读自己感兴趣方向的论文，积累想法。

最后，在合适的时机，我会带着具体的想法和初步的结果，和导师坦诚地交流，听听导师的意见。如果导师认为可行，就可以在课题中适当拓展；如果暂时不合适，我也会理解，并把它作为将来的研究储备。`,
  },
  {
    id: "gr-09",
    scenarioId: S,
    type: "综合素质",
    difficulty: 3,
    question: "你怎么看待学术不端行为？如果你发现同门师兄弟有数据造假的情况，你会怎么做？",
    keyPoints: [
      "明确立场：学术诚信是底线，零容忍",
      "分析危害：误导研究、浪费资源、损害个人和团队声誉",
      "处理方法：先核实，再私下劝其纠正，必要时向导师反映",
      "严格要求自己：规范记录数据、正确引用",
    ],
    answer: `我认为学术诚信是科研工作的底线，对于学术不端行为必须坚决反对。

学术不端的危害很大：一是会误导后续的研究，让别人在错误的结论上浪费时间和资源；二是会损害整个课题组和学校的声誉；三是对当事人自己也是毁灭性的，一旦被发现，多年的努力都可能付诸东流。

如果我发现同门有数据造假的情况，我会这样处理：首先，弄清事实，看看是数据处理上的疏忽和误解，还是有意修改数据，避免误会同学。其次，如果确实存在问题，我会私下和他沟通，讲清楚学术不端的严重后果，劝他尽快更正数据，在论文投稿或发表之前主动纠正错误。最后，如果他拒不改正，并且可能造成严重后果，我会如实向导师反映，由导师来处理。这样做不是为了针对他，而是为了对科研负责，也是对他负责。

同时，我也会严格要求自己：实验数据如实、完整地记录和保存，引用他人成果规范注明，坚守学术诚信。`,
  },
  {
    id: "gr-10",
    scenarioId: S,
    type: "专业与科研",
    difficulty: 2,
    question: "你是跨专业考生，你认为自己有什么优势和劣势？",
    keyPoints: [
      "优势：交叉背景带来的新视角、具体的可迁移能力",
      "劣势：坦诚承认专业基础的不足",
      "弥补措施：已经做了什么、接下来计划怎么做",
      "体现学习能力和决心",
    ],
    answer: `我本科是数学专业，现在报考的是计算机专业，我认为自己既有优势，也有需要弥补的地方。

我的优势主要有两点：第一，数学基础比较扎实。线性代数、概率论、最优化这些课程我学得比较深入，而这些正是机器学习等方向的理论基础，有助于我理解算法背后的原理。第二，跨专业的背景让我更习惯从不同角度看问题，在学习新领域时也锻炼了较强的自学能力。

我的劣势也很明显：计算机的专业课是我自学的，系统性还不够，特别是在工程实践和编程经验方面，和本专业的同学相比还有差距。

为了弥补这些不足，在备考期间，我除了学习考试科目外，还自学了数据结构、操作系统等课程，并用 Python 完成了几个小项目，在网上的编程练习平台上做了两百多道题。如果有幸被录取，我会在入学前继续加强编程训练，入学后多参与课题组的项目实践，尽快补上短板，把数学基础转化为研究上的优势。`,
  },
];
