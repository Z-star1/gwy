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
}
