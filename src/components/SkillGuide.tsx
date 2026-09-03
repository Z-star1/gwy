import { useMemo, useState } from 'react';
import { SKILL_GUIDES, SKILL_TO_PRACTICE } from '../data/skillGuides';
import type { SkillSubtype } from '../data/skillModel';

type Subject = 'xingce' | 'shenlun';

interface Props {
  initialSubject?: Subject;
  onPractice: (skillId: string) => void;
}

export function SkillGuide({ initialSubject = 'xingce', onPractice }: Props) {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [subId, setSubId] = useState<string>('overview');

  const list = useMemo(() => SKILL_GUIDES.filter((s) => s.subject === subject), [subject]);
  const active = list.find((s) => s.id === activeId) ?? list[0];
  const subtype = active?.subtypes.find((s) => s.id === subId);

  const selectType = (id: string) => {
    setActiveId(id);
    setSubId('overview');
  };

  const selectSubject = (next: Subject) => {
    setSubject(next);
    setActiveId(null);
    setSubId('overview');
  };

  return (
    <section className="skill-page">
      <div className="exam-hero">
        <h2>题型技巧</h2>
        <p>
          每种大题型再拆到具体考法。先看总览，再点子题型看认题标志、步骤、公式或作答骨架。在职每天 2 小时，技巧比题海更值钱。
        </p>
      </div>

      <div className="inner-tabs" role="tablist">
        <button type="button" className={subject === 'xingce' ? 'active' : ''} onClick={() => selectSubject('xingce')}>
          行测技巧
        </button>
        <button type="button" className={subject === 'shenlun' ? 'active' : ''} onClick={() => selectSubject('shenlun')}>
          申论技巧
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
              <em>{s.subtypes.length} 种考法</em>
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

            {subId === 'overview' || !subtype ? (
              <Overview guideName={active.name} overview={active.overview} keys={active.keys} pitfalls={active.pitfalls} subtypes={active.subtypes} onOpen={setSubId} />
            ) : (
              <SubtypeBody sub={subtype} />
            )}

            {SKILL_TO_PRACTICE[active.id] && (
              <button type="button" className="primary-btn skill-practice-btn" onClick={() => onPractice(active.id)}>
                {SKILL_TO_PRACTICE[active.id].label}
              </button>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

function Overview({
  guideName,
  overview,
  keys,
  pitfalls,
  subtypes,
  onOpen,
}: {
  guideName: string;
  overview: string[];
  keys: string[];
  pitfalls: string[];
  subtypes: SkillSubtype[];
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <h4>整块怎么做</h4>
      <ol>
        {overview.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h4>关键记法</h4>
      <ul>
        {keys.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>

      <h4>易错点</h4>
      <ul className="pitfalls">
        {pitfalls.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h4>{guideName}怎么再拆</h4>
      <p className="skill-map-hint">点进子题型，看认题标志和分步方法。</p>
      <div className="skill-map">
        {subtypes.map((s) => (
          <button type="button" key={s.id} onClick={() => onOpen(s.id)}>
            <strong>{s.name}</strong>
            <span>{s.slogan}</span>
          </button>
        ))}
      </div>
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
