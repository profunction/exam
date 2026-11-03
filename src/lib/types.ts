/** 面试语言 */
export type Lang = "zh" | "en";

export type ChatRole = "user" | "assistant";

/** 请求动作：开场 / 提交作答 / 主动结束并生成总结报告 */
export type ChatAction = "start" | "answer" | "finish";

/** 一场练习的配置（创建时确定，之后不再变化，保证系统提示词稳定可缓存） */
export interface SessionConfig {
  scenarioId: string;
  /** 自定义场景的名称（scenarioId === "custom" 时必填） */
  customTitle?: string;
  /** 自定义场景的补充说明 */
  customDescription?: string;
  language: Lang;
  totalQuestions: number;
  /** 考生自述背景：目标岗位、简历要点等（可选） */
  background?: string;
}

/** 发送给服务端的单条对话记录 */
export interface TranscriptMessage {
  role: ChatRole;
  content: string;
  /** 考生作答用时（秒），仅 user 消息、限时场景使用 */
  elapsedSec?: number;
}

/** 浏览器端保存的对话消息 */
export interface ChatMessage extends TranscriptMessage {
  id: string;
  createdAt: number;
}

export interface PracticeSession extends SessionConfig {
  id: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  /** 已输出总结报告 */
  finished: boolean;
  /** 本场由演示模式生成（未接入模型） */
  demo?: boolean;
}

export interface ChatRequestBody {
  config: SessionConfig;
  messages: TranscriptMessage[];
  action: ChatAction;
}

/** 服务端流式返回的 NDJSON 事件 */
export type StreamEvent =
  | { t: "meta"; mode: "live" | "demo"; model?: string }
  | { t: "delta"; text: string }
  | { t: "done"; stopReason?: string | null }
  | { t: "error"; code: string; message: string };
