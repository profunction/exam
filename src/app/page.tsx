import { HomeView } from "@/components/HomeView";
import { bankIndex } from "@/lib/bank";

export default function Page() {
  // 只把题目 id / 题型 / 难度传给浏览器，题目正文和答案留在服务端
  return <HomeView bankIndex={bankIndex()} />;
}
