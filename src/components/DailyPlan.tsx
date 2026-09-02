import { WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE } from '../data/examData';

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface Props {
  checked: string[];
  onToggle: (taskId: string) => void;
  onGoPractice: (subject: 'xingce' | 'shenlun') => void;
}

export function DailyPlan({ checked, onToggle, onGoPractice }: Props) {
  const today = new Date().getDay();
  const dayName = DAY_NAMES[today];
  const isWeekend = today === 0 || today === 6;
  const weekdayPlan = WEEKDAY_SCHEDULE.find((d) => d.day === dayName);
  const weekendPlan = WEEKEND_SCHEDULE.find((d) => d.day === dayName);
  const doneHours = checked.reduce((sum, id) => sum + (id === 'wk' ? 2 : 1), 0);

  return (
    <section className="daily-section">
      <h2>📌 今晚 2 小时任务</h2>
      <div className="daily-card">
        <div className="daily-header">
          <span className="daily-date">{dayName}</span>
          <span className="daily-badge">{isWeekend ? '周末' : '工作日'}</span>
          <span className={`daily-check-status ${doneHours >= 2 ? 'done' : ''}`}>
            已打卡 {doneHours}/2h
          </span>
        </div>

        {weekdayPlan && (
          <div className="daily-tasks">
            <TaskRow
              taskId="xingce"
              label="行测 1h"
              text={weekdayPlan.xingce}
              variant="xingce"
              checked={checked.includes('xingce')}
              onToggle={onToggle}
              onGo={() => onGoPractice('xingce')}
              goLabel="去题库"
            />
            <TaskRow
              taskId="shenlun"
              label="申论 1h"
              text={weekdayPlan.shenlun}
              variant="shenlun"
              checked={checked.includes('shenlun')}
              onToggle={onToggle}
              onGo={() => onGoPractice('shenlun')}
              goLabel="去题库"
            />
            <p className="daily-tip">💡 {weekdayPlan.tip} · 勾选计入累计学习时长</p>
          </div>
        )}

        {weekendPlan && (
          <div className="daily-tasks">
            <TaskRow
              taskId="wk"
              label={`${weekendPlan.focus} 2h`}
              text={weekendPlan.content}
              variant="weekend"
              checked={checked.includes('wk')}
              onToggle={onToggle}
              onGo={() => onGoPractice(today === 6 ? 'xingce' : 'shenlun')}
              goLabel="去题库"
            />
            <p className="daily-tip">💡 {weekendPlan.tip} · 勾选计入累计学习时长</p>
          </div>
        )}
      </div>
    </section>
  );
}

function TaskRow({
  taskId,
  label,
  text,
  variant,
  checked,
  onToggle,
  onGo,
  goLabel,
}: {
  taskId: string;
  label: string;
  text: string;
  variant: string;
  checked: boolean;
  onToggle: (taskId: string) => void;
  onGo: () => void;
  goLabel: string;
}) {
  return (
    <div className={`daily-task ${variant} ${checked ? 'done' : ''}`}>
      <label className="task-check">
        <input type="checkbox" checked={checked} onChange={() => onToggle(taskId)} />
        <span>
          <span className="task-label">{label}</span>
          <span className="task-text">{text}</span>
        </span>
      </label>
      <button type="button" className="task-go" onClick={onGo}>
        {goLabel}
      </button>
    </div>
  );
}
