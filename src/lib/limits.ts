/** 输入长度与数量上限（前后端共用；不要在这里引入题库等大模块） */
export const LIMITS = {
  minQuestions: 1,
  maxQuestions: 10,
  backgroundChars: 2000,
  customTitleChars: 60,
  customDescriptionChars: 600,
  userMessageChars: 6000,
  assistantMessageChars: 16000,
  /** 每题最多：一次作答 + 若干次非作答交流，留足余量 */
  maxMessages: 80,
  totalChars: 200_000,
} as const;
