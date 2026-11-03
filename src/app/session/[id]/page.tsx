import type { Metadata } from "next";
import { SessionView } from "@/components/SessionView";

export const metadata: Metadata = { title: "模拟对练" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionView id={id} />;
}
