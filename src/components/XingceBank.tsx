import { useState } from 'react';
import { XINGCE_SETS, getXingceSet, questionsOfSet } from '../data/xingceQuestions';
import type { XingceAttempt, XingceSet } from '../types';
import { XINGCE_MODULE_LABELS } from '../types';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

interface Props {
  attempts: Record<string, XingceAttempt>;
  onSaveAnswer: (setId: string, questionId: string, option: number) => void;
  onSubmit: (setId: string) => void;
  onReset: (setId: string) => void;
}

export function XingceBank({ attempts, onSaveAnswer, onSubmit, onReset }: Props) {
  const [setId, setSetId] = useState<string | null>(null);
  const set = setId ? getXingceSet(setId) : undefined;

  if (set) {
    return (
      <XingceQuiz
        set={set}
        attempt={attempts[set.id]}
        onBack={() => setSetId(null)}
        onSaveAnswer={(qid, opt) => onSaveAnswer(set.id, qid, opt)}
        onSubmit={() => onSubmit(set.id)}
        onReset={() => onReset(set.id)}
      />
    );
  }

  return (
    <section className="xingce-bank">
      <div className="exam-hero">
        <h2>行测题库（电脑点选）</h2>
        <p>
          原创练习题，覆盖资料、判断、言语、常识、数量。点选项即可作答，交卷后显示正确率和解析。
          <strong>不是国考真题原题</strong>（版权限制）。图形推理需看图，本站暂以定义、类比、逻辑为主。
        </p>
      </div>
      <div className="paper-list">
        {XINGCE_SETS.map((s) => {
          const att = attempts[s.id];
          const qs = questionsOfSet(s);
          let status = '未作';
          if (att?.submittedAt) {
            const right = qs.filter((q) => att.answers[q.id] === q.answer).length;
            status = `已交 ${right}/${qs.length}`;
          } else if (att) status = '作答中';
          return (
            <article key={s.id} className="paper-card">
              <div>
                <span className="year-badge">{XINGCE_MODULE_LABELS[s.module]}</span>
                <h3>{s.title}</h3>
                <p>{s.questionIds.length} 题 · 建议 {s.minutes} 分钟</p>
              </div>
              <div className="paper-card-actions">
                <span className={`status-pill ${att?.submittedAt ? 'status-已交卷' : att ? 'status-写作中' : ''}`}>
                  {status}
                </span>
                <button type="button" onClick={() => setSetId(s.id)}>
                  {att?.submittedAt ? '查看解析' : att ? '继续作答' : '开始作答'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function XingceQuiz({
  set,
  attempt,
  onBack,
  onSaveAnswer,
  onSubmit,
  onReset,
}: {
  set: XingceSet;
  attempt?: XingceAttempt;
  onBack: () => void;
  onSaveAnswer: (questionId: string, option: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const questions = questionsOfSet(set);
  const [index, setIndex] = useState(0);
  const submitted = Boolean(attempt?.submittedAt);
  const q = questions[index];
  const chosen = attempt?.answers[q.id];
  const answers = attempt?.answers ?? {};
  const doneCount = questions.filter((item) => answers[item.id] !== undefined).length;
  const right = submitted ? questions.filter((item) => answers[item.id] === item.answer).length : 0;

  return (
    <section className="exam-taker">
      <header className="exam-toolbar">
        <button type="button" className="ghost-btn" onClick={onBack}>← 返回行测题库</button>
        <div className="exam-toolbar-main">
          <h2>{set.title}</h2>
          <p>
            {index + 1} / {questions.length} · 已答 {doneCount} 题
            {submitted && ` · 正确 ${right} 题（${Math.round((right / questions.length) * 100)}%）`}
          </p>
        </div>
      </header>

      {q.material && <div className="xingce-material">{q.material}</div>}

      <article className="xingce-question">
        <div className="q-meta">
          <span>{q.kind}</span>
          <span>{XINGCE_MODULE_LABELS[q.module]}</span>
        </div>
        <p className="q-prompt">{q.stem}</p>
        <div className="option-list">
          {q.options.map((text, i) => {
            let cls = 'option-btn';
            if (submitted) {
              if (i === q.answer) cls += ' correct';
              else if (chosen === i) cls += ' wrong';
            } else if (chosen === i) cls += ' picked';
            return (
              <button
                key={text}
                type="button"
                className={cls}
                disabled={submitted}
                onClick={() => onSaveAnswer(q.id, i)}
              >
                <strong>{LETTERS[i]}</strong>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className="reference-box">
            <h4>解析</h4>
            <p>{q.explanation}</p>
          </div>
        )}
      </article>

      <div className="xingce-nav">
        <button type="button" className="ghost-btn" disabled={index === 0} onClick={() => setIndex((n) => n - 1)}>
          上一题
        </button>
        <div className="dot-row">
          {questions.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`q-dot ${i === index ? 'current' : ''} ${answers[item.id] !== undefined ? 'filled' : ''}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ghost-btn"
          disabled={index === questions.length - 1}
          onClick={() => setIndex((n) => n + 1)}
        >
          下一题
        </button>
      </div>

      <div className="exam-submit-row">
        {!submitted ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              if (doneCount < questions.length && !window.confirm(`还有 ${questions.length - doneCount} 题未答，确定交卷？`)) {
                return;
              }
              onSubmit();
            }}
          >
            交卷看解析
          </button>
        ) : (
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              if (window.confirm('清空作答并重做？')) {
                onReset();
                setIndex(0);
              }
            }}
          >
            重做本套
          </button>
        )}
      </div>
    </section>
  );
}
