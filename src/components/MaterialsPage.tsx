import { useMemo, useState, type FormEvent } from 'react';
import { MATERIALS } from '../data/materials';
import { copyText } from '../lib/copyText';
import type { Material, MaterialCategory, NotebookEntry, NotebookKind, ShenlunQuestionType } from '../types';
import { MATERIAL_CATEGORY_LABELS, NOTEBOOK_KIND_LABELS, QUESTION_TYPE_LABELS } from '../types';

type InnerTab = 'library' | 'notebook';
type LibraryFilter = MaterialCategory | 'all' | 'zhifa';

const FILTERS: { id: LibraryFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'zhifa', label: '行政执法' },
  { id: 'jinju', label: '申论金句' },
  { id: 'anli', label: '典型案例' },
  { id: 'chengyu', label: '高频成语' },
  { id: 'zhengce', label: '政策热词' },
];

const TYPE_FILTERS: { id: ShenlunQuestionType | 'all'; label: string }[] = [
  { id: 'all', label: '全部题型' },
  { id: 'guina', label: QUESTION_TYPE_LABELS.guina },
  { id: 'fenxi', label: QUESTION_TYPE_LABELS.fenxi },
  { id: 'duice', label: QUESTION_TYPE_LABELS.duice },
  { id: 'guanche', label: QUESTION_TYPE_LABELS.guanche },
  { id: 'zuowen', label: QUESTION_TYPE_LABELS.zuowen },
];

interface Props {
  notebook: NotebookEntry[];
  isMaterialSaved: (id: string) => boolean;
  onSaveMaterial: (payload: { materialId: string; kind: NotebookKind; text: string; note: string }) => void;
  onAddEntry: (entry: Omit<NotebookEntry, 'id' | 'createdAt'>) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onDeleteEntry: (id: string) => void;
  initialShenlunType?: ShenlunQuestionType | 'all';
}

