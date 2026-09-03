export type { SkillGuide, SkillSubtype } from './skillModel';
export { XINGCE_SKILL_GUIDES } from './xingceSkillGuides';
export { SHENLUN_SKILL_GUIDES } from './shenlunSkillGuides';

import { SHENLUN_SKILL_GUIDES } from './shenlunSkillGuides';
import { XINGCE_SKILL_GUIDES } from './xingceSkillGuides';
import type { SkillGuide } from './skillModel';

export const SKILL_GUIDES: SkillGuide[] = [...XINGCE_SKILL_GUIDES, ...SHENLUN_SKILL_GUIDES];

export interface SkillPracticeTarget {
  subject: 'xingce' | 'shenlun';
  setId?: string;
  label: string;
}

/** 技巧页 CTA：行测跳到对应专项，申论跳到模拟卷列表 */
export const SKILL_TO_PRACTICE: Record<string, SkillPracticeTarget> = {
  'xc-changshi': { subject: 'xingce', setId: 'set-changshi', label: '去练常识判断专项' },
  'xc-tiankong': { subject: 'xingce', setId: 'set-yanyu', label: '去练言语理解（含逻辑填空）' },
  'xc-pianduan': { subject: 'xingce', setId: 'set-yanyu', label: '去练言语理解（含片段阅读）' },
  'xc-yuju': { subject: 'xingce', setId: 'set-yanyu', label: '去练言语理解（含语句表达）' },
  'xc-shuliang': { subject: 'xingce', setId: 'set-shuliang', label: '去练数量关系专项' },
  'xc-tuxing': { subject: 'xingce', setId: 'set-panduan', label: '图形题需看图，先去练判断专项' },
  'xc-dingyi': { subject: 'xingce', setId: 'set-panduan', label: '去练判断推理（含定义判断）' },
  'xc-leibi': { subject: 'xingce', setId: 'set-panduan', label: '去练判断推理（含类比）' },
  'xc-luoji': { subject: 'xingce', setId: 'set-panduan', label: '去练判断推理（含逻辑判断）' },
  'xc-ziliao': { subject: 'xingce', setId: 'set-ziliao', label: '去练资料分析专项' },
  'sl-yuedu': { subject: 'shenlun', label: '去申论模拟卷练习' },
  'sl-guina': { subject: 'shenlun', label: '去申论模拟卷练归纳概括' },
  'sl-fenxi': { subject: 'shenlun', label: '去申论模拟卷练综合分析' },
  'sl-duice': { subject: 'shenlun', label: '去申论模拟卷练提出对策' },
  'sl-guanche': { subject: 'shenlun', label: '去申论模拟卷练贯彻执行' },
  'sl-zuowen': { subject: 'shenlun', label: '去申论模拟卷练大作文' },
};

export function getSkillPracticeTarget(skillId: string): SkillPracticeTarget | undefined {
  if (SKILL_TO_PRACTICE[skillId]) return SKILL_TO_PRACTICE[skillId];
  const parent = SKILL_GUIDES.find((g) => g.subtypes.some((s) => s.id === skillId));
  return parent ? SKILL_TO_PRACTICE[parent.id] : undefined;
}
