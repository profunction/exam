import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { QUESTION_BANK, bankFor, bankTypes } from "@/lib/bank";
import { CATEGORY_LABELS, SCENARIOS } from "@/lib/scenarios";

export const metadata: Metadata = {
  title: "真题题库",
  description: "面试与考证原创仿真题库：外企技术与行为面试、考公考编与教资结构化面试、考研复试、银行国企校招、雅思与四六级口语，每题附评分要点和参考答案。",
};

export default function BankPage() {
  const scenarios = SCENARIOS.filter((s) => bankFor(s.id).length > 0);
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-10">
          <h1 className="text-3xl font-bold tracking-tight">📚 真题题库</h1>
          <p className="mt-3 max-w-3xl text-[var(--ink-2)]">
            共 {QUESTION_BANK.length} 道题，覆盖 {scenarios.length} 个场景。题目按真实考试的题型编写，每道题都附有评分要点和参考答案，可以直接开练，让 AI 考官逐句点评。
          </p>
          <p className="mt-2 max-w-3xl text-sm text-[var(--ink-3)]">
            说明：题库为原创仿真题，并非官方考试原题。参考答案用于学习答题思路，建议结合自己的真实经历组织语言，不要逐字背诵。
          </p>
        </section>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((s) => {
            const count = bankFor(s.id).length;
            const types = bankTypes(s.id);
            return (
              <li key={s.id}>
                <Link
                  href={`/bank/${s.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand-500/60 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl" aria-hidden="true">
                      {s.emoji}
                    </span>
                    <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--ink-2)]">
                      {CATEGORY_LABELS[s.category]}
                    </span>
                  </div>
                  <h2 className="mt-3 font-semibold">{s.title}</h2>
                  <p className="mt-1 text-sm text-[var(--ink-3)]">{count} 道题 · {types.length} 种题型</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {types.map((t) => (
                      <span key={t} className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[11px] text-[var(--ink-2)]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto pt-4 text-sm font-medium text-brand-600 group-hover:underline">查看题目和答案 →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
