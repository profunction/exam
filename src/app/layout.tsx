import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 考官 · 面试与考证真题模拟对练",
    template: "%s · AI 考官",
  },
  description:
    "垂直面试 / 考证真题 AI 模拟对练：外企技术面试、教师资格证与公务员结构化面试、雅思口语。每答一题都有实时评分、痛点纠错和高分范文。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
