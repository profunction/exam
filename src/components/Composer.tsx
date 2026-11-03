"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent } from "react";
import { LIMITS } from "@/lib/limits";
import type { Lang } from "@/lib/types";
import { useSpeechRecognition } from "./useSpeechRecognition";

export interface ComposerHandle {
  setText: (text: string) => void;
  focus: () => void;
}

interface Props {
  language: Lang;
  disabled: boolean;
  streaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  placeholder?: string;
}

function countLabel(text: string, language: Lang): string {
  if (language === "en") {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return `${words} words`;
  }
  return `${text.replace(/\s/g, "").length} 字`;
}

export const Composer = forwardRef<ComposerHandle, Props>(function Composer(
  { language, disabled, streaming, onSend, onStop, placeholder },
  ref,
) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speech = useSpeechRecognition(language, (finalText) => {
    if (!finalText) return;
    setText((prev) => {
      const sep = prev && !/\s$/.test(prev) ? (language === "en" ? " " : "") : "";
      return (prev + sep + finalText).slice(0, LIMITS.userMessageChars);
    });
  });

  useImperativeHandle(ref, () => ({
    setText: (t: string) => setText(t),
    focus: () => textareaRef.current?.focus(),
  }));

  // 根据内容自动调整高度
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`;
  }, [text, speech.interim]);

  const canSend = !disabled && !streaming && text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    if (speech.listening) speech.stop();
    onSend(text.trim());
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  };

  const shown = speech.interim ? `${text}${text && language === "en" ? " " : ""}${speech.interim}` : text;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <label htmlFor="answer" className="sr-only">
        你的回答
      </label>
      <textarea
        id="answer"
        ref={textareaRef}
        value={shown}
        onChange={(e) => setText(e.target.value.slice(0, LIMITS.userMessageChars))}
        onKeyDown={onKeyDown}
        readOnly={speech.listening}
        disabled={disabled}
        rows={2}
        placeholder={placeholder ?? (language === "en" ? "Type your answer in English…" : "输入你的回答…")}
        className="block w-full resize-none rounded-t-2xl bg-transparent px-4 pt-3 text-[15px] leading-relaxed outline-none placeholder:text-[var(--ink-3)] disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        {speech.supported ? (
          <button
            type="button"
            onClick={speech.listening ? speech.stop : speech.start}
            disabled={disabled || streaming}
            aria-pressed={speech.listening}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition disabled:opacity-40 ${
              speech.listening
                ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                : "border-[var(--border)] text-[var(--ink-2)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <span aria-hidden="true">{speech.listening ? "⏹" : "🎙️"}</span>
            {speech.listening ? "停止录音" : "语音作答"}
          </button>
        ) : null}
        <span className="text-xs tabular-nums text-[var(--ink-3)]">{countLabel(text, language)}</span>
        <span className="hidden text-xs text-[var(--ink-3)] md:inline">· Ctrl / ⌘ + Enter 发送</span>
        <div className="ml-auto">
          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex h-9 items-center rounded-full border border-[var(--border)] px-4 text-sm font-medium hover:bg-[var(--surface-muted)]"
            >
              停止生成
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              className="inline-flex h-9 items-center rounded-full bg-brand-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              提交回答
            </button>
          )}
        </div>
      </div>
      {speech.error ? <p className="px-4 pb-3 text-xs text-rose-600 dark:text-rose-400">{speech.error}</p> : null}
    </div>
  );
});
