import { isDemoMode } from "@/lib/serverConfig";

export const dynamic = "force-dynamic";

/** 告诉前端当前是演示模式还是已接入模型 */
export function GET() {
  return Response.json({ mode: isDemoMode() ? "demo" : "live" });
}
