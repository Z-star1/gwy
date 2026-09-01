import { useCallback, useEffect, useState } from 'react';
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

const STORAGE_KEY = 'gwy-study-state';

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
    startDate: new Date().toISOString().split('T')[0],
    notebook: [],
  };
}

function loadState(): StudyState {
  const defaults = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return {
      ...defaults,
      ...parsed,
      moduleProgress: { ...defaults.moduleProgress, ...parsed.moduleProgress },
      scoreRecords: parsed.scoreRecords ?? [],
      studyLogs: parsed.studyLogs ?? [],
      notebook: parsed.notebook ?? [],
      startDate: parsed.startDate ?? defaults.startDate,
    };
  } catch {
    return defaults;
  }
}

function saveState(state: StudyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    setState((prev) => ({
      ...prev,
      moduleProgress: {
        ...prev.moduleProgress,
        [moduleId]: {
          ...prev.moduleProgress[moduleId],
          hoursSpent: prev.moduleProgress[moduleId].hoursSpent + hours,
        },
      },
    }));
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

  const isMaterialSaved = useCallback(
    (materialId: string) => state.notebook.some((e) => e.sourceMaterialId === materialId),
    [state.notebook],
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

  const latestMock = state.scoreRecords.find((r) => r.type === 'mock');
  const bestMock = state.scoreRecords
    .filter((r) => r.type === 'mock')
    .reduce<ScoreRecord | null>((best, r) => {
      const total = r.xingce + r.shenlun;
      if (!best || total > best.xingce + best.shenlun) return r;
      return best;
    }, null);

  const totalHours = Object.values(state.moduleProgress).reduce((s, p) => s + p.hoursSpent, 0);
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
    latestMock,
    bestMock,
    totalHours,
    masteredCount,
    totalModules,
  };
}
