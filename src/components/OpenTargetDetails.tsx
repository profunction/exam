"use client";

import { useEffect } from "react";

/** 通过 #题目id 跳转到题库时，自动展开该题的参考答案 */
export function OpenTargetDetails() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const details = target?.querySelector("details");
      if (target && details) {
        details.open = true;
        target.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
