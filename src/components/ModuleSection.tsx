import type { ExamModule, ModuleProgress, ModuleStatus } from '../types';

const STATUS_LABELS: Record<ModuleStatus, string> = {
  'not-started': '未开始',
  learning: '学习中',
  practicing: '刷题中',
  mastered: '已掌握',
};

const STATUS_OPTIONS: ModuleStatus[] = ['not-started', 'learning', 'practicing', 'mastered'];

interface Props {
  title: string;
  icon: string;
  modules: ExamModule[];
  progress: Record<string, ModuleProgress>;
  onStatusChange: (moduleId: string, status: ModuleStatus) => void;
  onAddHours: (moduleId: string, hours: number) => void;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function ModuleSection({
  title,
  icon,
  modules,
  progress,
  onStatusChange,
  onAddHours,
  expandedId,
  onToggleExpand,
}: Props) {
  const sectionTarget = modules.reduce((s, m) => s + m.targetScore, 0);

  return (
    <section className="module-section">
      <div className="section-header">
        <h2>{icon} {title}</h2>
        <span className="section-target">目标 {sectionTarget} 分</span>
      </div>
      <div className="module-grid">
        {modules.map((mod) => {
          const prog = progress[mod.id];
          const isExpanded = expandedId === mod.id;
          return (
            <div key={mod.id} className={`module-card status-${prog?.status ?? 'not-started'}`}>
              <div className="module-header" onClick={() => onToggleExpand(mod.id)}>
                <div>
                  <h3>{mod.name}</h3>
                  <p className="module-desc">{mod.description}</p>
                </div>
                <div className="module-meta">
                  <span className="badge">{mod.questionCount}</span>
                  <span className="target-score">目标 {mod.targetScore}/{mod.maxScore}</span>
                </div>
              </div>

              <div className="module-controls">
                <select
                  value={prog?.status ?? 'not-started'}
                  onChange={(e) => onStatusChange(mod.id, e.target.value as ModuleStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button type="button" onClick={() => onAddHours(mod.id, 1)}>+1h</button>
                <span className="hours">{prog?.hoursSpent ?? 0}h</span>
              </div>

              {isExpanded && (
                <div className="subtopics">
                  {mod.subTopics.map((st) => (
                    <div key={st.id} className="subtopic">
                      <h4>{st.name}</h4>
                      <ul>
                        {st.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
