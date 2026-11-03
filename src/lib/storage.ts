"use client";

import type { PracticeSession } from "./types";

/**
 * 练习记录保存在浏览器 localStorage（仅本机可见）。
 * 隐私模式或禁用存储时读写会失败，此时静默降级为不保存。
 */
const KEY = "ai-examiner.sessions.v1";
const MAX_SESSIONS = 30;

function readAll(): PracticeSession[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PracticeSession[]) : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: PracticeSession[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
    return true;
  } catch {
    return false;
  }
}

export function listSessions(): PracticeSession[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id: string): PracticeSession | undefined {
  return readAll().find((s) => s.id === id);
}

export function saveSession(session: PracticeSession): boolean {
  const rest = readAll().filter((s) => s.id !== session.id);
  return writeAll([session, ...rest].sort((a, b) => b.updatedAt - a.updatedAt));
}

export function deleteSession(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
