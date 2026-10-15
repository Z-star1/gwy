import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ModuleProgress,
  ModuleStatus,
  NotebookEntry,
  NotebookKind,
  ScoreRecord,
  StudyLog,
  StudyState,
} from '../types';
import { XINGCE_MODULES, SHENLUN_MODULES } from '../data/examData';
import { checkInHours, localDateKey } from '../lib/dates';

const STORAGE_KEY = 'gwy-study-state';
const BACKUP_APP = 'gwy';
const BACKUP_VERSION = 1;

function createDefaultProgress(): Record<string, ModuleProgress> {
  const progress: Record<string, ModuleProgress> = {};
  [...XINGCE_MODULES, ...SHENLUN_MODULES].forEach((m) => {
    progress[m.id] = { moduleId: m.id, status: 'not-started', hoursSpent: 0 };
  });
  return progress;
}

function defaultState(): StudyState {
  return {
    moduleProgress: createDefaultProgress(),
    scoreRecords: [],
    studyLogs: [],
    startDate: localDateKey(),
    examDate: '',
    notebook: [],
    examAttempts: {},
    xingceAttempts: {},
    dailyChecks: {},
    wrongQuestionIds: [],
  };
}

const MODULE_STATUSES: ModuleStatus[] = ['not-started', 'learning', 'practicing', 'mastered'];

function isPlainRecord<T extends object>(value: unknown): value is T {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isModuleStatus(value: unknown): value is ModuleStatus {
  return typeof value === 'string' && MODULE_STATUSES.includes(value as ModuleStatus);
}

function normalizeModuleProgress(raw: unknown): Record<string, ModuleProgress> {
  const progress = createDefaultProgress();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return progress;
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const base = progress[id] ?? { moduleId: id, status: 'not-started' as const, hoursSpent: 0 };
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      progress[id] = base;
      continue;
    }
    const record = value as Partial<ModuleProgress>;
    const hours = record.hoursSpent;
    progress[id] = {
      moduleId: id,
      status: isModuleStatus(record.status) ? record.status : base.status,
      hoursSpent: typeof hours === 'number' && Number.isFinite(hours) && hours >= 0 ? hours : base.hoursSpent,
    };
  }
  return progress;
}

function normalizeDailyChecks(raw: unknown): Record<string, string[]> {
  if (!isPlainRecord<Record<string, unknown>>(raw)) return {};
  const checks: Record<string, string[]> = {};
  for (const [date, tasks] of Object.entries(raw)) {
    if (!Array.isArray(tasks)) continue;
    checks[date] = tasks.filter((id): id is string => typeof id === 'string');
  }
  return checks;
}

function hydrateState(parsed: Partial<StudyState>): StudyState {
  const defaults = defaultState();
  return {
    ...defaults,
    ...parsed,
    moduleProgress: normalizeModuleProgress(parsed.moduleProgress),
    scoreRecords: Array.isArray(parsed.scoreRecords) ? parsed.scoreRecords : [],
    studyLogs: Array.isArray(parsed.studyLogs) ? parsed.studyLogs : [],
    notebook: Array.isArray(parsed.notebook) ? parsed.notebook : [],
    examAttempts: isPlainRecord(parsed.examAttempts) ? parsed.examAttempts : {},
    xingceAttempts: isPlainRecord(parsed.xingceAttempts) ? parsed.xingceAttempts : {},
    dailyChecks: normalizeDailyChecks(parsed.dailyChecks),
    wrongQuestionIds: Array.isArray(parsed.wrongQuestionIds) ? parsed.wrongQuestionIds : [],
    startDate: parsed.startDate ?? defaults.startDate,
    examDate: parsed.examDate ?? '',
  };
}

function loadState(): StudyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return hydrateState(JSON.parse(raw) as Partial<StudyState>);
  } catch {
    return defaultState();
  }
}

function extractImportedState(raw: unknown): Partial<StudyState> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.app === BACKUP_APP && obj.state && typeof obj.state === 'object' && !Array.isArray(obj.state)) {
    return obj.state as Partial<StudyState>;
  }
  if (obj.moduleProgress || obj.startDate || obj.xingceAttempts || obj.dailyChecks) {
    return obj as Partial<StudyState>;
  }
  return null;
}

