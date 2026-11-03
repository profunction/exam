"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { RoundScore } from "@/lib/scores";

const W = 300;
const H = 156;
const PAD = { left: 30, right: 30, top: 14, bottom: 24 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function fmt(value: number, max: number) {
  return max === 9 ? value.toFixed(1) : String(Math.round(value * 10) / 10);
}

/**
 * 每轮得分趋势（单系列折线）。
 * 规格：2px 折线、带表面色描边的 8px 圆点、1px 浅灰网格；悬停 / 键盘聚焦显示十字准线与提示框。
 * 侧栏下方的「每题得分」列表就是同一数据的表格视图。
 */
export function ScoreChart({ rounds, max }: { rounds: RoundScore[]; max: 100 | 9 }) {
  const [active, setActive] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const titleId = useId();

  if (rounds.length === 0) {
    return (
      <div className="flex h-[156px] items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--ink-3)]">
        完成第一题后显示成绩曲线
      </div>
    );
  }

  const ticks = max === 9 ? [0, 3, 6, 9] : [0, 25, 50, 75, 100];
  const x = (i: number) => (rounds.length === 1 ? PAD.left + PLOT_W / 2 : PAD.left + (i * PLOT_W) / (rounds.length - 1));
  const y = (v: number) => PAD.top + PLOT_H * (1 - Math.min(Math.max(v, 0), max) / max);
  const points = rounds.map((r, i) => ({ x: x(i), y: y(r.score.value), r }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    points.length > 1
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${y(0).toFixed(1)} L${points[0].x.toFixed(1)},${y(0).toFixed(1)} Z`
      : "";
  const last = points[points.length - 1];
  const summary = rounds.map((r) => `第 ${r.round} 题 ${r.score.label}`).join("，");

  const nearest = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const vx = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < points.length; i++) {
      if (Math.abs(points[i].x - vx) < Math.abs(points[best].x - vx)) best = i;
    }
    return best;
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => setActive(nearest(e.clientX));
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const cur = active ?? points.length - 1;
      const next = e.key === "ArrowLeft" ? Math.max(0, cur - 1) : Math.min(points.length - 1, cur + 1);
      setActive(next);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  const activePoint = active !== null ? points[active] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
        role="img"
        aria-labelledby={titleId}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive(points.length - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        <title id={titleId}>{`每轮得分趋势：${summary}`}</title>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={PAD.left - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={10} fill="var(--ink-3)">
              {t}
            </text>
          </g>
        ))}

        {points.map((p) => (
          <text key={p.r.round} x={p.x} y={H - 6} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
            {`第${p.r.round}题`}
          </text>
        ))}

        {areaPath ? <path d={areaPath} fill="var(--series-1)" opacity={0.1} /> : null}
        {points.length > 1 ? (
          <path d={linePath} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ) : null}

        {activePoint ? (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={PAD.top}
            y2={PAD.top + PLOT_H}
            stroke="var(--ink-3)"
            strokeWidth={1}
            opacity={0.6}
          />
        ) : null}

        {points.map((p, i) => (
          <circle
            key={p.r.round}
            cx={p.x}
            cy={p.y}
            r={active === i ? 5.5 : 4}
            fill="var(--series-1)"
            stroke="var(--chart-surface)"
            strokeWidth={2}
          />
        ))}

        {/* 只标注最新一轮的分数，其余交给提示框和表格 */}
        <text
          x={last.x + 8}
          y={last.y}
          dy="0.32em"
          fontSize={11}
          fontWeight={600}
          fill="var(--ink)"
          textAnchor="start"
        >
          {fmt(last.r.score.value, max)}
        </text>
      </svg>

      {activePoint ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(activePoint.x / W) * 100}%`, top: `${(activePoint.y / H) * 100}%`, marginTop: -10 }}
          role="status"
        >
          <div className="text-sm font-semibold text-[var(--ink)]">{activePoint.r.score.label}</div>
          <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[var(--series-1)]" aria-hidden="true" />
            第 {activePoint.r.round} 题
          </div>
        </div>
      ) : null}
    </div>
  );
}
