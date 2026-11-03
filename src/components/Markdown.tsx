import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 渲染模型输出的 Markdown（react-markdown 默认不执行原始 HTML，可安全渲染） */
export function Markdown({ children, className = "", streaming = false }: { children: string; className?: string; streaming?: boolean }) {
  return (
    <div className={`md ${streaming ? "md-streaming" : ""} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