function saveState(state: StudyState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 隐私模式或配额满时保留内存里的数据，不打断页面
  }
}

export function useStudyStore() {
  const [state, setState] = useState<StudyState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateModuleStatus = useCallback((moduleId: string, status: ModuleStatus) => {
    setState((prev) => ({
      ...prev,
      moduleProgress: {
        ...prev.moduleProgress,
        [moduleId]: { ...prev.moduleProgress[moduleId], status },
      },
    }));
  }, []);

  const addStudyHours = useCallback((moduleId: string, hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return;
    setState((prev) => {
      const current = prev.moduleProgress[moduleId] ?? {
        moduleId,
        status: 'not-started' as const,
        hoursSpent: 0,
      };
      return {
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: {
            ...current,
            hoursSpent: current.hoursSpent + hours,
          },
        },
      };
    });
  }, []);

  const addScoreRecord = useCallback((record: Omit<ScoreRecord, 'id'>) => {
    setState((prev) => ({
      ...prev,
      scoreRecords: [
        { ...record, id: crypto.randomUUID() },
        ...prev.scoreRecords,
      ],
    }));
  }, []);

  const addStudyLog = useCallback((log: Omit<StudyLog, 'id'>) => {
    setState((prev) => ({
      ...prev,
      studyLogs: [{ ...log, id: crypto.randomUUID() }, ...prev.studyLogs],
    }));
  }, []);

  const deleteScoreRecord = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      scoreRecords: prev.scoreRecords.filter((r) => r.id !== id),
    }));
  }, []);

  const addNotebookEntry = useCallback((entry: Omit<NotebookEntry, 'id' | 'createdAt'>) => {
    setState((prev) => ({
      ...prev,
      notebook: [
        {
          ...entry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...prev.notebook,
      ],
    }));
  }, []);

  const updateNotebookEntry = useCallback((id: string, patch: Partial<NotebookEntry>) => {
    setState((prev) => ({
      ...prev,
      notebook: prev.notebook.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteNotebookEntry = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notebook: prev.notebook.filter((e) => e.id !== id),
    }));
  }, []);

  const savedMaterialIds = useMemo(() => {
    const ids = new Set<string>();
    for (const entry of state.notebook) {
      if (entry.sourceMaterialId) ids.add(entry.sourceMaterialId);
    }
    return ids;
  }, [state.notebook]);

  const isMaterialSaved = useCallback(
    (materialId: string) => savedMaterialIds.has(materialId),
    [savedMaterialIds],
  );

  const saveMaterialToNotebook = useCallback(
    (payload: { materialId: string; kind: NotebookKind; text: string; note: string }) => {
      setState((prev) => {
        if (prev.notebook.some((e) => e.sourceMaterialId === payload.materialId)) return prev;
        return {
          ...prev,
          notebook: [
            {
              id: crypto.randomUUID(),
              kind: payload.kind,
              text: payload.text,
              note: payload.note,
              sourceMaterialId: payload.materialId,
              createdAt: new Date().toISOString(),
              favorite: false,
            },
            ...prev.notebook,
          ],
        };
      });
    },
    [],
  );

  const startExam = useCallback((paperId: string) => {
    setState((prev) => {
      if (prev.examAttempts[paperId]) return prev;
      return {
        ...prev,
        examAttempts: {
          ...prev.examAttempts,
          [paperId]: {
            paperId,
            answers: {},
            startedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const saveExamAnswer = useCallback((paperId: string, questionId: string, text: string) => {
    setState((prev) => {
      const current = prev.examAttempts[paperId];
      if (!current || current.submittedAt) return prev;
      return {
        ...prev,
        examAttempts: {
          ...prev.examAttempts,
          [paperId]: {
            ...current,
            answers: { ...current.answers, [questionId]: text },
          },
        },
      };
    });
  }, []);

  const submitExam = useCallback((paperId: string) => {
    setState((prev) => {
      const current = prev.examAttempts[paperId];
      if (!current) return prev;
      return {
        ...prev,
        examAttempts: {
          ...prev.examAttempts,
          [paperId]: { ...current, submittedAt: new Date().toISOString() },
        },
      };
    });
  }, []);

  const resetExam = useCallback((paperId: string) => {
    setState((prev) => {
      const next = { ...prev.examAttempts };
      delete next[paperId];
      return { ...prev, examAttempts: next };
    });
  }, []);

  const saveXingceAnswer = useCallback((setId: string, questionId: string, option: number) => {
    setState((prev) => {
      const current = prev.xingceAttempts[setId] ?? { setId, answers: {} };
      if (current.submittedAt) return prev;
      return {
        ...prev,
        xingceAttempts: {
          ...prev.xingceAttempts,
          [setId]: {
            ...current,
            answers: { ...current.answers, [questionId]: option },
          },
        },
      };
    });
  }, []);

  const submitXingce = useCallback((setId: string, questionIds: string[]) => {
    void import('../data/xingceQuestions').then(({ questionsByIds }) => {
      const qs = questionsByIds(questionIds);
      setState((prev) => {
        const current = prev.xingceAttempts[setId] ?? { setId, answers: {} };
        if (current.submittedAt) return prev;
        const newlyWrong: string[] = [];
        const newlyRight: string[] = [];
        for (const q of qs) {
          if (current.answers[q.id] === q.answer) newlyRight.push(q.id);
          else newlyWrong.push(q.id);
        }
        const keep = prev.wrongQuestionIds.filter((id) => !newlyRight.includes(id));
        return {
          ...prev,
          wrongQuestionIds: [...new Set([...keep, ...newlyWrong])],
          xingceAttempts: {
            ...prev.xingceAttempts,
            [setId]: { ...current, submittedAt: new Date().toISOString() },
          },
        };
      });
    });
  }, []);

  const setExamDate = useCallback((examDate: string) => {
    setState((prev) => ({ ...prev, examDate }));
  }, []);

  const toggleDailyCheck = useCallback((taskId: string) => {
    const date = localDateKey();
    setState((prev) => {
      const current = prev.dailyChecks[date] ?? [];
      const next = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];
      return { ...prev, dailyChecks: { ...prev.dailyChecks, [date]: next } };
    });
  }, []);

  const exportBackup = useCallback(() => {
    const payload = {
      app: BACKUP_APP,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gwy-backup-${localDateKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [state]);

  const importBackup = useCallback((raw: unknown) => {
    const extracted = extractImportedState(raw);
    if (!extracted) return false;
    setState(hydrateState(extracted));
    return true;
  }, []);

  const resetXingce = useCallback((setId: string) => {
    setState((prev) => {
      const next = { ...prev.xingceAttempts };
      delete next[setId];
      return { ...prev, xingceAttempts: next };
    });
  }, []);

  const latestMock = state.scoreRecords.find((r) => r.type === 'mock');
  const bestMock = state.scoreRecords
    .filter((r) => r.type === 'mock')
    .reduce<ScoreRecord | null>((best, r) => {
      const total = r.xingce + r.shenlun;
      if (!best || total > best.xingce + best.shenlun) return r;
      return best;
    }, null);

  const moduleHours = Object.values(state.moduleProgress).reduce((s, p) => s + p.hoursSpent, 0);
  const checkedHours = Object.values(state.dailyChecks).reduce((s, tasks) => s + checkInHours(tasks), 0);
  const totalHours = moduleHours + checkedHours;
  const todayChecked = state.dailyChecks[localDateKey()] ?? [];
  const todayCheckedHours = checkInHours(todayChecked);
  const masteredCount = Object.values(state.moduleProgress).filter((p) => p.status === 'mastered').length;
  const totalModules = XINGCE_MODULES.length + SHENLUN_MODULES.length;

  return {
    state,
    updateModuleStatus,
    addStudyHours,
    addScoreRecord,
    addStudyLog,
    deleteScoreRecord,
    addNotebookEntry,
    updateNotebookEntry,
    deleteNotebookEntry,
    isMaterialSaved,
    saveMaterialToNotebook,
    startExam,
    saveExamAnswer,
    submitExam,
    resetExam,
    saveXingceAnswer,
    submitXingce,
    resetXingce,
    setExamDate,
    toggleDailyCheck,
    exportBackup,
    importBackup,
    todayChecked,
    todayCheckedHours,
    latestMock,
    bestMock,
    totalHours,
    masteredCount,
    totalModules,
  };
}
