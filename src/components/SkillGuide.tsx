import { useMemo, useState } from 'react';
import { SKILL_GUIDES, SKILL_TO_PRACTICE } from '../data/skillGuides';
import type { SkillGuide, SkillPhraseGroup, SkillStockItem, SkillSubtype } from '../data/skillModel';
import { copyText } from '../lib/copyText';

type Subject = 'xingce' | 'shenlun';

interface Props {
  initialSubject?: Subject;
  onPractice: (skillId: string) => void;
  onOpenMaterials?: () => void;
}

export function SkillGuide({ initialSubject = 'xingce', onPractice, onOpenMaterials }: Props) {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [subId, setSubId] = useState<string>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  const list = useMemo(() => SKILL_GUIDES.filter((s) => s.subject === subject), [subject]);
  const active = list.find((s) => s.id === activeId) ?? list[0];
  const subtype = active?.subtypes.find((s) => s.id === subId);
  const hasBank = Boolean(active?.phrases?.length || active?.stock?.length);

  const selectType = (id: string) => {
    setActiveId(id);
    setSubId('overview');
  };

  const selectSubject = (next: Subject) => {
    setSubject(next);
    setActiveId(null);
    setSubId('overview');
  };

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(key);
      window.setTimeout(() => setCopied((cur) => (cur === key ? null : cur)), 1200);
    }
  };

  return (
    <section className="skill-page">
      <div className="exam-hero">
        <h2>题型技巧与词语</h2>
        <p>
          手机、电脑都能看。行测看经验与步骤；申论除了写法，还有分题型常用词语和速查素材，点一下就能复制。
        </p>
      </div>

      <div className="inner-tabs" role="tablist">
        <button type="button" className={subject === 'xingce' ? 'active' : ''} onClick={() => selectSubject('xingce')}>
          行测技巧
        </button>
        <button type="button" className={subject === 'shenlun' ? 'active' : ''} onClick={() => selectSubject('shenlun')}>
          申论技巧与词语
        </button>
      </div>

      <div className="skill-layout">
        <div className="skill-nav" role="tablist" aria-label="大题型">
          {list.map((s) => (
            <button
              key={s.id}
              type="button"
              className={active.id === s.id ? 'active' : ''}
              onClick={() => selectType(s.id)}
            >
              <span>{s.name}</span>
              <em>
                {s.subtypes.length} 种考法
                {s.phrases?.length ? ' · 有词语' : ''}
              </em>
            </button>
          ))}
        </div>

        {active && (
          <article className="skill-detail">
            <h3>{active.name}</h3>
            <p className="skill-slogan">{active.slogan}</p>
            <p className="skill-meta">{active.goal} · {active.time}</p>

            <div className="skill-subs" role="tablist" aria-label="子题型">
              <button
                type="button"
                className={subId === 'overview' ? 'active' : ''}
                onClick={() => setSubId('overview')}
              >
                总览
              </button>
              {hasBank && (
                <button
                  type="button"
                  className={subId === 'bank' ? 'active' : ''}
                  onClick={() => setSubId('bank')}
                >
                  词语素材
                </button>
              )}
              {active.subtypes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={subId === s.id ? 'active' : ''}
                  onClick={() => setSubId(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {subId === 'overview' && (
              <Overview guide={active} onOpen={setSubId} showBankEntry={hasBank} />
            )}
            {subId === 'bank' && hasBank && (
              <BankBody
                phrases={active.phrases ?? []}
                stock={active.stock ?? []}
                copied={copied}
                onCopy={handleCopy}
              />
            )}
            {subId !== 'overview' && subId !== 'bank' && subtype && <SubtypeBody sub={subtype} />}

            <div className="skill-cta-row">
              {SKILL_TO_PRACTICE[active.id] && (
                <button type="button" className="primary-btn skill-practice-btn" onClick={() => onPractice(active.id)}>
                  {SKILL_TO_PRACTICE[active.id].label}
                </button>
              )}
              {subject === 'shenlun' && onOpenMaterials && (
                <button type="button" className="secondary-btn skill-practice-btn" onClick={onOpenMaterials}>
                  打开完整素材库
                </button>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function Overview({
  guide,
  onOpen,
  showBankEntry,
}: {
  guide: SkillGuide;
  onOpen: (id: string) => void;
  showBankEntry: boolean;
}) {
  return (
    <>
      <h4>整块怎么做</h4>
      <ol>
        {guide.overview.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h4>关键记法</h4>
      <ul>
        {guide.keys.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>

      <h4>易错点</h4>
      <ul className="pitfalls">
        {guide.pitfalls.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {showBankEntry && (
        <button type="button" className="skill-bank-jump" onClick={() => onOpen('bank')}>
          查看本型常用词语与速查素材 →
        </button>
      )}

      <h4>{guide.name}怎么再拆</h4>
      <p className="skill-map-hint">点进子题型，看认题标志和分步方法。</p>
      <div className="skill-map">
        {guide.subtypes.map((s) => (
          <button type="button" key={s.id} onClick={() => onOpen(s.id)}>
            <strong>{s.name}</strong>
            <span>{s.slogan}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function BankBody({
  phrases,
  stock,
  copied,
  onCopy,
}: {
  phrases: SkillPhraseGroup[];
  stock: SkillStockItem[];
  copied: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <>
      <p className="skill-map-hint">点词语可复制。答题时对照用，别整段堆砌。</p>

      {phrases.map((group) => (
        <div key={group.label} className="skill-phrase-group">
          <h4>{group.label}</h4>
          <div className="skill-phrase-chips">
            {group.items.map((item) => {
              const key = `${group.label}:${item}`;
              return (
                <button
                  key={item}
                  type="button"
                  className={copied === key ? 'copied' : ''}
                  onClick={() => onCopy(key, item)}
                >
                  {copied === key ? '已复制' : item}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {stock.length > 0 && (
        <>
          <h4>速查素材</h4>
          <div className="skill-stock-list">
            {stock.map((item) => (
              <article key={item.title} className="skill-stock-card">
                <div className="skill-stock-top">
                  <strong>{item.title}</strong>
                  <button type="button" onClick={() => onCopy(`stock:${item.title}`, `${item.title}：${item.content}`)}>
                    {copied === `stock:${item.title}` ? '已复制' : '复制'}
                  </button>
                </div>
                <p>{item.content}</p>
                <p className="skill-stock-use">用法：{item.use}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function SubtypeBody({ sub }: { sub: SkillSubtype }) {
  return (
    <>
      <h4 className="skill-sub-title">{sub.name}</h4>
      <p className="skill-slogan">{sub.slogan}</p>
      <div className="skill-spot">
        <strong>怎么认题</strong>
        <p>{sub.spot}</p>
      </div>

      <h4>做题步骤</h4>
      <ol>
        {sub.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h4>关键记法</h4>
      <ul>
        {sub.keys.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>

      {sub.templates && sub.templates.length > 0 && (
        <>
          <h4>公式 / 作答骨架</h4>
          <ul className="skill-templates">
            {sub.templates.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}

      <h4>易错点</h4>
      <ul className="pitfalls">
        {sub.pitfalls.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </>
  );
}
