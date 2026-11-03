import Anthropic from "@anthropic-ai/sdk";
import { chunkText, mockReply } from "@/lib/mock";
import { buildApiMessages, buildSystemPrompt } from "@/lib/prompt";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";
import { isDemoMode, modelConfig } from "@/lib/serverConfig";
import type { ChatRequestBody, StreamEvent } from "@/lib/types";
import { validateChatRequest } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** 开启思考后单次回复可能超过 1 分钟 */
export const maxDuration = 300;

const MAX_BODY_BYTES = 512 * 1024;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  // 凭证从环境变量读取（ANTHROPIC_API_KEY 等），不要写死在代码里
  client ??= new Anthropic();
  return client;
}

function jsonError(status: number, code: string, message: string, headers?: HeadersInit) {
  return Response.json({ code, message }, { status, headers });
}

/** 按错误类型（从具体到宽泛）给出可读的中文提示；细节只写服务端日志 */
function describeError(err: unknown): { code: string; message: string } {
  if (err instanceof Anthropic.APIUserAbortError) return { code: "aborted", message: "已停止生成。" };
  if (err instanceof Anthropic.AuthenticationError) {
    return { code: "auth", message: "服务端的 Claude API Key 无效，请联系站点管理员检查配置。" };
  }
  if (err instanceof Anthropic.PermissionDeniedError) {
    return { code: "permission", message: "当前 API Key 没有调用该模型的权限，请联系站点管理员。" };
  }
  if (err instanceof Anthropic.NotFoundError) {
    return { code: "model", message: "配置的模型不可用，请检查 ANTHROPIC_MODEL。" };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return { code: "rate_limit", message: "AI 考官当前请求太多，请稍等片刻再试。" };
  }
  if (err instanceof Anthropic.BadRequestError) {
    return { code: "bad_request", message: "请求被 AI 服务拒绝，请缩短回答或开始新的练习后重试。" };
  }
  if (err instanceof Anthropic.InternalServerError) {
    return { code: "overloaded", message: "AI 服务暂时繁忙，请稍后重试。" };
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return { code: "network", message: "连接 AI 服务失败，请检查网络后重试。" };
  }
  if (err instanceof Anthropic.APIError) {
    return { code: "api", message: `AI 服务出错（${err.status ?? "未知状态"}），请稍后重试。` };
  }
  return { code: "unknown", message: "生成失败，请重试。" };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Send = (event: StreamEvent) => void;

async function streamDemo(body: ChatRequestBody, send: Send, signal: AbortSignal) {
  send({ t: "meta", mode: "demo" });
  const text = mockReply(body.config, body.messages, body.action);
  await sleep(400); // 模拟"考官思考"
  for (const chunk of chunkText(text, 6)) {
    if (signal.aborted) return;
    send({ t: "delta", text: chunk });
    await sleep(12);
  }
  send({ t: "done", stopReason: "end_turn" });
}

async function streamClaude(body: ChatRequestBody, send: Send, signal: AbortSignal) {
  const cfg = modelConfig();
  send({ t: "meta", mode: "live", model: cfg.model });

  const stream = getClient().beta.messages.stream(
    {
      model: cfg.model,
      max_tokens: cfg.maxTokens,
      // 系统提示词在同一场练习内保持不变；顶层 cache_control 自动缓存到最后一条消息，
      // 多轮对话时历史部分按缓存价计费
      system: [{ type: "text", text: buildSystemPrompt(body.config) }],
      cache_control: { type: "ephemeral" },
      messages: buildApiMessages(body.config, body.messages, body.action),
      // Opus 5.5 思考常开，用 effort 控制思考深度与延迟
      output_config: { effort: cfg.effort },
      // 模型因安全策略拒答时，由服务端自动换用推荐的兜底模型重试
      ...(cfg.fallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
    },
    { signal },
  );

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      send({ t: "delta", text: event.delta.text });
    }
  }

  const message = await stream.finalMessage();
  const usage = message.usage;
  console.info(
    JSON.stringify({
      event: "chat_completion",
      model: message.model,
      stop_reason: message.stop_reason,
      input_tokens: usage.input_tokens,
      cache_read_input_tokens: usage.cache_read_input_tokens,
      cache_creation_input_tokens: usage.cache_creation_input_tokens,
      output_tokens: usage.output_tokens,
    }),
  );

  if (message.stop_reason === "refusal") {
    send({ t: "error", code: "refusal", message: "这条内容 AI 考官暂时无法处理，请换一种说法后重试。" });
    return;
  }
  send({ t: "done", stopReason: message.stop_reason });
}

export async function POST(req: Request) {
  const limited = checkRateLimit(clientKey(req.headers));
  if (!limited.ok) {
    return jsonError(429, "too_many_requests", `练习太频繁了，请 ${limited.retryAfterSec} 秒后再试。`, {
      "Retry-After": String(limited.retryAfterSec),
    });
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return jsonError(413, "too_large", "请求内容过大，请开始新的练习。");

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return jsonError(413, "too_large", "请求内容过大，请开始新的练习。");
    raw = JSON.parse(text);
  } catch {
    return jsonError(400, "invalid_json", "请求格式错误。");
  }

  const result = validateChatRequest(raw);
  if (!result.ok) return jsonError(400, "invalid_request", result.error);
  const body = result.value;
  const demo = isDemoMode();

  const encoder = new TextEncoder();
  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send: Send = (event) => {
        if (abort.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // 客户端已断开
        }
      };
      try {
        if (demo) await streamDemo(body, send, abort.signal);
        else await streamClaude(body, send, abort.signal);
      } catch (err) {
        const info = describeError(err);
        if (info.code !== "aborted") {
          console.error("[chat] generation failed:", err);
          send({ t: "error", ...info });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // 已关闭
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
