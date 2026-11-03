"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CUSTOM_SCENARIO_ID, type Scenario } from "@/lib/scenarios";
import type { Lang, SessionConfig } from "@/lib/types";
import { LIMITS } from "@/lib/validate";

interface Props {
  scenario: Scenario | null;
  /** 自定义场景 */
  custom: boolean;
  onClose: () => void;
  onStart: (config: SessionConfig) => void;
}

const QUESTION_OPTIONS = [3, 4, 5, 6, 8];

export function SetupDialog({ scenario, custom, onClose, onStart }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const open = custom || scenario !== null;

  const [language, setLanguage] = useState<Lang>("en");
  const [questions, setQuestions] = useState(5);
  const [background, setBackground] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setLanguage(scenario?.defaultLanguage ?? "zh");
      setQuestions(scenario?.defaultQuestions ?? 5);
      setBackground("");
      if (custom) {
        setCustomTitle("");
        setCustomDescription("");
      }
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, scenario, custom]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (custom && !customTitle.trim()) return;
    onStart({
      scenarioId: custom ? CUSTOM_SCENARIO_ID : scenario!.id,
      language: scenario?.languageLocked ? scenario.defaultLanguage : language,
      totalQuestions: questions,
      ...(background.trim() ? { background: background.trim() } : {}),
      ...(custom ? { customTitle: customTitle.trim(), customDescription: customDescription.trim() || undefined } : {}),
    });
  };

  const options = QUESTION_OPTIONS.includes(scenario?.defaultQuestions ?? 5)
    ? QUESTION_OPTIONS
    : [...QUESTION_OPTIONS, scenario!.defaultQuestions].sort((a, b) => a - b);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose(); // 点击遮罩关闭
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--ink)] shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden="true">
            {custom ? "✨" : scenario?.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold">
              {custom ? "自定义面试场景" : scenario?.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-3)]">
              {custom ? "描述你要练习的面试，AI 考官会按该场景出题和评分。" : scenario?.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--ink-3)] hover:bg-[var(--surface-muted)]"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {custom ? (
            <>
              <label className="block">
                <span className="text-sm font-medium">场景名称</span>
                <input
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  maxLength={LIMITS.customTitleChars}
                  placeholder="例：考研复试英语面试 / 银行柜员面试 / 托福口语"
                  className="mt-1.5 block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">
                  场景说明 <span className="font-normal text-[var(--ink-3)]">（可选）</span>
                </span>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  maxLength={LIMITS.customDescriptionChars}
                  rows={2}
                  placeholder="考查重点、题型、评分要求等"
                  className="mt-1.5 block w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </label>
            </>
          ) : null}

          <fieldset>
            <legend className="text-sm font-medium">面试语言</legend>
            <div className="mt-1.5 inline-flex rounded-lg border border-[var(--border)] p-0.5">
              {(["zh", "en"] as const).map((lang) => {
                const locked = scenario?.languageLocked && lang !== scenario.defaultLanguage;
                return (
                  <label
                    key={lang}
                    className={`cursor-pointer rounded-md px-4 py-1.5 text-sm transition has-[:checked]:bg-brand-600 has-[:checked]:text-white ${
                      locked ? "cursor-not-allowed opacity-40" : ""
                    } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      checked={language === lang}
                      disabled={locked}
                      onChange={() => setLanguage(lang)}
                      className="sr-only"
                    />
                    {lang === "zh" ? "中文" : "English"}
                  </label>
                );
              })}
            </div>
            {scenario?.languageLocked ? <p className="mt-1 text-xs text-[var(--ink-3)]">雅思口语固定使用英文。</p> : null}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium">题目数量</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {options.map((n) => (
                <label
                  key={n}
                  className="cursor-pointer rounded-lg border border-[var(--border)] px-3.5 py-1.5 text-sm tabular-nums transition has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:font-semibold has-[:checked]:text-brand-700 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 dark:has-[:checked]:bg-brand-600/20 dark:has-[:checked]:text-brand-100"
                >
                  <input
                    type="radio"
                    name="questions"
                    value={n}
                    checked={questions === n}
                    onChange={() => setQuestions(n)}
                    className="sr-only"
                  />
                  {n} 题
                </label>
              ))}
            </div>
            {scenario?.timer ? (
              <p className="mt-1.5 text-xs text-[var(--ink-3)]">
                本场景限时：{scenario.timer.prepSeconds ? `准备 ${scenario.timer.prepSeconds} 秒，` : ""}每题作答{" "}
                {scenario.timer.answerSeconds} 秒，超时会在复盘中扣分。
              </p>
            ) : null}
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium">
              我的背景 <span className="font-normal text-[var(--ink-3)]">（可选，让题目更贴近你）</span>
            </span>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              maxLength={LIMITS.backgroundChars}
              rows={3}
              placeholder={scenario?.backgroundHint ?? "例：目标岗位、个人经历、希望重点练习的题型。"}
              className="mt-1.5 block w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-muted)]"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={custom && !customTitle.trim()}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-40"
          >
            进入考场
          </button>
        </div>
      </form>
    </dialog>
  );
}
