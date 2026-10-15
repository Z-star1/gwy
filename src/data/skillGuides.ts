import type { SkillGuide } from './skillModel';

export type { SkillGuide, SkillSubtype, SkillPhraseGroup, SkillStockItem } from './skillModel';

type Subject = 'xingce' | 'shenlun';

const cache = new Map<Subject, Promise<SkillGuide[]>>();

/** 按科目加载技巧。同一科目始终返回同一个 Promise，行测和申论分成两个包。 */
export function loadSubjectGuides(subject: Subject): Promise<SkillGuide[]> {
  const existing = cache.get(subject);
  if (existing) return existing;
  const task = (subject === 'xingce' ? loadXingce() : loadShenlun()).catch((error: unknown) => {
    cache.delete(subject);
    throw error;
  });
  cache.set(subject, task);
  return task;
}

async function loadXingce() {
  const mod = await import('./xingceSkillGuides');
  return mod.XINGCE_SKILL_GUIDES;
}

async function loadShenlun() {
  const [guides, banks] = await Promise.all([
    import('./shenlunSkillGuides'),
    import('./shenlunSkillBanks'),
  ]);
  return guides.SHENLUN_SKILL_GUIDES.map((guide) => {
    const bank = banks.SHENLUN_SKILL_BANKS[guide.id];
    if (!bank) return guide;
    return { ...guide, phrases: bank.phrases, stock: bank.stock };
  });
}
