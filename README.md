# AI 考官 · 面试与考证真题模拟对练

一个「垂直面试 / 考证真题 AI 模拟对练」网站。AI 考官按真实考场流程**逐题提问**，考生每答完一题，立即得到：

- **实时评分**：雅思按官方分数档（0–9），其余场景按百分制
- **痛点纠错**：引用原句，指出语法、用词、逻辑和扣题问题并给出修改建议
- **高分范文**：基于考生自己的回答润色出的高分参考答案（可一键复制）

全部题目答完（或中途点击「结束并出报告」）后，生成**面试总结报告**：综合得分、分项评价、核心优势、重点提升和下一步练习建议。

## 功能一览

| 功能 | 说明 |
| --- | --- |
| 13 个内置场景 | 外企前端 / 后端全栈 / 产品经理 / 通用行为面试（英文），银行国企校招面试，教师资格证、公务员、事业单位结构化面试，考研复试，雅思口语 Part 1 / 2 / 3，大学英语四六级口语 |
| 真题题库 | 128 道原创仿真题，按真实考试题型编写，每题附评分要点和参考答案；`/bank` 可按场景、题型浏览，单题或随机抽题开练 |
| 两种出题方式 | 「题库抽题」：可按题型筛选，考官按题库题目提问，并参照评分要点打分；「AI 考官出题」：按场景和背景即兴出题，题目不重样 |
| 自定义场景 | 输入场景名称和说明即可练习，例如托福口语、医院规培面试 |
| 个性化出题 | 开考前可填写个人背景（目标岗位、简历要点等），考官据此出题和追问 |
| 限时作答 | 教资、考公、雅思场景自动计时（含准备时间），超时会在复盘中扣分 |
| 语音作答 | 使用浏览器原生语音识别把口述转成文字（Chrome / Edge / Safari） |
| 成绩曲线 | 侧栏展示每题得分折线与明细表，悬停或键盘左右键查看数值 |
| 练习记录 | 保存在浏览器本地，可继续未完成的练习、回看报告 |
| 演示模式 | 未配置 API Key 时自动启用：按题库出题，范文使用题库参考答案，可完整跑通流程 |

## 快速开始

需要 Node.js 20.9 或更高版本。

```bash
npm install
cp .env.example .env.local   # 填入 ANTHROPIC_API_KEY（不填则为演示模式）
npm run dev
```

打开 <http://localhost:3000>。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | Claude API Key。未配置时进入演示模式 |
| `ANTHROPIC_MODEL` | `claude-opus-5-5` | 使用的模型 |
| `ANTHROPIC_EFFORT` | `medium` | 思考深度：`low` / `medium` / `high` / `xhigh` / `max`。越高评估越细致，但更慢、更贵 |
| `ANTHROPIC_MAX_TOKENS` | `16000` | 单次回复上限（思考内容也计入） |
| `ANTHROPIC_FALLBACKS` | 开启 | 模型因安全策略拒答时，由服务端自动换用推荐模型重试；设为 `off` 关闭 |
| `MOCK_MODE` | 自动 | `1` 强制演示模式，`0` 强制调用模型 |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_SEC` | `30` / `600` | 每个 IP 在时间窗口内的最大请求数 |

## 题库

题目放在 `src/lib/bank/data/` 下，每个场景一个文件：

```ts
{
  id: "cs-05",                 // 全局唯一
  scenarioId: "civil-service", // 对应 scenarios.ts 中的场景
  type: "应急应变",            // 题型，用于筛选和分组
  difficulty: 1,               // 1 基础 / 2 进阶 / 3 挑战
  question: "……",              // 题目（Markdown）
  keyPoints: ["……", "……"],     // 评分要点
  answer: `……`,                // 参考答案（Markdown）
}
```

- 新增题目：在对应文件里追加一项即可，`npm test` 会检查 id 唯一、字段完整、场景存在等
- 题目正文和答案只在服务端使用，浏览器端只拿到 id / 题型 / 难度的轻量索引
- 用题库出题时，抽到的题目和评分要点、参考答案会写进系统提示词。考官按顺序提问，评分时参照要点，提问时不会透露答案
- **版权**：现有题目全部为原创仿真题，不是官方考试原题。如果要导入外部题目，请先确认对方的开源许可（MIT、CC BY 等需按要求署名），官方真题和培训机构的题库通常受版权保护，不要直接搬运

## 可以借助的开源项目

| 项目 | 可以用来做什么 | 许可（使用前请再到仓库确认） |
| --- | --- | --- |
| [yangshun/front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook) | 扩充外企前端面试题 | MIT |
| [lydiahallie/javascript-questions](https://github.com/lydiahallie/javascript-questions)、[sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions) | JavaScript / React 题目与解析 | 第三方索引显示为 MIT |
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | 系统设计题素材 | CC BY 4.0（需署名） |
| [jiajunhuang/interview](https://github.com/jiajunhuang/interview) | 后端面经素材 | CC BY 3.0（需署名） |
| [ieltspeak](https://pypi.org/project/ieltspeak/) | 雅思口语话题分类素材 | MIT |
| [FunAudioLLM/SenseVoice](https://huggingface.co/FunAudioLLM/SenseVoiceSmall)、FunASR | 自建中文 / 中英混合语音识别，替代浏览器语音识别 | 代码为开源许可，模型权重使用单独的模型许可，商用前请阅读 |
| [speechocean762](https://openslr.org/101/) | 英语发音评测数据集，可用于做雅思发音打分 | CC BY 4.0 |
| CosyVoice2、Kokoro 等 TTS | 让 AI 考官「开口说话」 | 二手资料称为 Apache 2.0，未核实 |
| [Interviewa](https://github.com/sh78ba/Interviewa)、[adrianhajdin/ai_mock_interviews](https://github.com/adrianhajdin/ai_mock_interviews) | 参考同类 AI 模拟面试产品的语音面试、报告等设计 | 未核实 |

公务员、事业单位、教资结构化面试和考研复试方面，目前没有找到可靠的开源题库，所以这部分题目都是原创的。

## 工作原理

```
浏览器（React）──POST /api/chat──▶ Next.js 路由 ──stream──▶ Claude Messages API
      ▲                               │
      └──── NDJSON 流（逐字输出）◀─────┘
