import type { BankQuestion } from "../types";

const S = "foreign-backend";

export const FOREIGN_BACKEND: BankQuestion[] = [
  {
    id: "be-01",
    scenarioId: S,
    type: "自我介绍与项目",
    difficulty: 1,
    question: "Please introduce yourself and describe a backend system you designed or significantly improved.",
    keyPoints: [
      "概括背景：年限、语言与技术栈、所在业务和规模",
      "讲清原系统的问题和影响（用数字）",
      "你的方案与关键技术决策，以及为什么这样选",
      "结果量化，并连接到应聘岗位",
    ],
    answer: `Sure. I'm a backend engineer with five years of experience, mostly in Go and Java. I currently work on the order platform of an e-commerce company that processes a few million orders a day.

The system I'm proudest of is our order-status pipeline. When I joined, every downstream service polled the order database to detect status changes. At peak times this put heavy load on the primary database, and some services were several minutes behind.

I proposed an event-driven design. We started publishing order events with the transactional outbox pattern, so each event is written in the same transaction as the order change and then relayed to Kafka. Every consumer is idempotent, which makes retries safe.

I led the design review, implemented the outbox relay, and migrated the services one by one behind feature flags. After the migration, database CPU at peak dropped by about forty percent, and the delay for downstream services went from minutes to under a second.

I enjoy work where reliability and scale meet, and that's a big reason I'm excited about this role.`,
  },
  {
    id: "be-02",
    scenarioId: S,
    type: "系统设计",
    difficulty: 3,
    question: "How would you design a URL shortening service that handles 10,000 requests per second?",
    keyPoints: [
      "先澄清需求：读写比例、是否过期、自定义短码、统计需求",
      "短码生成：唯一数字 ID + Base62；号段预分配避免单点和冲突",
      "存储与缓存：KV 或分片表 + Redis 缓存热点，必要时 CDN 边缘跳转",
      "可扩展与安全：无状态水平扩展、点击统计异步化、限流与恶意链接检测",
    ],
    answer: `First I'd clarify the requirements. Let's assume it's read-heavy, around ten thousand redirects per second and a few hundred new links per second, links don't expire by default, and we want basic click statistics.

The core is simple: an API to create short links, and a redirect endpoint that looks up the code and returns a redirect, usually a 302, so every click still reaches us for statistics.

To generate codes, I'd encode a unique numeric ID in Base62; seven characters give more than three trillion combinations. To avoid a single bottleneck, each app server reserves a block of IDs from a central counter, so generation is local and collision-free. Custom aliases are protected by a unique constraint.

For storage, a key-value store or a sharded table keyed by the code works well. Since reads dominate and popular links are very hot, I'd put Redis in front, and could even serve the hottest redirects at the CDN edge.

The service is stateless, so it scales horizontally. Click events go to a queue and are aggregated asynchronously, so analytics never slows down redirects. Finally, I'd add rate limiting and malicious-URL checks, because shorteners are often abused for phishing.`,
  },
  {
    id: "be-03",
    scenarioId: S,
    type: "故障排查",
    difficulty: 2,
    question: "API latency suddenly spikes in production. Walk me through how you would troubleshoot it.",
    keyPoints: [
      "先止血：确认影响范围，近期发布可回滚，必要时扩容或降级",
      "看指标与时间线：延迟分位数、错误率、流量、饱和度，对齐发布和配置变更",
      "用链路追踪定位慢点：数据库、下游依赖、连接池、GC、CPU 限流",
      "修复后验证，并写无责复盘，补监控和预防措施",
    ],
    answer: `My first priority is limiting the impact; the root cause comes right after.

I'd check the dashboards to understand the scope: is it every endpoint or just one, every region or one, and how does p99 compare with p50? At the same time I'd look at what changed around that moment, such as a deployment, a configuration change, a traffic spike or an incident at a dependency. If a recent deploy lines up with the spike, rolling back is often the fastest fix.

Next I'd narrow it down with distributed tracing to see which span got slower. The usual suspects are the database, with a missing index, lock contention or an exhausted connection pool; a slow downstream service without proper timeouts; or resource saturation, like CPU throttling or long garbage-collection pauses.

Once I find the cause, I fix it and confirm that latency is back to normal. Then we write a blameless postmortem with the timeline, the root cause and follow-up actions, for example an alert on connection-pool usage or a load test for the query that regressed.`,
  },
  {
    id: "be-04",
    scenarioId: S,
    type: "数据库",
    difficulty: 2,
    question: "When would you choose a relational database over a NoSQL database, and why?",
    keyPoints: [
      "关系型：结构化数据、复杂查询与关联、需要 ACID 事务",
      "NoSQL：访问模式简单固定、海量数据或超高写入、需要灵活结构和水平扩展",
      "从访问模式和一致性要求出发做选择，而不是追潮流",
      "实际系统常组合使用，并举例说明",
    ],
    answer: `I start from the data and the access patterns rather than the technology.

I'd choose a relational database when the data is structured and connected, when I need flexible queries with joins and aggregations, and especially when I need strong transactional guarantees. Orders, payments and inventory are classic examples, because an order must never be half-written.

I'd consider a NoSQL store when the access patterns are simple and known in advance, like fetching a document or a time series by key, and when the volume or write throughput is beyond what a single relational primary handles comfortably. Session storage, activity feeds and event logs fit well. Document stores also help when the schema varies a lot between records.

That said, modern relational databases scale further than people assume, with read replicas, partitioning and JSON columns, so for a new product I usually start with a relational database and add specialized stores when a clear need appears.

In practice most systems combine them. In my last project, PostgreSQL was the source of truth for orders, Redis handled caching and rate limits, and a search engine powered product search.`,
  },
  {
    id: "be-05",
    scenarioId: S,
    type: "分布式与缓存",
    difficulty: 3,
    question: "How do you keep data consistent between a database and a cache?",
    keyPoints: [
      "常用 Cache-Aside：读时回填；写时先更新数据库，再删除缓存（而不是更新缓存）",
      "说明并发下的不一致窗口，以及 TTL 兜底、延迟双删",
      "更可靠的做法：订阅 binlog / CDC 异步失效缓存，失败可重试",
      "按业务容忍度取舍：强一致场景直接读库或加版本号",
    ],
    answer: `The pattern I use most is cache-aside. On a read, the service checks the cache first; on a miss it reads the database and populates the cache. On a write, it updates the database first and then deletes the cache entry, rather than updating it. Deleting is safer, because two concurrent writers updating the cache in different orders can leave a stale value behind.

Even so, there's a small window for inconsistency. For example, a slow reader might load an old value from the database and write it into the cache just after the writer deleted it. So I always set a reasonable TTL as a safety net, and for hot keys some teams add a delayed second delete.

When consistency matters more, I prefer invalidating the cache from the database change log. A consumer reads the binlog through change data capture and deletes the affected keys, with retries if the delete fails. That decouples invalidation from the request path and makes it reliable.

Finally, it's a business decision. A product description can be a few seconds stale, but an account balance shouldn't be served from cache at all, or should be checked with a version number.`,
  },
  {
    id: "be-06",
    scenarioId: S,
    type: "API 设计",
    difficulty: 2,
    question: "How would you design an API that is safe to retry, for example a payment request?",
    keyPoints: [
      "核心是幂等：客户端为每次业务操作生成幂等键（Idempotency-Key）",
      "服务端以唯一约束保存键与结果，重复请求直接返回首次结果；处理中的请求要加锁",
      "数据库层再加一道防线：唯一业务单号、状态机",
      "客户端重试策略：只重试可重试错误，指数退避 + 抖动，设置超时",
    ],
    answer: `The key idea is idempotency: sending the same request twice must have the same effect as sending it once.

The client generates a unique idempotency key for each payment attempt and sends it in a header. On the server, I store the key with a unique constraint, together with the request fingerprint and the final response. If the same key comes back, the server returns the stored response instead of charging again. If the first request is still in progress, the second one waits or receives a conflict response, which is why the key is inserted before the payment is processed.

I'd also add protection at the data level, such as a unique business order number and a payment state machine that only allows valid transitions, like pending to succeeded, so even a bug elsewhere can't create a double charge.

On the client side, retries should only happen for errors that are safe to retry, such as timeouts or 503s, using exponential backoff with jitter so we don't overwhelm a struggling service. With idempotency in place, a client can retry after a timeout without guessing whether the first attempt went through.`,
  },
  {
    id: "be-07",
    scenarioId: S,
    type: "并发",
    difficulty: 2,
    question: "What's the difference between a process and a thread, and how do you avoid race conditions?",
    keyPoints: [
      "进程有独立地址空间，隔离好、开销大；线程共享进程内存，切换轻但需要同步",
      "竞态条件：多个线程无协调地读写共享数据，结果取决于执行顺序",
      "手段：锁、原子操作、不可变数据、线程封闭、消息传递（如 Go channel）",
      "注意死锁：固定加锁顺序、缩小临界区、设置超时；分布式场景用数据库约束或乐观锁",
    ],
    answer: `A process has its own memory space, so processes are well isolated from each other, but creating them and communicating between them is relatively expensive. Threads live inside a process and share its memory, which makes them lighter and makes communication easy, but it also means they can interfere with each other.

A race condition happens when several threads read and write shared data without coordination, so the result depends on timing. The classic example is two threads incrementing the same counter: both read ten, both write eleven, and one update is lost.

To avoid it, I first try not to share mutable state at all, using immutable data, keeping data confined to one thread, or passing messages, which is idiomatic in Go with channels. When sharing is unavoidable, I protect it with a mutex, or use atomic operations for simple counters.

Locks bring their own risk of deadlock, so I keep critical sections small, always acquire multiple locks in the same order, and use timeouts where possible. And across multiple servers, local locks don't help, so I rely on database constraints, optimistic locking with version numbers, or idempotent operations.`,
  },
  {
    id: "be-08",
    scenarioId: S,
    type: "分布式与缓存",
    difficulty: 2,
    question: "Why would you introduce a message queue into a system, and what new problems does it bring?",
    keyPoints: [
      "收益：服务解耦、削峰填谷、异步处理、便于扩展消费者",
      "新问题：消息重复（消费端要幂等）、顺序性、丢失（确认与持久化）",
      "运维成本：积压监控、死信队列、排障更难",
      "结论：确有需要时才引入，并说明权衡",
    ],
    answer: `A message queue is useful in three main situations. First, decoupling: the order service publishes an event, and email, analytics and inventory consume it without the order service knowing about them. Second, absorbing traffic peaks: during a flash sale, requests are queued and processed at a steady pace instead of overwhelming the database. Third, moving slow work off the request path, like generating invoices or sending notifications.

But it adds real complexity. Most queues deliver at least once, so consumers must be idempotent, for example by recording processed message IDs. Ordering is only guaranteed within a partition, so related messages need the same partition key. Messages can be lost if producers don't wait for acknowledgements or consumers commit offsets before processing.

There's also an operational cost: we need to monitor consumer lag, handle poison messages with retries and a dead-letter queue, and accept that debugging a flow across asynchronous hops is harder than following a single request.

So I'd introduce a queue when one of those three needs is real, not by default.`,
  },
  {
    id: "be-09",
    scenarioId: S,
    type: "行为面试",
    difficulty: 2,
    question: "Tell me about a production incident you were responsible for. What did you learn from it?",
    keyPoints: [
      "坦诚说明你的责任，不推卸",
      "STAR：事故经过、影响、你如何响应和修复",
      "根因分析与长期改进（流程、监控、测试）",
      "体现成长：现在的做法有什么不同",
    ],
    answer: `About two years ago, I shipped a database migration that added an index to our largest table. I'd tested it on staging, but staging had a fraction of the production data. In production, the migration locked the table for several minutes, and checkout requests started timing out during the evening peak.

I was on call, so I got paged. I quickly confirmed the migration was the cause, coordinated with the DBA to cancel it, and posted updates in the incident channel every few minutes. Checkout recovered after about twelve minutes, but some orders failed in that window.

In the postmortem, I owned the mistake openly. The root cause wasn't just my migration but our process: we had no rule for large-table changes. I proposed and implemented three fixes: migrations on big tables must use online schema-change tools, they run in a low-traffic window, and CI now warns when a migration touches a table above a size threshold.

What I learned is to test against realistic data volumes and to think about how a change fails, not just whether it works. Since then, every risky change I make comes with a rollback plan.`,
  },
  {
    id: "be-10",
    scenarioId: S,
    type: "系统设计",
    difficulty: 3,
    question: "How would you design rate limiting for a public API?",
    keyPoints: [
      "明确限流维度：API Key / 用户 / IP / 接口，套餐分级配额",
      "算法选择：令牌桶（允许突发）、滑动窗口（更平滑）",
      "分布式实现：Redis + 原子脚本，网关层统一执行，注意 Redis 故障时的降级策略",
      "对用户友好：429 + Retry-After、限额响应头、文档说明",
    ],
    answer: `I'd start by deciding what we're limiting and why. For a public API, the main dimension is usually the API key, with different quotas per pricing tier, plus a per-IP limit for unauthenticated traffic and stricter limits on expensive endpoints like search or exports.

For the algorithm, I like the token bucket: each key has a bucket that refills at a steady rate, so clients can make short bursts but can't exceed the average rate. A sliding-window counter is a good alternative when we want smoother, more predictable limits.

Because the API runs on many servers, the counters must be shared. I'd keep them in Redis and update them with an atomic Lua script, so checking and decrementing happen in one step. The check belongs in the API gateway or a middleware, so every endpoint gets it consistently. I'd also decide in advance what happens if Redis is unavailable: usually fail open with a conservative local limit, so an outage of the limiter doesn't take down the whole API.

Finally, I'd make limits transparent. Return 429 with a Retry-After header, expose the remaining quota in response headers, and document the limits, so well-behaved clients can adapt instead of guessing.`,
  },
];
