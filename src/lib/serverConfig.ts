import "server-only";

const EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;
export type Effort = (typeof EFFORTS)[number];

export const DEFAULT_MODEL = "claude-opus-5-5";

/** 未配置任何 Claude 凭证时进入演示模式；MOCK_MODE=1/0 可强制开关 */
export function isDemoMode(): boolean {
  const flag = process.env.MOCK_MODE?.trim();
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return !process.env.ANTHROPIC_API_KEY?.trim() && !process.env.ANTHROPIC_AUTH_TOKEN?.trim();
}

export function modelConfig() {
  const effortEnv = process.env.ANTHROPIC_EFFORT?.trim() as Effort | undefined;
  const maxTokens = Number(process.env.ANTHROPIC_MAX_TOKENS);
  return {
    model: process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL,
    effort: effortEnv && EFFORTS.includes(effortEnv) ? effortEnv : ("medium" as Effort),
    maxTokens: Number.isInteger(maxTokens) && maxTokens >= 1024 ? maxTokens : 16000,
    fallbacks: process.env.ANTHROPIC_FALLBACKS?.trim().toLowerCase() !== "off",
  };
}
