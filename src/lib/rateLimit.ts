/**
 * 简单的内存滑动窗口限流（按 IP）。
 * 只在单个服务实例内生效；多实例 / Serverless 部署请换成 Redis 等共享存储。
 */
const hits = new Map<string, number[]>();

function readInt(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function rateLimitConfig() {
  return {
    max: readInt("RATE_LIMIT_MAX", 30),
    windowMs: readInt("RATE_LIMIT_WINDOW_SEC", 600) * 1000,
  };
}

export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "local";
}

/** 记录一次请求；超限时返回需要等待的秒数 */
export function checkRateLimit(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSec: number } {
  const { max, windowMs } = rateLimitConfig();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  // 防止 Map 无限增长：偶尔清理过期的 key
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return { ok: true };
}

export function resetRateLimit() {
  hits.clear();
}
