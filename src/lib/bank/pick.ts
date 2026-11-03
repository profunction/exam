/** 从数组中随机抽取 n 个不重复元素（部分 Fisher-Yates 洗牌），可注入随机函数便于测试 */
export function pickRandom<T>(items: readonly T[], n: number, rand: () => number = Math.random): T[] {
  const pool = [...items];
  const count = Math.max(0, Math.min(n, pool.length));
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rand() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
