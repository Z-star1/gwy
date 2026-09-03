export interface SkillSubtype {
  id: string;
  name: string;
  slogan: string;
  /** 卷面上怎么认出这道题 */
  spot: string;
  steps: string[];
  keys: string[];
  pitfalls: string[];
  /** 公式、作答骨架或可直接套用的句式 */
  templates?: string[];
}

/** 申论题型常用词：可直接抄进答案的总括词、短句 */
export interface SkillPhraseGroup {
  label: string;
  items: string[];
}

/** 挂在题型下的速查素材：金句/案例/政策，通勤刷手机用 */
export interface SkillStockItem {
  title: string;
  content: string;
  use: string;
}

export interface SkillGuide {
  id: string;
  subject: 'xingce' | 'shenlun';
  name: string;
  goal: string;
  time: string;
  slogan: string;
  overview: string[];
  keys: string[];
  pitfalls: string[];
  subtypes: SkillSubtype[];
  /** 申论分题型常用词语 */
  phrases?: SkillPhraseGroup[];
  /** 申论分题型速查素材 */
  stock?: SkillStockItem[];
}
