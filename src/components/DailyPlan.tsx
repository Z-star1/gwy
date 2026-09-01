import { WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE } from '../data/examData';

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function DailyPlan() {
  const today = new Date().getDay();
  const dayName = DAY_NAMES[today];
  const isWeekend = today === 0 || today === 6;
  const weekdayPlan = WEEKDAY_SCHEDULE.find((d) => d.day === dayName);
  const weekendPlan = WEEKEND_SCHEDULE.find((d) => d.day === dayName);

  return (
    <section className="daily-section">
      <h2>📌 今日学习计划（2 小时）</h2>
      <div className="daily-card">
        <div className="daily-header">
          <span className="daily-date">{dayName}</span>
          <span className="daily-badge">{isWeekend ? '周末' : '工作日'}</span>
        </div>

        {weekdayPlan && (
          <div className="daily-tasks">
            <div className="daily-task xingce">
              <span className="task-label">行测 1h</span>
              <p>{weekdayPlan.xingce}</p>
            </div>
            <div className="daily-task shenlun">
              <span className="task-label">申论 1h</span>
              <p>{weekdayPlan.shenlun}</p>
            </div>
            <p className="daily-tip">💡 {weekdayPlan.tip}</p>
          </div>
        )}

        {weekendPlan && (
          <div className="daily-tasks">
            <div className="daily-task weekend">
              <span className="task-label">{weekendPlan.focus} 2h</span>
              <p>{weekendPlan.content}</p>
            </div>
            <p className="daily-tip">💡 {weekendPlan.tip}</p>
          </div>
        )}
      </div>
    </section>
  );
}
