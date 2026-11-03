import type { BankQuestion } from "../types";

const S = "foreign-frontend";

export const FOREIGN_FRONTEND: BankQuestion[] = [
  {
    id: "fe-01",
    scenarioId: S,
    type: "自我介绍与项目",
    difficulty: 1,
    question: "Tell me about yourself, and walk me through the most impactful front-end project you've worked on recently.",
    keyPoints: [
      "开头 2～3 句概括：当前角色、年限、主力技术栈",
      "用 STAR 讲一个项目：背景与问题 → 你的职责 → 关键技术行动 → 量化结果",
      "突出你个人的判断和影响力，而不是只描述团队做了什么",
      "结尾点题：为什么这段经历让你适合这个岗位",
    ],
    answer: `Sure. I'm a front-end engineer with six years of experience. I currently lead the web team for a B2B analytics product, working mainly with React, TypeScript and Node.js.

The project I'm most proud of is rebuilding our reporting dashboard. Our largest customers complained that reports took up to eight seconds to load and sometimes froze the browser. I owned the front-end side of the rewrite. I profiled the app first and found two root causes: we rendered thousands of table rows at once, and we fetched the same data several times whenever a filter changed.

So I introduced row virtualization, moved data fetching into a shared cache with request de-duplication, and split the charting library into a lazily loaded chunk. As a result, the initial load dropped from eight seconds to under two, and performance-related support tickets fell by about seventy percent. I also wrote a short performance checklist that the team now uses in code review.

I'm looking for a role where I can keep working on large, performance-sensitive products, which is exactly why this position caught my attention.`,
  },
  {
    id: "fe-02",
    scenarioId: S,
    type: "JavaScript 原理",
    difficulty: 2,
    question: "Can you explain the JavaScript event loop? What's the difference between microtasks and macrotasks?",
    keyPoints: [
      "JS 在单线程上运行：调用栈 + 任务队列",
      "宏任务：定时器、I/O、用户事件；微任务：Promise 回调、queueMicrotask、MutationObserver",
      "每执行完一个宏任务，就清空全部微任务，之后浏览器才可能渲染",
      "举一个输出顺序的例子，并联系实际：长任务阻塞交互、微任务过多会饿死渲染",
    ],
    answer: `JavaScript runs on a single main thread, and the event loop is what lets it handle asynchronous work without blocking.

At any moment there's a call stack with the code that's currently running. When we schedule asynchronous work, its callback gets queued. Callbacks from timers, network events and user input go into the task queue, which people often call macrotasks. Promise reactions, queueMicrotask and MutationObserver callbacks go into the microtask queue.

The loop takes one task, runs it to completion, then drains the entire microtask queue, including any microtasks added along the way, and only then lets the browser render and pick the next task. So if I log A, schedule a setTimeout that logs B, resolve a promise whose then-callback logs C, and finally log D, the output is A, D, C, B.

This matters in practice. A long task blocks rendering and input, so I break heavy work into chunks or move it to a Web Worker. And because microtasks run before rendering, an endless chain of them can freeze the UI.`,
  },
  {
    id: "fe-03",
    scenarioId: S,
    type: "React",
    difficulty: 2,
    question: "How does React decide when to re-render a component, and what do you do to avoid unnecessary re-renders?",
    keyPoints: [
      "触发重渲染：自身 state 变化、父组件重渲染、订阅的 context 变化",
      "重渲染不等于 DOM 更新：先协调比对，再提交差异",
      "优先做结构调整：状态下放、拆分组件、children 作为 props",
      "再用 memo + 稳定的 props（useMemo / useCallback）、拆分 context；先用 Profiler 测量",
    ],
    answer: `A component re-renders when its own state changes, when its parent re-renders, or when a context it consumes changes. A re-render doesn't necessarily touch the DOM, though. React renders a new tree, compares it with the previous one, and only commits the actual differences.

Most unnecessary re-renders come from state living too high in the tree, so my first step is structural. I move state down to the component that actually needs it, or split a large component so the frequently changing part is isolated. Passing children as props also helps, because those elements don't re-render when the wrapper's state changes.

When that isn't enough, I wrap expensive children in React.memo and keep their props stable with useMemo and useCallback. For context, I separate values that change often from values that rarely change, so one update doesn't re-render every consumer.

Most importantly, I measure with the React DevTools Profiler before optimizing anything. In newer setups the React Compiler handles most memoization automatically, so manual memo becomes the exception.`,
  },
  {
    id: "fe-04",
    scenarioId: S,
    type: "性能优化",
    difficulty: 2,
    question: "Our dashboard takes six seconds to load on mobile. How would you investigate and improve its performance?",
    keyPoints: [
      "先测量：Lighthouse / WebPageTest / 真实用户数据，关注 LCP、INP、CLS",
      "定位瓶颈：网络（包体积、请求瀑布）、主线程（长任务）、数据（慢接口、串行请求）",
      "对症优化：代码分割与懒加载、并行请求与缓存、骨架屏与流式渲染、图片优化",
      "守住成果：性能预算 + CI 回归检测",
    ],
    answer: `I'd start by measuring rather than guessing. I'd run Lighthouse and WebPageTest with a throttled mid-range phone profile, and check real-user data if we collect it, focusing on the Core Web Vitals: Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift.

Then I'd find out where the six seconds actually go. It's usually one of three things: the network, such as a huge JavaScript bundle or a request waterfall; the main thread, with long tasks parsing and executing scripts; or data, where the page waits on slow or sequential API calls.

The fixes follow from the diagnosis. For bundles, I'd add route-level code splitting, lazy-load heavy chart libraries and remove unused dependencies. For data, I'd parallelize requests, cache responses, and render the page shell with skeletons so content appears progressively; server-side or streaming rendering helps a lot here. For images, I'd serve modern formats at the right size and lazy-load anything below the fold.

Finally, I'd protect the gains with a performance budget in CI, so a change that adds two hundred kilobytes gets flagged before it ships.`,
  },
  {
    id: "fe-05",
    scenarioId: S,
    type: "工程化与架构",
    difficulty: 3,
    question: "How would you design the front-end architecture for a large application that several teams work on?",
    keyPoints: [
      "从团队边界出发：按业务域拆分，每个团队端到端负责自己的模块",
      "默认 Monorepo + 模块化，并说明何时才值得上微前端（独立部署需求）及其代价",
      "共享层：设计系统、类型化 API 契约、统一的数据获取约定、代码归属",
      "质量保障：CI 中的类型检查、测试、包体积检查",
    ],
    answer: `I'd start from team boundaries rather than technology. The goal is for each team to build, test and ship its own business area with as little coordination as possible.

My default would be a monorepo with a package per domain, for example billing, reporting and settings, plus shared packages for the design system, API clients and utilities. Tools like Nx or Turborepo give us incremental builds and let us enforce dependency rules, so billing can't reach into reporting's internals.

I'd only move to micro-frontends if teams genuinely need independent deployments or different release cycles, because they bring real costs: duplicated dependencies, harder shared state and a more complex runtime.

Whatever the structure, a few things must stay consistent: a design system so the product feels like one app, typed API contracts generated from the backend schema, shared conventions for data fetching and caching, and a code-owners file so reviews reach the right people.

Finally, I'd invest in CI, with type checks, tests and bundle-size checks on every pull request. That's what keeps a multi-team codebase healthy over the years.`,
  },
  {
    id: "fe-06",
    scenarioId: S,
    type: "浏览器与网络",
    difficulty: 2,
    question: "What happens between typing a URL into the browser and seeing the page rendered?",
    keyPoints: [
      "查缓存 → DNS 解析 → 建立连接（TCP + TLS，或 HTTP/3 的 QUIC）→ 发送请求",
      "边下载边解析 HTML 生成 DOM；CSS 生成 CSSOM 且阻塞渲染；同步脚本阻塞解析",
      "样式计算 → 布局 → 绘制 → 合成",
      "联系优化：缩短关键路径、defer/async、预连接、避免强制同步布局",
    ],
    answer: `First, the browser checks its caches. If it needs the network, it resolves the domain through DNS, opens a connection, which means TCP plus a TLS handshake, or QUIC for HTTP/3, and sends the HTTP request. Service workers and HTTP caching can short-circuit parts of this.

As the HTML arrives, the browser parses it incrementally into the DOM. Along the way it discovers stylesheets, which become the CSSOM, and scripts. A classic synchronous script blocks parsing, which is why we use defer, async or module scripts. CSS is render-blocking, because the browser won't paint unstyled content.

With the DOM and CSSOM ready, the browser computes styles, runs layout to work out each element's size and position, paints pixels into layers, and finally composites those layers, usually on the GPU.

Knowing this pipeline guides optimization: keep the critical path short, preload critical resources, defer non-essential JavaScript, preconnect to important origins, and avoid layout thrashing, where code alternates between reading layout values and writing styles in a loop.`,
  },
  {
    id: "fe-07",
    scenarioId: S,
    type: "JavaScript 原理",
    difficulty: 1,
    question: "What's the difference between var, let and const? And what is a closure?",
    keyPoints: [
      "var：函数作用域、变量提升（初始值 undefined）、可重复声明",
      "let / const：块级作用域、暂时性死区；const 是绑定不可变，对象内容仍可修改",
      "闭包：函数记住创建时的词法环境，外层函数返回后仍能访问其变量",
      "举例：计数器工厂、防抖；常见坑：循环中用 var 的回调、React 中的过期闭包",
    ],
    answer: `var is function-scoped and hoisted with an initial value of undefined, so you can reference it before its declaration without an error, and you can declare it twice. let and const are block-scoped, and they stay in a temporal dead zone until their declaration runs, so using them too early throws an error. const means the binding can't be reassigned, but if it holds an object, the object itself can still be changed.

A closure is a function together with the lexical environment it was created in. In other words, an inner function keeps access to the variables of its outer function even after the outer function has returned.

A classic example is a counter factory: a function declares a local count and returns another function that increments it, so each counter keeps its own private state. I use closures all the time, in debounce and throttle helpers, for example, and in React hooks, where a stale closure is a common bug when a dependency is missing.

The well-known pitfall is using var in a loop with setTimeout: every callback sees the same variable and logs the final value. Switching to let fixes it, because each iteration gets a fresh binding.`,
  },
  {
    id: "fe-08",
    scenarioId: S,
    type: "行为面试",
    difficulty: 2,
    question: "Tell me about a time you disagreed with a product manager or a designer. How did you handle it?",
    keyPoints: [
      "STAR 结构，选一个真实、具体的分歧",
      "先理解对方的目标，再用数据、原型或用户测试说话，而不是比谁声音大",
      "给出折中方案并说明取舍",
      "量化结果 + 反思：关系和产品都变得更好",
    ],
    answer: `In my last role, our designer proposed an infinite-scroll transaction history with rich animations. I was worried, because many of our users were on low-end Android phones, and our data showed they usually came to the page to find one specific transaction.

Instead of just pushing back, I asked about the goal first. The designer wanted the page to feel modern and more engaging. So I spent a day building two quick prototypes: the animated infinite scroll, and a paginated list with search and lighter transitions. We tried both on a cheap Android phone with five colleagues from the support team.

The test made the trade-off obvious. The animated version dropped frames, and people struggled to find older transactions. We agreed on a hybrid: search and filters at the top, simple pagination, and a subtle animation only for new items.

After launch, the time it took users to find a transaction dropped by about thirty percent, and the designer and I made quick prototype tests a regular habit. What I learned is that disagreements are much easier to resolve with a shared goal and evidence rather than opinions.`,
  },
  {
    id: "fe-09",
    scenarioId: S,
    type: "工程化与架构",
    difficulty: 2,
    question: "How do you make sure front-end code quality stays high in a team?",
    keyPoints: [
      "自动化静态检查：TypeScript strict、ESLint（含 hooks、无障碍规则）、Prettier",
      "测试分层：纯逻辑单测、组件测试、关键流程端到端测试，重价值不重覆盖率数字",
      "流程：CI 门禁、预览环境、Code Review 清单",
      "线上：错误监控、真实用户性能数据；线上 bug 补一个能拦住它的测试",
    ],
    answer: `I think about quality in layers.

The first layer catches problems automatically before anyone reviews the code: TypeScript in strict mode, ESLint with rules for hooks and accessibility, and Prettier, so we never argue about formatting.

The second layer is testing, focused on value rather than coverage numbers. Pure logic gets unit tests, components get Testing Library tests that interact with them the way a user would, and the critical flows, like sign-up and checkout, get a small set of Playwright end-to-end tests.

The third layer is process. Every pull request runs these checks in CI and deploys a preview environment, so reviewers and designers can click through the change. Our review checklist covers what automation can't: naming, edge cases, loading and error states, and accessibility.

The last layer is production. We use error monitoring with source maps, track Core Web Vitals from real users, and alert on regressions. And whenever a bug slips through, we add a test that would have caught it, so the same kind of bug doesn't come back.`,
  },
  {
    id: "fe-10",
    scenarioId: S,
    type: "浏览器与网络",
    difficulty: 3,
    question: "What are XSS and CSRF attacks, and how do you protect a web application against them?",
    keyPoints: [
      "XSS：攻击者的脚本在其他用户浏览器中执行（存储型 / 反射型 / DOM 型）",
      "防 XSS：框架默认转义、警惕危险 API 并清洗富文本、CSP、HttpOnly Cookie",
      "CSRF：恶意站点借用户的登录 Cookie 发起请求",
      "防 CSRF：SameSite Cookie、CSRF Token、服务端校验 Origin、敏感操作二次验证",
    ],
    answer: `XSS, or cross-site scripting, happens when an attacker gets their script to run in another user's browser, for example by saving a comment that contains a script and is later rendered without escaping. That script can then steal data or act on the user's behalf.

To prevent it, I rely on the framework's default escaping, since React escapes values in JSX, and I treat APIs like dangerouslySetInnerHTML as red flags that require sanitizing with a library such as DOMPurify. I also add a Content Security Policy that blocks inline scripts and restricts script sources, and keep session cookies HttpOnly so scripts can't read them.

CSRF, or cross-site request forgery, is different. The attacker's site makes the victim's browser send a request to our site, and the browser automatically attaches the user's cookies.

The main defenses are SameSite cookies, which stop cookies from being sent on most cross-site requests, anti-CSRF tokens on state-changing requests, and checking the Origin header on the server. For sensitive actions like changing a password, I'd also ask the user to re-authenticate.

In short, XSS is untrusted code running on our page, and CSRF is an untrusted site borrowing our users' sessions.`,
  },
];
