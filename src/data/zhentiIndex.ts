/** 国考申论真题索引：只列公开报道的年份、卷别、主题，不含给定资料和试题原文。 */

export interface ZhentiIndexItem {
  year: number;
  paper: string;
  theme: string;
  notes: string;
  practiceId?: string;
}

export const OFFICIAL_LINKS = [
  { name: '国家公务员局', url: 'https://www.scs.gov.cn/' },
  { name: '中央机关公开遴选和公务员考录专题', url: 'https://bm.scs.gov.cn/' },
];

export const ZHENTI_INDEX: ZhentiIndexItem[] = [
  {
    year: 2026,
    paper: '国考 · 行政执法类申论',
    theme: '当年试卷以考试结束后官方及权威媒体报道为准',
    notes: '请用正版真题书或人事考试机构出版物核对原文。本站提供同结构模拟卷可在线作答。',
    practiceId: 'sl-2026-zhifa',
  },
  {
    year: 2025,
    paper: '国考 · 行政执法类申论',
    theme: '公开报道主题围绕“为群众办好事、让群众感到好办事、把群众的事办好”',
    notes: '5则材料、5道题，材料与题目大体对应。原文请用正版试卷。',
    practiceId: 'sl-2025-zhifa',
  },
  {
    year: 2024,
    paper: '国考 · 行政执法类申论',
    theme: '公开报道大作文围绕行政执法中的“力、理、利”，强调从粗放执法转向精确执法',
    notes: '5则材料。本站不收录给定资料和试题原文。',
    practiceId: 'sl-2024-zhifa',
  },
  {
    year: 2023,
    paper: '国考 · 行政执法类申论',
    theme: '行政执法卷已连续多年单独命题，侧重基层执法、规范文明执法相关能力',
    notes: '建议买近5年行政执法卷汇编，按考试时长整卷手写。',
    practiceId: 'sl-2023-zhifa',
  },
  {
    year: 2022,
    paper: '国考 · 行政执法类申论',
    theme: '国考增设行政执法卷后的早期试卷，题型结构与后来年份相近',
    notes: '行测、申论真题均请通过正版图书获取，勿用不明来源 PDF。',
    practiceId: 'sl-2022-zhifa',
  },
];