export function MaterialsPage({
  notebook,
  isMaterialSaved,
  onSaveMaterial,
  onAddEntry,
  onToggleFavorite,
  onDeleteEntry,
  initialShenlunType = 'all',
}: Props) {
  const [inner, setInner] = useState<InnerTab>('library');
  const [category, setCategory] = useState<LibraryFilter>('all');
  const [shenlunType, setShenlunType] = useState<ShenlunQuestionType | 'all'>(initialShenlunType);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MATERIALS.filter((m) => {
      if (category === 'zhifa' && !m.tags.includes('行政执法')) return false;
      if (category !== 'all' && category !== 'zhifa' && m.category !== category) return false;
      if (shenlunType !== 'all' && !m.shenlunTypes?.includes(shenlunType)) return false;
      if (!q) return true;
      return [m.title, m.content, m.usage, ...m.tags].join(' ').toLowerCase().includes(q);
    });
  }, [category, query, shenlunType]);

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    }
  };

  return (
    <section className="materials-page">
      <div className="materials-hero">
        <h2>素材与词句</h2>
        <p>通勤、午休都能看。可按申论题型筛选金句、案例、热词；技巧页里还有各题型专用词语表。</p>
      </div>

      <div className="inner-tabs" role="tablist">
        <button type="button" className={inner === 'library' ? 'active' : ''} onClick={() => setInner('library')}>
          素材库
        </button>
        <button type="button" className={inner === 'notebook' ? 'active' : ''} onClick={() => setInner('notebook')}>
          我的积累 {notebook.length > 0 && <span className="count-pill">{notebook.length}</span>}
        </button>
      </div>

      {inner === 'library' ? (
        <>
          <input
            className="search-input"
            type="search"
            placeholder="搜索金句、案例、成语、热词"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="chip-row">
            {FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="filter-label">按申论题型</p>
          <div className="chip-row">
            {TYPE_FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${shenlunType === c.id ? 'active' : ''}`}
                onClick={() => setShenlunType(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="result-hint">{filtered.length} 条素材</p>
          <div className="material-list">
            {filtered.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                saved={isMaterialSaved(m.id)}
                copied={copiedId === m.id}
                onCopy={() => handleCopy(m.id, `${m.title}\n${m.content}\n用法：${m.usage}`)}
                onSave={() =>
                  onSaveMaterial({
                    materialId: m.id,
                    kind: m.category,
                    text: `${m.title}\n${m.content}`,
                    note: m.usage,
                  })
                }
              />
            ))}
          </div>
        </>
      ) : (
        <NotebookPanel
          notebook={notebook}
          copiedId={copiedId}
          onCopy={handleCopy}
          onAdd={onAddEntry}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDeleteEntry}
        />
      )}
    </section>
  );
}

function MaterialCard({
  material,
  saved,
  copied,
  onCopy,
  onSave,
}: {
  material: Material;
  saved: boolean;
  copied: boolean;
  onCopy: () => void;
  onSave: () => void;
}) {
  return (
    <article className={`material-card cat-${material.category}`}>
      <div className="material-top">
        <span className="cat-badge">{MATERIAL_CATEGORY_LABELS[material.category]}</span>
        <div className="tag-row">
          {material.tags.map((t) => (
            <span key={t} className="mini-tag">{t}</span>
          ))}
        </div>
      </div>
      <h3>{material.title}</h3>
      <p className="material-body">{material.content}</p>
      <p className="material-usage">用法：{material.usage}</p>
      {material.shenlunTypes && material.shenlunTypes.length > 0 && (
        <p className="material-types">
          适用：{material.shenlunTypes.map((t) => QUESTION_TYPE_LABELS[t]).join(' · ')}
        </p>
      )}
      <div className="material-actions">
        <button type="button" onClick={onCopy}>{copied ? '已复制' : '复制'}</button>
        <button type="button" className="secondary" disabled={saved} onClick={onSave}>
          {saved ? '已收入积累本' : '收入积累本'}
        </button>
      </div>
    </article>
  );
}

function NotebookPanel({
  notebook,
  copiedId,
  onCopy,
  onAdd,
  onToggleFavorite,
  onDelete,
}: {
  notebook: NotebookEntry[];
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onAdd: (entry: Omit<NotebookEntry, 'id' | 'createdAt'>) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [kind, setKind] = useState<NotebookKind>('jinju');
  const [filter, setFilter] = useState<NotebookKind | 'all' | 'fav'>('all');
  const [query, setQuery] = useState('');

  const visible = notebook.filter((e) => {
    if (filter === 'fav' && !e.favorite) return false;
    if (filter !== 'all' && filter !== 'fav' && e.kind !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${e.text} ${e.note}`.toLowerCase().includes(q);
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ kind, text: text.trim(), note: note.trim(), favorite: false });
    setText('');
    setNote('');
  };

  return (
    <div className="notebook">
      <form className="notebook-form" onSubmit={submit}>
        <label>
          分类
          <select value={kind} onChange={(e) => setKind(e.target.value as NotebookKind)}>
            {(Object.keys(NOTEBOOK_KIND_LABELS) as NotebookKind[]).map((k) => (
              <option key={k} value={k}>{NOTEBOOK_KIND_LABELS[k]}</option>
            ))}
          </select>
        </label>
        <textarea
          rows={3}
          placeholder="写下金句、案例要点或成语辨析……"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="备注（何时用、易错点，可选）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">记入积累本</button>
      </form>

      <input
        className="search-input"
        type="search"
        placeholder="搜索我的积累"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chip-row">
        <button type="button" className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>全部</button>
        <button type="button" className={`chip ${filter === 'fav' ? 'active' : ''}`} onClick={() => setFilter('fav')}>收藏</button>
        {(Object.keys(NOTEBOOK_KIND_LABELS) as NotebookKind[]).map((k) => (
          <button
            key={k}
            type="button"
            className={`chip ${filter === k ? 'active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {NOTEBOOK_KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty-hint">还没有积累。通勤路上看到好句子，随手记一条。</p>
      ) : (
        <div className="material-list">
          {visible.map((e) => (
            <article key={e.id} className="material-card notebook-card">
              <div className="material-top">
                <span className="cat-badge">{NOTEBOOK_KIND_LABELS[e.kind]}</span>
                <span className="entry-date">{e.createdAt.slice(0, 10)}</span>
              </div>
              <p className="material-body">{e.text}</p>
              {e.note && <p className="material-usage">备注：{e.note}</p>}
              <div className="material-actions">
                <button type="button" onClick={() => onCopy(e.id, e.note ? `${e.text}\n${e.note}` : e.text)}>
                  {copiedId === e.id ? '已复制' : '复制'}
                </button>
                <button type="button" className="secondary" onClick={() => onToggleFavorite(e.id, !e.favorite)}>
                  {e.favorite ? '已收藏' : '收藏'}
                </button>
                <button type="button" className="danger" onClick={() => onDelete(e.id)}>删除</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
