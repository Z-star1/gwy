import { useEffect, useState } from 'react';
import { BackupBar } from './components/BackupBar';
import { DailyPlan } from './components/DailyPlan';
import { Dashboard } from './components/Dashboard';
import { MaterialsPage } from './components/MaterialsPage';
import { ModuleSection } from './components/ModuleSection';
import { SkillGuide } from './components/SkillGuide';
import { StudyPlan } from './components/StudyPlan';
import { TemplatesPage } from './components/TemplatesPage';
import { SHENLUN_MODULES, XINGCE_MODULES } from './data/examData';
import { useStudyStore } from './hooks/useStudyStore';
import type { StudyTarget } from './types';
import './App.css';

type Tab = 'overview' | 'skills' | 'materials' | 'templates' | 'plan';

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'overview', label: '总览', short: '总览' },
  { id: 'skills', label: '技巧', short: '技巧' },
  { id: 'materials', label: '素材', short: '素材' },
  { id: 'templates', label: '模板', short: '模板' },
  { id: 'plan', label: '规划', short: '规划' },
];

const MOBILE_TABS: Tab[] = ['overview', 'skills', 'materials', 'templates', 'plan'];

function daysSince(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000));
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [skillSubject, setSkillSubject] = useState<'xingce' | 'shenlun'>('xingce');
  const store = useStudyStore();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const goStudy = (target: StudyTarget) => {
    if (target === 'skills-xingce') {
      setSkillSubject('xingce');
      setTab('skills');
      return;
    }
    if (target === 'skills-shenlun') {
      setSkillSubject('shenlun');
      setTab('skills');
      return;
    }
    if (target === 'materials') {
      setTab('materials');
      return;
    }
    setTab('templates');
  };

  const dailyPlan = (
    <DailyPlan checked={store.todayChecked} onToggle={store.toggleDailyCheck} onGoStudy={goStudy} />
  );

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">GWY 手册</div>
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

      <InstallBanner />

      <main className="main">
        {tab === 'overview' && (
          <Dashboard
            latestMock={store.latestMock}
            bestMock={store.bestMock}
            totalHours={store.totalHours}
            masteredCount={store.masteredCount}
            totalModules={store.totalModules}
            daysStudying={daysSince(store.state.startDate)}
            startDate={store.state.startDate}
            examDate={store.state.examDate}
            onExamDateChange={store.setExamDate}
            todayCheckedHours={store.todayCheckedHours}
          />
        )}

        {tab === 'overview' && dailyPlan}

        {tab === 'overview' && (
          <>
            <button type="button" className="jump-materials" onClick={() => goStudy('skills-shenlun')}>
              看申论技巧与词语 · 分题型经验
            </button>
            <button type="button" className="jump-materials secondary-jump" onClick={() => setTab('templates')}>
              打开作文 / 公文模板 · 框架与套话
            </button>
            <button type="button" className="jump-materials secondary-jump" onClick={() => setTab('materials')}>
              打开素材库 · 金句案例热词
            </button>
          </>
        )}

        {tab === 'overview' && (
          <>
            <ModuleSection
              title="行测模块（技巧进度）"
              icon="📝"
              modules={XINGCE_MODULES}
              progress={store.state.moduleProgress}
              onStatusChange={store.updateModuleStatus}
              onAddHours={store.addStudyHours}
              expandedId={expandedId}
              onToggleExpand={toggleExpand}
            />
            <ModuleSection
              title="申论模块（技巧进度）"
              icon="✍️"
              modules={SHENLUN_MODULES}
              progress={store.state.moduleProgress}
              onStatusChange={store.updateModuleStatus}
              onAddHours={store.addStudyHours}
              expandedId={expandedId}
              onToggleExpand={toggleExpand}
            />
            <BackupBar onExport={store.exportBackup} onImport={store.importBackup} />
          </>
        )}

        {tab === 'skills' && (
          <SkillGuide
            key={skillSubject}
            initialSubject={skillSubject}
            onOpenMaterials={() => setTab('materials')}
            onOpenTemplates={() => setTab('templates')}
          />
        )}

        {tab === 'materials' && (
          <MaterialsPage
            notebook={store.state.notebook}
            isMaterialSaved={store.isMaterialSaved}
            onSaveMaterial={store.saveMaterialToNotebook}
            onAddEntry={store.addNotebookEntry}
            onToggleFavorite={(id, favorite) => store.updateNotebookEntry(id, { favorite })}
            onDeleteEntry={store.deleteNotebookEntry}
          />
        )}

        {tab === 'templates' && <TemplatesPage />}

        {tab === 'plan' && (
          <>
            {dailyPlan}
            <StudyPlan />
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="手机导航">
        {TABS.filter((t) => MOBILE_TABS.includes(t.id)).map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.short}
          </button>
        ))}
      </nav>

      <footer className="footer">
        技巧 · 素材 · 模板手册 · 可添加到手机主屏幕 · 数据保存在本机
      </footer>
    </div>
  );
}

function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!deferred || hidden) return null;

  return (
    <div className="install-banner">
      <span>添加到手机桌面，通勤也能看技巧和素材</span>
      <div className="install-actions">
        <button
          type="button"
          onClick={async () => {
            await deferred.prompt();
            setDeferred(null);
          }}
        >
          安装
        </button>
        <button type="button" className="ghost" onClick={() => setHidden(true)}>
          稍后
        </button>
      </div>
    </div>
  );
}
