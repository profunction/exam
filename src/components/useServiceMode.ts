"use client";

import { useEffect, useState } from "react";

/** 查询服务端是演示模式还是已接入模型 */
export function useServiceMode(): "live" | "demo" | null {
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { mode?: "live" | "demo" } | null) => {
        if (!cancelled && data?.mode) setMode(data.mode);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return mode;
}
