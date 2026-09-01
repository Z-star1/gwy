export type ModuleStatus = 'not-started' | 'learning' | 'practicing' | 'mastered';

export interface SubTopic {
  id: string;
  name: string;
  tips: string[];
}

export interface ExamModule {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  targetScore: number;
  questionCount: string;
  subTopics: SubTopic[];
}

export interface ScoreRecord {
  id: string;
  date: string;
  type: 'mock' | 'module';
  name: string;
  xingce: number;
  shenlun: number;
  note?: string;
}

export interface StudyLog {
  id: string;
  date: string;
  moduleId: string;
  duration: number;
  content: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: ModuleStatus;
  hoursSpent: number;
}

export interface StudyState {
  moduleProgress: Record<string, ModuleProgress>;
  scoreRecords: ScoreRecord[];
  studyLogs: StudyLog[];
  startDate: string;
}

export const TARGET_TOTAL = 160;
export const TARGET_XINGCE = 85;
export const TARGET_SHENLUN = 75;
