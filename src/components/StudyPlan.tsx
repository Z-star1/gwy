import {
  STUDY_PHASES,
  WEEKDAY_SCHEDULE,
  WEEKEND_SCHEDULE,
  WEEKLY_PLAN,
  WORKING_TIPS,
  HOUR_ALLOCATION,
} from '../data/examData';
import { DAILY_HOURS, PLAN_WEEKS, TOTAL_TARGET_HOURS } from '../types';

export function StudyPlan() {
  return (
    <section className="plan-section">
      <div className="plan-intro">
        <h2>📅 在职备考计划</h2>
        <p>每天 <strong>{DAILY_HOURS} 小时</strong> · <strong>{PLAN_WEEKS} 周</strong> · 共 <strong>{TOTAL_TARGET_HOURS} 小时</strong></p>
      </div>

      <div className="phase-timeline">
        {STUDY_PHASES.map((p) => (
          <div key={p.phase} className="phase-card">
            <div className="phase-num">第 {p.phase} 阶段 · {p.hours}</div>
            <h3>{p.name}</h3>
            <span className="phase-weeks">{p.weeks}</span>
            <p>{p.focus}</p>
            <p className="phase-daily">每日：{p.daily}</p>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">工作日每日安排（周一至周五，各 2h）</h3>
      <div className="schedule-table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>行测 1h</th>
              <th>申论 1h</th>
            </tr>
          </thead>
          <tbody>
            {WEEKDAY_SCHEDULE.map((d) => (
              <tr key={d.day}>
                <td><strong>{d.day}</strong></td>
                <td>{d.xingce}</td>
                <td>{d.shenlun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="subsection-title">周末安排（各 2h）</h3>
      <div className="weekend-cards">
        {WEEKEND_SCHEDULE.map((d) => (
          <div key={d.day} className="weekend-card">
            <h4>{d.day} · {d.focus}</h4>
            <p>{d.content}</p>
            <span className="weekend-tip">{d.tip}</span>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">12 周周计划</h3>
      <div className="weekly-plan-grid">
        {WEEKLY_PLAN.map((w) => (
          <div key={w.week} className="week-card">
            <div className="week-num">第 {w.week} 周</div>
            <h4>{w.theme}</h4>
            <p><strong>行测：</strong>{w.xingce}</p>
            <p><strong>申论：</strong>{w.shenlun}</p>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">180 小时时间分配</h3>
      <div className="hour-bars">
        {HOUR_ALLOCATION.map((h) => (
          <div key={h.module} className="hour-bar-item">
            <div className="hour-bar-label">
              <span>{h.module}</span>
              <span>{h.hours}h ({h.percent}%)</span>
            </div>
            <div className="hour-bar-track">
              <div className="hour-bar-fill" style={{ width: `${h.percent * 4}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="strategy-cards">
        <div className="strategy-card working">
          <h3>在职备考要诀</h3>
          <ul>
            {WORKING_TIPS.map((t) => (
              <li key={t.title}><strong>{t.title}</strong>：{t.content}</li>
            ))}
          </ul>
        </div>
        <div className="strategy-card">
          <h3>160 分拆解</h3>
          <table className="score-table">
            <thead>
              <tr><th>模块</th><th>目标</th><th>策略</th></tr>
            </thead>
            <tbody>
              <tr><td>资料分析</td><td>19/20</td><td>投入最多时间，必拿模块</td></tr>
              <tr><td>判断推理</td><td>32/35</td><td>类比定义全对</td></tr>
              <tr><td>言语理解</td><td>36/40</td><td>通勤碎片积累</td></tr>
              <tr><td>常识判断</td><td>14/20</td><td>午休+通勤刷题</td></tr>
              <tr><td>数量关系</td><td>9/15</td><td>只做简单题，不纠结</td></tr>
              <tr><td>申论小题</td><td>57/80</td><td>工作日每天 1 道</td></tr>
              <tr><td>申论大作文</td><td>28/40</td><td>周末集中练习</td></tr>
              <tr className="total-row"><td><strong>合计</strong></td><td><strong>160/200</strong></td><td></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
