import { TARGET_TOTAL, TARGET_XINGCE, TARGET_SHENLUN, DAILY_HOURS, PLAN_DAYS, TOTAL_TARGET_HOURS } from '../types';
import type { ScoreRecord } from '../types';
import { addDays, daysUntil } from '../lib/dates';

interface Props {
  latestMock?: ScoreRecord;
  bestMock?: ScoreRecord | null;
  totalHours: number;
  masteredCount: number;
  totalModules: number;
  daysStudying: number;
  startDate: string;
  examDate: string;
  onExamDateChange: (date: string) => void;
  todayCheckedHours: number;
}

function countdown(startDate: string, examDate: string) {
  if (examDate) {
    const left = daysUntil(examDate);
    if (left > 0) return { remainingDays: left, label: `距考试 ${left} 天` };
    if (left === 0) return { remainingDays: 0, label: '今天考试' };
    return { remainingDays: 0, label: '考试日已过，可改日期' };
  }
  const planEnd = addDays(startDate, PLAN_DAYS);
  const left = Math.max(0, daysUntil(planEnd));
  return { remainingDays: left, label: `距 90 天计划结束 ${left} 天` };
}

export function Dashboard({
  latestMock,
  bestMock,
  totalHours,
  masteredCount,
  totalModules,
  daysStudying,
  startDate,
  examDate,
  onExamDateChange,
  todayCheckedHours,
}: Props) {
  const currentTotal = latestMock ? latestMock.xingce + latestMock.shenlun : 0;
  const bestTotal = bestMock ? bestMock.xingce + bestMock.shenlun : 0;
  const scoreProgress = Math.min((bestTotal / TARGET_TOTAL) * 100, 100);
  const expectedHours = Math.min(daysStudying * DAILY_HOURS, TOTAL_TARGET_HOURS);
  const hourProgress = Math.min((totalHours / TOTAL_TARGET_HOURS) * 100, 100);
  const { remainingDays, label } = countdown(startDate, examDate);
  const hoursGap = expectedHours - totalHours;
  const todayDone = todayCheckedHours >= DAILY_HOURS;

  return (
    <section className="dashboard">
      <div className="hero">
        <h1>公务员考试备考</h1>
        <p className="hero-sub">
          目标 <strong>{TARGET_TOTAL}</strong> 分 · 行测 {TARGET_XINGCE} + 申论 {TARGET_SHENLUN}
        </p>
        <p className="hero-plan">
          在职备考 · 每日 {DAILY_HOURS} 小时 · 三个月（{PLAN_DAYS} 天 / {TOTAL_TARGET_HOURS} 小时）
        </p>
        <div className="exam-date-row">
          <label>
            考试日期
            <input
              type="date"
              value={examDate}
              onChange={(e) => onExamDateChange(e.target.value)}
            />
          </label>
          <span className={`countdown-pill ${remainingDays <= 14 && examDate ? 'urgent' : ''}`}>
            {label}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <span className="stat-label">目标分数</span>
          <span className="stat-value">{TARGET_TOTAL}</span>
          <span className="stat-sub">满分 200</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">今日打卡</span>
          <span className="stat-value">{todayCheckedHours}/{DAILY_HOURS}h</span>
          <span className="stat-sub">{todayDone ? '今晚任务已完成' : `还差 ${DAILY_HOURS - todayCheckedHours} 小时`}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">累计学习</span>
          <span className="stat-value">{totalHours.toFixed(1)}h</span>
          <span className="stat-sub">
            目标 {TOTAL_TARGET_HOURS}h · 已学 {hourProgress.toFixed(0)}%
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">最近模考</span>
          <span className="stat-value">{latestMock ? currentTotal : '—'}</span>
          <span className="stat-sub">
            {latestMock
              ? `行测 ${latestMock.xingce} · 申论 ${latestMock.shenlun}`
              : '第 9 周开始模考'}
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
          <span className="stat-label">模块掌握</span>
          <span className="stat-value">{masteredCount}/{totalModules}</span>
          <span className="stat-sub">已备考 {daysStudying} 天</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>学习时长进度</span>
          <span>{hourProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill hours" style={{ width: `${hourProgress}%` }} />
        </div>
        {hoursGap > 0.5 && (
          <p className="progress-hint">比计划少学了 {hoursGap.toFixed(1)} 小时，今晚补回来 💪</p>
        )}
        {hoursGap <= 0.5 && totalHours > 0 && (
          <p className="progress-hint success">学习进度正常，继续保持！</p>
        )}
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>分数冲刺进度</span>
          <span>{scoreProgress.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${scoreProgress}%` }} />
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
