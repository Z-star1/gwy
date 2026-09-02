import { useMemo, useState } from 'react';
import { SKILL_GUIDES } from '../data/skillGuides';

type Subject = 'xingce' | 'shenlun';

interface Props {
  initialSubject?: Subject;
}

export function SkillGuide({ initialSubject = 'xingce' }: Props) {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [activeId, setActiveId] = useState<string | null>(null);

  const list = useMemo(() => SKILL_GUIDES.filter((s) => s.subject === subject), [subject]);
  const active = list.find((s) => s.id === activeId) ?? list[0];

  return (
    <section className="skill-page">
      <div className="exam-hero">
        <h2>题型技巧</h2>
        <p>行测按题型拆步骤，申论按题型拆写法。先看口诀和避坑，再去题库练。在职每天 2 小时，技巧比题海更值钱。</p>
      </div>

      <div className="inner-tabs" role="tablist">
        <button type="button" className={subject === 'xingce' ? 'active' : ''} onClick={() => { setSubject('xingce'); setActiveId(null); }}>
          行测技巧
        </button>
        <button type="button" className={subject === 'shenlun' ? 'active' : ''} onClick={() => { setSubject('shenlun'); setActiveId(null); }}>
          申论技巧
        </button>
      </div>

      <div className="skill-layout">
        <div className="skill-nav">
          {list.map((s) => (
            <button
              key={s.id}
              type="button"
              className={active.id === s.id ? 'active' : ''}
              onClick={() => setActiveId(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        {active && (
          <article className="skill-detail">
            <h3>{active.name}</h3>
            <p className="skill-slogan">{active.slogan}</p>
            <p className="skill-meta">{active.goal} · {active.time}</p>

            <h4>做题步骤</h4>
            <ol>
              {active.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <h4>关键记法</h4>
            <ul>
              {active.keys.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>

            <h4>易错点</h4>
            <ul className="pitfalls">
              {active.pitfalls.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </section>
  );
}
