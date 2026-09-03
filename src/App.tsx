import { useEffect, useState } from 'react';
import { BackupBar } from './components/BackupBar';
import { SkillGuide } from './components/SkillGuide';
import { ExamBank } from './components/ExamBank';
import { Dashboard } from './components/Dashboard';
import { DailyPlan } from './components/DailyPlan';
import { MaterialsPage } from './components/MaterialsPage';
import { ModuleSection } from './components/ModuleSection';
import { ScoreTracker } from './components/ScoreTracker';
import { StudyPlan } from './components/StudyPlan';
import { SKILL_TO_PRACTICE } from './data/skillGuides';
import { XINGCE_MODULES, SHENLUN_MODULES } from './data/examData';
import { useStudyStore } from './hooks/useStudyStore';
import './App.css';

type Tab = 'overview' | 'xingce' | 'shenlun' | 'scores' | 'materials' | 'plan' | 'exams' | 'skills';

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'overview', label: '总览', short: '总览' },
  { id: 'exams', label: '题库', short: '题库' },
  { id: 'skills', label: '技巧', short: '技巧' },
  { id: 'materials', label: '素材', short: '素材' },
  { id: 'xingce', label: '行测', short: '行测' },
  { id: 'shenlun', label: '申论', short: '申论' },
  { id: 'plan', label: '规划', short: '规划' },
  { id: 'scores', label: '模考', short: '模考' },
];

const MOBILE_TABS: Tab[] = ['overview', 'exams', 'skills', 'materials', 'plan'];

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
  const [examJump, setExamJump] = useState<{ subject: 'xingce' | 'shenlun'; setId?: string }>({
    subject: 'xingce',
  });
  const [examNonce, setExamNonce] = useState(0);
  const store = useStudyStore();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const goExam = (subject: 'xingce' | 'shenlun', setId?: string) => {
    setExamJump({ subject, setId });
    setExamNonce((n) => n + 1);
    setTab('exams');
  };

  const goSkillPractice = (skillId: string) => {
    const target = SKILL_TO_PRACTICE[skillId];
    if (!target) {
      setTab('exams');
      return;
    }
    goExam(target.subject, target.setId);
  };

  const dailyPlan = (
    <DailyPlan
      checked={store.todayChecked}
      onToggle={store.toggleDailyCheck}
      onGoPractice={(subject) => goExam(subject)}
    />
  );

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

      <InstallBanner />

      <main className={`main ${tab === 'exams' ? 'exam-mode' : ''}`}>
        {(tab === 'overview' || tab === 'xingce' || tab === 'shenlun') && (
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
            <button type="button" className="jump-materials" onClick={() => goExam('shenlun')}>
              电脑做申论 · 按年份打开模拟卷
            </button>
            <button type="button" className="jump-materials secondary-jump" onClick={() => setTab('materials')}>
              打开素材库 · 看金句案例，记进积累本
            </button>
          </>
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
            <BackupBar onExport={store.exportBackup} onImport={store.importBackup} />
          </>
        )}

        {tab === 'xingce' && (
          <>
            <button type="button" className="jump-materials" onClick={() => goExam('xingce')}>
              电脑做行测练习 · 资料判断言语常识数量
            </button>
            <button
              type="button"
              className="jump-materials secondary-jump"
              onClick={() => {
                setSkillSubject('xingce');
                setTab('skills');
              }}
            >
              行测各题型做题技巧
            </button>
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
          </>
        )}

        {tab === 'shenlun' && (
          <>
            <button type="button" className="jump-materials" onClick={() => goExam('shenlun')}>
              电脑做申论模拟卷 · 按年份练习行政执法卷
            </button>
            <button
              type="button"
              className="jump-materials secondary-jump"
              onClick={() => {
                setSkillSubject('shenlun');
                setTab('skills');
              }}
            >
              申论各题型作答技巧与词语素材
            </button>
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

        {tab === 'skills' && (
          <SkillGuide
            key={skillSubject}
            initialSubject={skillSubject}
            onPractice={goSkillPractice}
            onOpenMaterials={() => setTab('materials')}
          />
        )}

        {tab === 'exams' && (
          <ExamBank
            key={examNonce}
            initialSubject={examJump.subject}
            initialXingceSet={examJump.setId}
            attempts={store.state.examAttempts}
            onStart={store.startExam}
            onSaveAnswer={store.saveExamAnswer}
            onSubmit={store.submitExam}
            onReset={store.resetExam}
            xingceAttempts={store.state.xingceAttempts}
            onXingceAnswer={store.saveXingceAnswer}
            onXingceSubmit={store.submitXingce}
            onXingceReset={store.resetXingce}
            wrongQuestionIds={store.state.wrongQuestionIds}
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

        {tab === 'scores' && (
          <ScoreTracker
            records={store.state.scoreRecords}
            onAdd={store.addScoreRecord}
            onDelete={store.deleteScoreRecord}
          />
        )}

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
        安卓可用浏览器打开，或添加到主屏幕 · 数据保存在本机
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
      <span>添加到手机桌面，通勤也能看素材</span>
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
