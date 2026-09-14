import { useMemo, useState } from 'react';
import {
  TEMPLATE_CATEGORY_LABELS,
  WRITING_TEMPLATES,
  type TemplateCategory,
  type WritingTemplate,
} from '../data/templates';
import { copyText } from '../lib/copyText';

type Filter = TemplateCategory | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'essay', label: TEMPLATE_CATEGORY_LABELS.essay },
  { id: 'gongwen', label: TEMPLATE_CATEGORY_LABELS.gongwen },
];

export function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const list = useMemo(
    () => WRITING_TEMPLATES.filter((t) => filter === 'all' || t.category === filter),
    [filter],
  );
  const active = list.find((t) => t.id === activeId) ?? list[0];

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(key);
      window.setTimeout(() => setCopied((cur) => (cur === key ? null : cur)), 1200);
    }
  };

  if (!active) return null;

  return (
    <section className="templates-page">
      <div className="exam-hero">
        <h2>作文与公文模板</h2>
        <p>大作文框架、开头结尾、行政执法立意；通知方案讲话倡议汇报短评提纲——手机翻看，考场套用。</p>
      </div>

      <div className="chip-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => {
              setFilter(f.id);
              setActiveId(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="skill-layout">
        <div className="skill-nav" role="tablist" aria-label="模板列表">
          {list.map((t) => (
            <button
              key={t.id}
              type="button"
              className={active.id === t.id ? 'active' : ''}
              onClick={() => setActiveId(t.id)}
            >
              <span>{t.name}</span>
              <em>{TEMPLATE_CATEGORY_LABELS[t.category]}</em>
            </button>
          ))}
        </div>

        <TemplateDetail template={active} copied={copied} onCopy={handleCopy} />
      </div>
    </section>
  );
}

function TemplateDetail({
  template,
  copied,
  onCopy,
}: {
  template: WritingTemplate;
  copied: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <article className="skill-detail template-detail">
      <p className="template-cat">{TEMPLATE_CATEGORY_LABELS[template.category]}</p>
      <h3>{template.name}</h3>
      <p className="skill-slogan">{template.useWhen}</p>

      <h4>结构骨架</h4>
      <ol>
        {template.structure.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <div className="template-sample-head">
        <h4>示例 / 可套写</h4>
        <button type="button" onClick={() => onCopy(`sample:${template.id}`, template.sample)}>
          {copied === `sample:${template.id}` ? '已复制' : '复制示例'}
        </button>
      </div>
      <pre className="template-sample">{template.sample}</pre>

      {template.phrases && template.phrases.length > 0 && (
        <>
          <h4>常用套话</h4>
          <div className="skill-phrase-chips">
            {template.phrases.map((p) => {
              const key = `phrase:${template.id}:${p}`;
              return (
                <button
                  key={p}
                  type="button"
                  className={copied === key ? 'copied' : ''}
                  onClick={() => onCopy(key, p)}
                >
                  {copied === key ? '已复制' : p}
                </button>
              );
            })}
          </div>
        </>
      )}

      <h4>使用注意</h4>
      <ul className="pitfalls">
        {template.tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </article>
  );
}
