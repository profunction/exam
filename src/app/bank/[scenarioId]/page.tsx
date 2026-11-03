import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BankPracticeButton } from "@/components/BankPracticeButton";
import { Markdown } from "@/components/Markdown";
import { OpenTargetDetails } from "@/components/OpenTargetDetails";
import { SiteHeader } from "@/components/SiteHeader";
import { bankFor, bankTypes } from "@/lib/bank";
import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/bank/types";
import { CATEGORY_LABELS, SCENARIOS, getScenario } from "@/lib/scenarios";

type Params = Promise<{ scenarioId: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENARIOS.filter((s) => bankFor(s.id).length > 0).map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) return { title: "题库" };
  return {
    title: `${scenario.title}题库`,
    description: `${scenario.title}原创仿真题 ${bankFor(scenarioId).length} 道，附评分要点和参考答案。${scenario.description}`,
  };
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  1: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  2: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  3: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};

export default async function ScenarioBankPage({ params }: { params: Params }) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  const questions = bankFor(scenarioId);
  if (!scenario || questions.length === 0) notFound();
  const types = bankTypes(scenarioId);
  const allIds = questions.map((q) => q.id);
  const randomCount = Math.min(scenario.defaultQuestions, allIds.length);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <OpenTargetDetails />
      <main className="mx-auto max-w-4xl px-4 pb-16">
        <nav className="pt-6 text-sm text-[var(--ink-3)]" aria-label="面包屑">
          <Link href="/bank" className="hover:underline">
            题库
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{scenario.title}</span>
        </nav>

        <header className="mt-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl" aria-hidden="true">
              {scenario.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{scenario.title}题库</h1>
              <p className="mt-1 text-sm text-[var(--ink-3)]">
                {CATEGORY_LABELS[scenario.category]} · {questions.length} 道题 · {scenario.defaultLanguage === "en" ? "英文作答" : "中文作答"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[var(--ink-2)]">{scenario.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <BankPracticeButton scenarioId={scenario.id} questionIds={allIds} count={randomCount} label={`随机抽 ${randomCount} 题开练`} />
          </div>
        </header>

        <nav className="sticky top-0 z-10 -mx-4 mt-8 border-b border-[var(--border)] bg-[var(--page)]/95 px-4 py-2 backdrop-blur" aria-label="题型">
          <ul className="flex gap-1.5 overflow-x-auto pb-0.5 text-sm">
            {types.map((t, i) => (
              <li key={t} className="shrink-0">
                <a href={`#type-${i}`} className="block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--ink-2)] hover:bg-[var(--surface-muted)]">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {types.map((t, ti) => {
          const items = questions.filter((q) => q.type === t);
          return (
            <section key={t} id={`type-${ti}`} className="scroll-mt-16 pt-8" aria-labelledby={`type-${ti}-title`}>
              <h2 id={`type-${ti}-title`} className="text-lg font-semibold">
                {t} <span className="text-sm font-normal text-[var(--ink-3)]">· {items.length} 题</span>
              </h2>
              <ol className="mt-3 space-y-4">
                {items.map((q) => (
                  <li key={q.id}>
                    <article id={q.id} className="scroll-mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_STYLES[q.difficulty]}`}>
                          {DIFFICULTY_LABELS[q.difficulty]}
                        </span>
                        <span className="text-[var(--ink-3)]">#{q.id}</span>
                      </div>
                      <Markdown className="mt-2 text-[15px] font-medium">{q.question}</Markdown>

                      <details className="group mt-3 rounded-xl bg-[var(--surface-muted)] px-4 py-3">
                        <summary className="cursor-pointer select-none text-sm font-medium text-brand-600">
                          查看评分要点与参考答案
                        </summary>
                        <div className="mt-3 space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold text-[var(--ink-2)]">评分要点</h3>
                            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-[var(--ink-2)]">
                              {q.keyPoints.map((p) => (
                                <li key={p}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[var(--ink-2)]">参考答案</h3>
                            <div className="mt-1.5 rounded-lg border-l-4 border-emerald-500 bg-[var(--surface)] p-3 text-[15px]">
                              <Markdown>{q.answer}</Markdown>
                            </div>
                          </div>
                        </div>
                      </details>

                      <div className="mt-3 flex justify-end">
                        <BankPracticeButton scenarioId={scenario.id} questionIds={[q.id]} label="练这道题" variant="secondary" />
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </main>
    </div>
  );
}
