import type { ChatRequestBody, StreamEvent } from "./types";

export class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

interface StreamHandlers {
  signal?: AbortSignal;
  onMeta?: (meta: Extract<StreamEvent, { t: "meta" }>) => void;
  onDelta: (text: string) => void;
}

/** 调用 /api/chat 并逐行解析 NDJSON 流；出错时抛出 ChatError */
export async function streamChat(body: ChatRequestBody, handlers: StreamHandlers): Promise<{ stopReason?: string | null }> {
  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: handlers.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw new ChatError("已停止生成。", "aborted");
    throw new ChatError("网络连接失败，请检查网络后重试。", "network");
  }

  if (!res.ok || !res.body) {
    let message = `请求失败（${res.status}）`;
    let code = "http_error";
    try {
      const data = (await res.json()) as { message?: string; code?: string };
      if (data.message) message = data.message;
      if (data.code) code = data.code;
    } catch {
      // 非 JSON 错误响应
    }
    throw new ChatError(message, code);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished: { stopReason?: string | null } | null = null;

  const handleLine = (line: string) => {
    if (!line.trim()) return;
    let event: StreamEvent;
    try {
      event = JSON.parse(line) as StreamEvent;
    } catch {
      return;
    }
    switch (event.t) {
      case "meta":
        handlers.onMeta?.(event);
        break;
      case "delta":
        handlers.onDelta(event.text);
        break;
      case "done":
        finished = { stopReason: event.stopReason };
        break;
      case "error":
        throw new ChatError(event.message, event.code);
    }
  };

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        handleLine(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf("\n");
      }
    }
    buffer += decoder.decode();
    handleLine(buffer);
  } catch (err) {
    if (err instanceof ChatError) throw err;
    if ((err as Error).name === "AbortError") throw new ChatError("已停止生成。", "aborted");
    throw new ChatError("连接中断，请重试。", "network");
  }

  if (!finished) throw new ChatError("回复意外中断，请重试。", "incomplete");
  return finished;
}
