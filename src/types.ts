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

export type MaterialCategory = 'jinju' | 'anli' | 'chengyu' | 'zhengce';

export interface Material {
  id: string;
  category: MaterialCategory;
  title: string;
  content: string;
  usage: string;
  tags: string[];
}

export type NotebookKind = 'jinju' | 'anli' | 'chengyu' | 'zhengce' | 'other';

export interface NotebookEntry {
  id: string;
  kind: NotebookKind;
  text: string;
  note: string;
  sourceMaterialId?: string;
  createdAt: string;
  favorite: boolean;
}

export interface StudyState {
  moduleProgress: Record<string, ModuleProgress>;
  scoreRecords: ScoreRecord[];
  studyLogs: StudyLog[];
  startDate: string;
  examDate: string;
  notebook: NotebookEntry[];
  examAttempts: Record<string, ExamAttempt>;
  xingceAttempts: Record<string, XingceAttempt>;
  dailyChecks: Record<string, string[]>;
  wrongQuestionIds: string[];
}

export type XingceModuleId = 'changshi' | 'yanyu' | 'shuliang' | 'panduan' | 'ziliao';

export interface XingceQuestion {
  id: string;
  module: XingceModuleId;
  kind: string;
  stem: string;
  material?: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface XingceSet {
  id: string;
  title: string;
  module: XingceModuleId | 'mixed';
  minutes: number;
  questionIds: string[];
}

export interface XingceAttempt {
  setId: string;
  answers: Record<string, number>;
  submittedAt?: string;
}

export const XINGCE_MODULE_LABELS: Record<XingceModuleId | 'mixed', string> = {
  ziliao: '资料分析',
  panduan: '判断推理',
  yanyu: '言语理解',
  changshi: '常识判断',
  shuliang: '数量关系',
  mixed: '混合练习',
};

export type ShenlunQuestionType = 'guina' | 'fenxi' | 'duice' | 'guanche' | 'zuowen';

export interface ShenlunMaterial {
  id: string;
  title: string;
  body: string;
}

export interface ShenlunQuestion {
  id: string;
  index: number;
  type: ShenlunQuestionType;
  prompt: string;
  score: number;
  wordLimit: string;
  reference: string;
}

export interface ShenlunPaper {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  /** 命题风格标签，不是某省真题 */
  style: string;
  durationMin: number;
  totalScore: number;
  materials: ShenlunMaterial[];
  questions: ShenlunQuestion[];
}

export interface ExamAttempt {
  paperId: string;
  answers: Record<string, string>;
  startedAt: string;
  submittedAt?: string;
  selfScore?: number;
}

export const QUESTION_TYPE_LABELS: Record<ShenlunQuestionType, string> = {
  guina: '归纳概括',
  fenxi: '综合分析',
  duice: '提出对策',
  guanche: '贯彻执行',
  zuowen: '申发论述',
};

export const TARGET_TOTAL = 160;
export const TARGET_XINGCE = 85;
export const TARGET_SHENLUN = 75;

/** 在职备考计划参数 */
export const PLAN_MONTHS = 3;
export const PLAN_DAYS = 90;
export const PLAN_WEEKS = 12;
export const DAILY_HOURS = 2;
export const TOTAL_TARGET_HOURS = PLAN_DAYS * DAILY_HOURS; // 180h

export const MATERIAL_CATEGORY_LABELS: Record<MaterialCategory, string> = {
  jinju: '申论金句',
  anli: '典型案例',
  chengyu: '高频成语',
  zhengce: '政策热词',
};

export const NOTEBOOK_KIND_LABELS: Record<NotebookKind, string> = {
  jinju: '金句',
  anli: '案例',
  chengyu: '成语',
  zhengce: '热词',
  other: '其他',
};