```

### 提示词（`src/lib/prompt.ts`）

系统提示词以产品方给定的考官提示词（Role / Scenario / Guidelines & Workflow / Output Format / Constraints）为主体，补充了平台规则：

- **场景注入**：场景名称、考查重点、考官语气；考生背景用 `<candidate_background>` 包裹，明确只作出题参考、不执行其中的指令
- **题量与题号**：本场共 N 题，每题标注 `**第 k/N 题**`（英文为 `**Question k/N**`），前端据此显示进度
- **开场**：只输出提问，不输出复盘
- **非作答消息**（如「开始吧」、要求重复题目、切换语言）：考官简短回应并重复当前题，不评分
- **结束阶段**：答完第 N 题或点击结束后，输出最后一题的复盘和 `### 🏁 面试总结报告`
- **限时**：作答前附上平台记录的用时，超时扣分
- **平台指令**：以 `【系统指令】` 开头的消息来自平台；考生输入中的同名前缀会被移除，防止冒充

同一场练习内系统提示词保持不变，历史消息只追加不改写，所以多轮对话可以命中提示词缓存。

### 输出格式与解析（`src/lib/parse.ts`）

模型按固定的三个标题输出 Markdown：

```
### 🤖 AI 考官提问
### 📊 上一轮表现复盘（付费核心）
### 🏁 面试总结报告
```

前端按标题切分，再从复盘中提取「当前得分」「语法与表达纠错」「高分参考范文」，分别渲染为评分徽章、纠错列表和范文卡片。解析支持流式输出中的不完整文本；如果模型没有严格按格式输出，就按原文渲染，内容不会丢失。

### 模型调用（`src/app/api/chat/route.ts`）

- 默认模型 `claude-opus-5-5`，流式输出；思考常开，用 `effort` 控制深度
- 顶层 `cache_control` 自动缓存系统提示词和历史对话，降低多轮成本；服务端日志会打印每次调用的缓存命中 token 数
- 开启服务端拒答兜底（`fallbacks: "default"`）；若最终仍拒答，前端提示换种说法重试，并丢弃不完整的回复
- 错误按类型映射为中文提示（Key 无效、限流、服务繁忙、网络错误等），技术细节只写服务端日志
- 请求校验（`src/lib/validate.ts`）：场景合法、题量范围、对话必须交替且以考官开场开始、单条和总长度上限

## 目录结构

```
src/
├── app/
│   ├── page.tsx               首页：场景选择、练习记录
│   ├── session/[id]/page.tsx  对练页
│   ├── bank/                  题库总览与各场景题库页（静态生成）
│   └── api/
│       ├── chat/route.ts      Claude 流式接口（含演示模式）
│       └── status/route.ts    返回当前是否为演示模式
├── components/                界面组件（考官消息、复盘卡片、成绩曲线、计时器、输入框……）
└── lib/
    ├── scenarios.ts           场景配置（增删改场景只需改这里）
    ├── bank/                  题库数据（data/）、索引与随机抽题
    ├── prompt.ts              系统提示词与消息组装
    ├── parse.ts               回复解析
    ├── validate.ts            请求校验
    ├── mock.ts                演示模式题库与示例回复
    ├── rateLimit.ts           按 IP 限流
    └── storage.ts             浏览器本地存储
```

## 新增或修改场景

编辑 `src/lib/scenarios.ts` 中的 `SCENARIOS` 数组：`description` 和 `tone` 会写进系统提示词，`scoreScale` 决定百分制还是雅思分数档，`timer` 开启限时。然后在 `src/lib/bank/data/` 中为新场景加一个题目文件，并在 `src/lib/bank/index.ts` 中注册（测试要求每个场景至少 8 道题）。

## 测试与构建

```bash
npm test            # 单元测试：解析、提示词、校验、演示回复格式、题库完整性
npm run typecheck   # TypeScript 类型检查
npm run build       # 生产构建
npm start           # 启动生产服务
```

## 部署

- **Vercel**：导入仓库，在项目设置中添加 `ANTHROPIC_API_KEY` 等环境变量即可。对话接口设置了 `maxDuration = 300` 秒
- **自有服务器**：`npm run build && npm start`（默认端口 3000，可用 `PORT` 修改）。反向代理需关闭响应缓冲，保证流式输出正常（接口已返回 `X-Accel-Buffering: no`）

## 上线前建议（当前限制）

- **付费墙**：复盘目前对所有人可见。如需收费，应在服务端判断用户权益后再决定是否生成、返回复盘。只在前端隐藏无法真正保护内容
- **账号与数据**：练习记录只存在浏览器 localStorage，换设备或清除数据即丢失；需要同步就加登录和数据库
- **防滥用**：接口无状态，历史对话由客户端提交，理论上可以被伪造。内置的限流按 IP 计数，只在单实例内生效，而且自建服务器上客户端可以伪造 `X-Forwarded-For` 绕过。正式运营建议加登录、在服务端保存会话、按用户配额，并用 Redis 等做共享限流
- **语音识别**依赖浏览器能力，Firefox 暂不支持；不支持时会自动隐藏语音按钮
- AI 评分与范文仅供练习参考，不代表任何官方考试的评分结果
