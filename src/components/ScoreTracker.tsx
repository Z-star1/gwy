import { useState } from 'react';
import type { ScoreRecord } from '../types';
import { TARGET_XINGCE, TARGET_SHENLUN } from '../types';

interface Props {
  records: ScoreRecord[];
  onAdd: (record: Omit<ScoreRecord, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function ScoreTracker({ records, onAdd, onDelete }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [xingce, setXingce] = useState('');
  const [shenlun, setShenlun] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const xc = Number(xingce);
    const sl = Number(shenlun);
    if (isNaN(xc) || isNaN(sl) || xc < 0 || sl < 0) return;
    onAdd({ date, type: 'mock', name: '全真模考', xingce: xc, shenlun: sl, note: note || undefined });
    setXingce('');
    setShenlun('');
    setNote('');
  };

  return (
    <section className="score-section">
      <h2>📊 模考成绩记录</h2>

      <form className="score-form" onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="score-inputs">
          <label>
            行测
            <input
              type="number"
              min="0"
              max="100"
              placeholder={`目标 ${TARGET_XINGCE}`}
              value={xingce}
              onChange={(e) => setXingce(e.target.value)}
            />
          </label>
          <label>
            申论
            <input
              type="number"
              min="0"
              max="100"
              placeholder={`目标 ${TARGET_SHENLUN}`}
              value={shenlun}
              onChange={(e) => setShenlun(e.target.value)}
            />
          </label>
        </div>
        <input
          type="text"
          placeholder="备注（可选，如：国考模考卷1）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">记录成绩</button>
      </form>

      {records.length > 0 ? (
        <div className="score-list">
          {records.map((r) => {
            const total = r.xingce + r.shenlun;
            const gap = 160 - total;
            return (
              <div key={r.id} className="score-item">
                <div className="score-info">
                  <span className="score-date">{r.date}</span>
                  <span className="score-total">{total} 分</span>
                  <span className="score-detail">行测 {r.xingce} · 申论 {r.shenlun}</span>
                  {r.note && <span className="score-note">{r.note}</span>}
                </div>
                <div className="score-actions">
                  <span className={`gap ${gap <= 0 ? 'reached' : ''}`}>
                    {gap <= 0 ? '已达标 🎉' : `差 ${gap} 分`}
                  </span>
                  <button type="button" className="delete-btn" onClick={() => onDelete(r.id)}>删除</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-hint">还没有模考记录，完成第一次模考后在这里追踪进步</p>
      )}
    </section>
  );
}
