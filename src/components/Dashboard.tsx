import { TARGET_TOTAL, TARGET_XINGCE, TARGET_SHENLUN } from '../types';
import type { ScoreRecord } from '../types';

interface Props {
  latestMock?: ScoreRecord;
  bestMock?: ScoreRecord | null;
  totalHours: number;
  masteredCount: number;
  totalModules: number;
  daysStudying: number;
}

export function Dashboard({
  latestMock,
  bestMock,
  totalHours,
  masteredCount,
  totalModules,
  daysStudying,
}: Props) {
  const currentTotal = latestMock ? latestMock.xingce + latestMock.shenlun : 0;
  const bestTotal = bestMock ? bestMock.xingce + bestMock.shenlun : 0;
  const progress = Math.min((bestTotal / TARGET_TOTAL) * 100, 100);

  return (
    <section className="dashboard">
      <div className="hero">
        <h1>公务员考试备考</h1>
        <p className="hero-sub">目标总分 <strong>{TARGET_TOTAL}</strong> 分 · 行测 {TARGET_XINGCE} + 申论 {TARGET_SHENLUN}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <span className="stat-label">目标分数</span>
          <span className="stat-value">{TARGET_TOTAL}</span>
          <span className="stat-sub">满分 200</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">最近模考</span>
          <span className="stat-value">{latestMock ? currentTotal : '—'}</span>
          <span className="stat-sub">
            {latestMock
              ? `行测 ${latestMock.xingce} · 申论 ${latestMock.shenlun}`
              : '尚未记录'}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">最高模考</span>
          <span className="stat-value">{bestMock ? bestTotal : '—'}</span>
          <span className="stat-sub">
            {bestMock ? `距目标差 ${Math.max(TARGET_TOTAL - bestTotal, 0)} 分` : '加油冲刺'}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">学习时长</span>
          <span className="stat-value">{totalHours.toFixed(1)}h</span>
          <span className="stat-sub">已备考 {daysStudying} 天</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">模块掌握</span>
          <span className="stat-value">{masteredCount}/{totalModules}</span>
          <span className="stat-sub">已标记精通</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>冲刺进度</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="target-breakdown">
          <div className="target-item xingce">
            <span>行测目标</span>
            <strong>{TARGET_XINGCE}</strong>
            <span className="current">{latestMock?.xingce ?? '—'}</span>
          </div>
          <div className="target-item shenlun">
            <span>申论目标</span>
            <strong>{TARGET_SHENLUN}</strong>
            <span className="current">{latestMock?.shenlun ?? '—'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
