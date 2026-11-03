import Link from "next/link";

/** 站点顶栏（题库等静态页面使用） */
export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white" aria-hidden="true">
            🤖
          </span>
          <span className="font-semibold">AI 考官</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--ink-2)]">
          <Link href="/" className="rounded-full px-3 py-1 hover:bg-[var(--surface-muted)]">
            练习场景
          </Link>
          <Link href="/bank" className="rounded-full px-3 py-1 hover:bg-[var(--surface-muted)]">
            📚 题库
          </Link>
        </nav>
      </div>
    </header>
  );
}
