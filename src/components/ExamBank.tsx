import { XingceBank } from './XingceBank';
import { useEffect, useMemo, useState } from 'react';
import { PAPER_STYLES, PAPER_YEARS, SHENLUN_PAPERS, getPaper } from '../data/shenlunPapers';
import { OFFICIAL_LINKS, ZHENTI_INDEX } from '../data/zhentiIndex';
import type { ExamAttempt, ShenlunPaper, XingceAttempt } from '../types';
import { QUESTION_TYPE_LABELS } from '../types';

function countChars(text: string) {
  return text.replace(/\s/g, '').length;
}

function remainingLabel(startedAt: string, durationMin: number) {
  const end = new Date(startedAt).getTime() + durationMin * 60 * 1000;
  const left = Math.max(0, end - Date.now());
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { text: `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, overtime: left === 0 };
}

interface Props {
  attempts: Record<string, ExamAttempt>;
  onStart: (paperId: string) => void;
  onSaveAnswer: (paperId: string, questionId: string, text: string) => void;
  onSubmit: (paperId: string) => void;
  onReset: (paperId: string) => void;
  xingceAttempts: Record<string, XingceAttempt>;
  onXingceAnswer: (setId: string, questionId: string, option: number) => void;
  onXingceSubmit: (setId: string) => void;
  onXingceReset: (setId: string) => void;
}

export function ExamBank({
  attempts,
  onStart,
  onSaveAnswer,
  onSubmit,
  onReset,
  xingceAttempts,
  onXingceAnswer,
  onXingceSubmit,
  onXingceReset,
}: Props) {
  const [subject, setSubject] = useState<'xingce' | 'shenlun'>('xingce');
  const [year, setYear] = useState<number | 'all'>('all');
  const [style, setStyle] = useState<string | 'all'>('all');
  const [paperId, setPaperId] = useState<string | null>(null);

  const papers = useMemo(
    () =>
      SHENLUN_PAPERS.filter(
        (p) => (year === 'all' || p.year === year) && (style === 'all' || p.style === style),
      ),
    [year, style],
  );

  const paper = paperId ? getPaper(paperId) : undefined;
  if (paper) {
    return (
      <ExamTaker
        paper={paper}
        attempt={attempts[paper.id]}
        onBack={() => setPaperId(null)}
        onStart={() => onStart(paper.id)}
        onSaveAnswer={(qid, text) => onSaveAnswer(paper.id, qid, text)}
        onSubmit={() => onSubmit(paper.id)}
        onReset={() => onReset(paper.id)}
      />
    );
  }

  return (
    <section className="exam-bank">
      <div className="inner-tabs" role="tablist">
        <button type="button" className={subject === 'xingce' ? 'active' : ''} onClick={() => { setSubject('xingce'); setPaperId(null); }}>
          行测
        </button>
        <button type="button" className={subject === 'shenlun' ? 'active' : ''} onClick={() => setSubject('shenlun')}>
          申论
        </button>
      </div>

      {subject === 'xingce' ? (
        <XingceBank
          attempts={xingceAttempts}
          onSaveAnswer={onXingceAnswer}
          onSubmit={onXingceSubmit}
          onReset={onXingceReset}
        />
      ) : (
        <>
      <div className="exam-hero">
        <h2>申论题库（电脑作答）</h2>
        <p>
          按年份练习行政执法类申论。官方真题全文受版权保护，<strong>不能放进本站在线作答</strong>。
          下面先给出真题年份索引和正规获取渠道。在线作答的是<strong>原创模拟卷</strong>：
          借鉴国考及浙、粤、苏、鲁、川渝、京津冀等地常见题型结构与主题偏好，材料全部新写，
          <strong>不是把各地真题剪贴拼凑</strong>（那样同样侵权）。
        </p>
      </div>

      <div className="zhenti-index">
        <h3>国考申论真题索引（行政执法卷）</h3>
        <p className="zhenti-legal">
          国家公务员局官网发布公告、大纲和部分说明，一般不提供历年完整试卷下载。
          完整真题请买中国人事出版社等正版汇编，或省级人事考试机构出版物。不要用来路不明的 PDF。
        </p>
        <div className="official-links">
          {OFFICIAL_LINKS.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.name} ↗
            </a>
          ))}
        </div>
        <div className="paper-list">
          {ZHENTI_INDEX.map((item) => (
            <article key={`${item.year}-${item.paper}`} className="paper-card zhenti-card">
              <div>
                <span className="year-badge">{item.year}</span>
                <h3>{item.paper}</h3>
                <p><strong>公开报道主题：</strong>{item.theme}</p>
                <p>{item.notes}</p>
              </div>
              {item.practiceId && (
                <div className="paper-card-actions">
                  <button type="button" onClick={() => setPaperId(item.practiceId!)}>
                    用模拟卷练同结构
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <h3 className="subsection-title">本站可作答：模拟卷（{papers.length} 套）</h3>

      <div className="chip-row">
        <button type="button" className={`chip ${style === 'all' ? 'active' : ''}`} onClick={() => setStyle('all')}>
          全部风格
        </button>
        {PAPER_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip ${style === s ? 'active' : ''}`}
            onClick={() => setStyle(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="chip-row">
        <button type="button" className={`chip ${year === 'all' ? 'active' : ''}`} onClick={() => setYear('all')}>
          全部年份
        </button>
        {PAPER_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            className={`chip ${year === y ? 'active' : ''}`}
            onClick={() => setYear(y)}
          >
            {y}年
          </button>
        ))}
      </div>

      <div className="paper-list">
        {papers.map((p) => {
          const att = attempts[p.id];
          const status = att?.submittedAt ? '已交卷' : att ? '写作中' : '未作';
          return (
            <article key={p.id} className="paper-card">
              <div>
                <span className="year-badge">{p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.style} · {p.subtitle} · {p.durationMin}分钟 · {p.totalScore}分 · {p.questions.length}题</p>
              </div>
              <div className="paper-card-actions">
                <span className={`status-pill status-${status}`}>{status}</span>
                <button type="button" onClick={() => setPaperId(p.id)}>
                  {att?.submittedAt ? '查看作答' : att ? '继续作答' : '开始作答'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
        </>
      )}
    </section>
  );
}

function ExamTaker({
  paper,
  attempt,
  onBack,
  onStart,
  onSaveAnswer,
  onSubmit,
  onReset,
}: {
  paper: ShenlunPaper;
  attempt?: ExamAttempt;
  onBack: () => void;
  onStart: () => void;
  onSaveAnswer: (questionId: string, text: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const [tick, setTick] = useState(0);
  const [activeQ, setActiveQ] = useState(paper.questions[0].id);
  const submitted = Boolean(attempt?.submittedAt);
  const started = Boolean(attempt);

  useEffect(() => {
    if (!attempt || submitted) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [attempt, submitted]);

  const clock = attempt && !submitted
    ? remainingLabel(attempt.startedAt, paper.durationMin)
    : null;

  return (
    <section className="exam-taker">
      <header className="exam-toolbar">
        <button type="button" className="ghost-btn" onClick={onBack}>← 返回题库</button>
        <div className="exam-toolbar-main">
          <h2>{paper.title}</h2>
          <p>{paper.subtitle}</p>
        </div>
        {clock && (
          <div className={`exam-timer ${clock.overtime ? 'over' : ''}`} data-tick={tick}>
            {clock.overtime ? '已到时' : clock.text}
          </div>
        )}
        {submitted && <span className="status-pill status-已交卷">已交卷 · 可对照要点</span>}
      </header>

      {!started ? (
        <div className="exam-start-panel">
          <p>建议在电脑上全屏作答。时限 {paper.durationMin} 分钟，共 {paper.totalScore} 分。答案自动保存在本机浏览器。</p>
          <ol>
            <li>先通读给定资料，再逐题作答</li>
            <li>小题控制字数，大作文 1000—1200 字</li>
            <li>交卷后显示参考要点，便于对照，系统不自动判分</li>
          </ol>
          <button type="button" className="primary-btn" onClick={onStart}>开始计时作答</button>
        </div>
      ) : (
        <div className="exam-split">
          <div className="exam-pane materials-pane">
            <h3>给定资料</h3>
            {paper.materials.map((m) => (
              <article key={m.id} className="given-material">
                <h4>{m.title}</h4>
                {m.body.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </article>
            ))}
          </div>
          <div className="exam-pane questions-pane">
            <div className="q-tabs">
              {paper.questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  className={activeQ === q.id ? 'active' : ''}
                  onClick={() => setActiveQ(q.id)}
                >
                  第{q.index}题
                </button>
              ))}
            </div>
            {paper.questions.filter((q) => q.id === activeQ).map((q) => {
              const value = attempt?.answers[q.id] ?? '';
              return (
                <div key={q.id} className="question-block">
                  <div className="q-meta">
                    <span>{QUESTION_TYPE_LABELS[q.type]}</span>
                    <span>{q.score}分</span>
                    <span>{q.wordLimit}</span>
                  </div>
                  <p className="q-prompt">{q.prompt}</p>
                  <textarea
                    rows={12}
                    value={value}
                    readOnly={submitted}
                    placeholder="在此作答，内容自动保存"
                    onChange={(e) => onSaveAnswer(q.id, e.target.value)}
                  />
                  <p className="word-count">已写 {countChars(value)} 字（不含空白）</p>
                  {submitted && (
                    <div className="reference-box">
                      <h4>参考要点（对照用，不是唯一答案）</h4>
                      <pre>{q.reference}</pre>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="exam-submit-row">
              {!submitted ? (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    if (window.confirm('交卷后将显示参考要点，作答锁定。确定交卷？')) onSubmit();
                  }}
                >
                  交卷并查看要点
                </button>
              ) : (
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    if (window.confirm('将清空本卷作答并重新计时，确定？')) onReset();
                  }}
                >
                  重做本卷
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
