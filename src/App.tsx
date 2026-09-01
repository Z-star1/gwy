import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ModuleSection } from './components/ModuleSection';
import { ScoreTracker } from './components/ScoreTracker';
import { StudyPlan } from './components/StudyPlan';
import { XINGCE_MODULES, SHENLUN_MODULES } from './data/examData';
import { useStudyStore } from './hooks/useStudyStore';
import './App.css';

type Tab = 'overview' | 'xingce' | 'shenlun' | 'scores' | 'plan';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: '总览' },
  { id: 'xingce', label: '行测' },
  { id: 'shenlun', label: '申论' },
  { id: 'scores', label: '模考' },
  { id: 'plan', label: '规划' },
];

function daysSince(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000));
}

export default function App() {
  const [tab, setTab] = useState<Tab>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const store = useStudyStore();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">GWY 备考</div>
        <div className="nav-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {(tab === 'overview' || tab === 'xingce' || tab === 'shenlun') && (
          <Dashboard
            latestMock={store.latestMock}
            bestMock={store.bestMock}
            totalHours={store.totalHours}
            masteredCount={store.masteredCount}
            totalModules={store.totalModules}
            daysStudying={daysSince(store.state.startDate)}
          />
        )}

        {tab === 'overview' && (
          <>
            <ModuleSection
              title="行测"
              icon="📝"
              modules={XINGCE_MODULES}
              progress={store.state.moduleProgress}
              onStatusChange={store.updateModuleStatus}
              onAddHours={store.addStudyHours}
              expandedId={expandedId}
              onToggleExpand={toggleExpand}
            />
            <ModuleSection
              title="申论"
              icon="✍️"
              modules={SHENLUN_MODULES}
              progress={store.state.moduleProgress}
              onStatusChange={store.updateModuleStatus}
              onAddHours={store.addStudyHours}
              expandedId={expandedId}
              onToggleExpand={toggleExpand}
            />
          </>
        )}

        {tab === 'xingce' && (
          <ModuleSection
            title="行测"
            icon="📝"
            modules={XINGCE_MODULES}
            progress={store.state.moduleProgress}
            onStatusChange={store.updateModuleStatus}
            onAddHours={store.addStudyHours}
            expandedId={expandedId}
            onToggleExpand={toggleExpand}
          />
        )}

        {tab === 'shenlun' && (
          <ModuleSection
            title="申论"
            icon="✍️"
            modules={SHENLUN_MODULES}
            progress={store.state.moduleProgress}
            onStatusChange={store.updateModuleStatus}
            onAddHours={store.addStudyHours}
            expandedId={expandedId}
            onToggleExpand={toggleExpand}
          />
        )}

        {tab === 'scores' && (
          <ScoreTracker
            records={store.state.scoreRecords}
            onAdd={store.addScoreRecord}
            onDelete={store.deleteScoreRecord}
          />
        )}

        {tab === 'plan' && <StudyPlan />}
      </main>

      <footer className="footer">
        数据保存在浏览器本地 · 坚持就是胜利 💪
      </footer>
    </div>
  );
}
