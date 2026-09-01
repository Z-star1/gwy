import type { ExamModule } from '../types';

export const XINGCE_MODULES: ExamModule[] = [
  {
    id: 'changshi',
    name: '常识判断',
    description: '政治、法律、经济、科技、人文、地理等',
    maxScore: 20,
    targetScore: 14,
    questionCount: '约20题',
    subTopics: [
      { id: 'cs-zhengzhi', name: '政治常识', tips: ['每日刷时政热点', '重点记忆二十大报告要点', '关注近一年重大政策'] },
      { id: 'cs-falv', name: '法律常识', tips: ['宪法、行政法、民法典核心条款', '新修订法律重点关注', '用案例理解法条'] },
      { id: 'cs-keji', name: '科技人文', tips: ['中国古代史脉络梳理', '近现代科技成就', '文学常识高频考点'] },
    ],
  },
  {
    id: 'yanyu',
    name: '言语理解与表达',
    description: '逻辑填空、片段阅读、语句表达',
    maxScore: 40,
    targetScore: 36,
    questionCount: '约40题',
    subTopics: [
      { id: 'yy-luoji', name: '逻辑填空', tips: ['积累高频成语辨析', '关注关联词和语境', '语感+逻辑双管齐下'] },
      { id: 'yy-pianduan', name: '片段阅读', tips: ['主旨题抓关键句', '细节题逐项比对', '控制单题45秒内'] },
      { id: 'yy-yuju', name: '语句表达', tips: ['排序题找首句和关联', '填空题看话题一致性', '多读人民日报评论'] },
    ],
  },
  {
    id: 'shuliang',
    name: '数量关系',
    description: '数学运算，难度较高，需策略取舍',
    maxScore: 15,
    targetScore: 9,
    questionCount: '约10-15题',
    subTopics: [
      { id: 'sl-jichu', name: '基础题型', tips: ['工程问题、行程问题模板化', '排列组合掌握常用公式', '优先做简单题'] },
      { id: 'sl-texing', name: '特性题型', tips: ['数字特性、代入排除', '比例法、赋值法', '难题果断放弃不纠结'] },
    ],
  },
  {
    id: 'panduan',
    name: '判断推理',
    description: '图形、定义、类比、逻辑判断',
    maxScore: 35,
    targetScore: 32,
    questionCount: '约35题',
    subTopics: [
      { id: 'pd-tuxing', name: '图形推理', tips: ['位置、样式、数量、属性四大规律', '对称性、一笔画高频', '每天练10题保持手感'] },
      { id: 'pd-dingyi', name: '定义判断', tips: ['抓关键词逐一匹配', '注意"不属于"类陷阱', '速度优先'] },
      { id: 'pd-leibi', name: '类比推理', tips: ['词项关系：并列、包容、对应', '二级辨析是拉分点', '此题型应全对'] },
      { id: 'pd-luoji', name: '逻辑判断', tips: ['加强削弱是重点', '翻译推理记公式', '分析推理用排除法'] },
    ],
  },
  {
    id: 'ziliao',
    name: '资料分析',
    description: '性价比最高，必须拿高分',
    maxScore: 20,
    targetScore: 19,
    questionCount: '约20题',
    subTopics: [
      { id: 'zl-jisuan', name: '速算技巧', tips: ['截位直除、特征数字法', '百化分必须熟练', '估算优于精算'] },
      { id: 'zl-tixing', name: '常见题型', tips: ['增长率、比重、平均数', '综合分析放最后做', '目标正确率95%+'] },
    ],
  },
];

export const SHENLUN_MODULES: ExamModule[] = [
  {
    id: 'guina',
    name: '归纳概括',
    description: '提炼材料要点，分条作答',
    maxScore: 20,
    targetScore: 15,
    questionCount: '1-2题',
    subTopics: [
      { id: 'gn-yaodian', name: '要点提炼', tips: ['全面：不遗漏关键信息', '准确：用材料原词', '简洁：一条一个要点'] },
      { id: 'gn-geju', name: '作答规范', tips: ['总分结构', '序号清晰', '控制字数'] },
    ],
  },
  {
    id: 'zonghe',
    name: '综合分析',
    description: '解释型、评价型、启示型分析',
    maxScore: 20,
    targetScore: 14,
    questionCount: '1题',
    subTopics: [
      { id: 'zh-jieshi', name: '解释型', tips: ['是什么→为什么→怎么办', '结合材料逐层分析', '观点要明确'] },
      { id: 'zh-pingjia', name: '评价型', tips: ['亮明观点', '正反论证', '联系实际'] },
    ],
  },
  {
    id: 'duice',
    name: '提出对策',
    description: '针对问题提出可行性建议',
    maxScore: 20,
    targetScore: 14,
    questionCount: '1题',
    subTopics: [
      { id: 'dc-faxian', name: '问题定位', tips: ['从材料中找问题', '对策与问题一一对应', '避免空泛套话'] },
      { id: 'dc-luoshi', name: '对策落地', tips: ['主体+手段+目的', '参考政府工作报告中表述', '注重可操作性'] },
    ],
  },
  {
    id: 'guanzhu',
    name: '贯彻执行',
    description: '应用文写作：通知、报告、倡议书等',
    maxScore: 20,
    targetScore: 14,
    questionCount: '1题',
    subTopics: [
      { id: 'gz-geshi', name: '格式规范', tips: ['掌握常见公文格式', '标题、称谓、落款', '不同文种格式不同'] },
      { id: 'gz-neirong', name: '内容要点', tips: ['背景+目的+措施+号召', '语言符合文种特点', '字数严格控制'] },
    ],
  },
  {
    id: 'lunshu',
    name: '申发论述',
    description: '大作文，分值最高',
    maxScore: 40,
    targetScore: 28,
    questionCount: '1题',
    subTopics: [
      { id: 'ls-lilun', name: '立意与结构', tips: ['从材料中提炼总论点', '五段三分式最稳妥', '分论点要有层次'] },
      { id: 'ls-sucai', name: '素材积累', tips: ['习近平重要讲话', '政府工作报告金句', '典型案例：脱贫攻坚、科技创新'] },
      { id: 'ls-biaoda', name: '语言表达', tips: ['开头结尾要精彩', '论证用例证+理证', '字迹工整'] },
    ],
  },
];

export const STUDY_PHASES = [
  {
    phase: 1,
    name: '基础阶段',
    weeks: '第 1-4 周',
    hours: '48h',
    focus: '系统过一遍行测五大模块 + 申论五种题型，不求快，求理解',
    daily: '行测 1h 听课/看讲义 + 申论 1h 读材料学方法',
  },
  {
    phase: 2,
    name: '强化阶段',
    weeks: '第 5-8 周',
    hours: '56h',
    focus: '分模块刷题提速，建立错题本，申论开始限时练小题',
    daily: '行测刷题 1h + 申论小题/素材 1h，周末加练',
  },
  {
    phase: 3,
    name: '冲刺阶段',
    weeks: '第 9-12 周',
    hours: '76h',
    focus: '每周 1 套全真模考，查漏补缺，固化答题顺序和时间分配',
    daily: '平日复盘 2h，周末模考 2h + 申论批改',
  },
];

/** 工作日每日 2 小时安排（周一至周五） */
export const WEEKDAY_SCHEDULE = [
  { day: '周一', xingce: '资料分析刷题 20 题 + 速算练习', shenlun: '归纳概括 1 道（限时 15 分钟）', tip: '资料分析是提分关键，先练手感' },
  { day: '周二', xingce: '判断推理 30 题（图形+类比+定义）', shenlun: '精读人民日报评论 1 篇，摘抄金句', tip: '类比和定义题争取全对' },
  { day: '周三', xingce: '言语理解 30 题 + 成语积累', shenlun: '综合分析 1 道（限时 20 分钟）', tip: '言语靠积累，错题记成语辨析' },
  { day: '周四', xingce: '资料分析 20 题（限时 25 分钟）', shenlun: '提出对策 1 道（限时 15 分钟）', tip: '资料分析限时训练，培养考场节奏' },
  { day: '周五', xingce: '数量关系 10 题 + 常识 20 题', shenlun: '贯彻执行 1 道 + 回顾本周错题', tip: '数量只做简单题，常识利用碎片时间' },
];

/** 周末安排（同样 2h/天，内容不同） */
export const WEEKEND_SCHEDULE = [
  { day: '周六', focus: '行测专项', content: '行测薄弱模块集中突破 1.5h + 错题整理 0.5h', tip: '针对本周错题最多的模块加练' },
  { day: '周日', focus: '申论主攻', content: '申论小题 2 道 1h + 大作文列提纲或练开头 1h', tip: '在职党周日务必练申论，工作日很难写完整作文' },
];

/** 12 周详细周计划 */
export const WEEKLY_PLAN = [
  { week: 1, theme: '认识考试', xingce: '了解行测结构，资料分析入门（速算技巧）', shenlun: '申论考什么？归纳概括方法学习' },
  { week: 2, theme: '判断+言语', xingce: '判断推理四大题型入门，言语主旨题方法', shenlun: '综合分析题型讲解 + 练 2 道' },
  { week: 3, theme: '数量+常识', xingce: '数量关系六大题型（只做简单题），常识法律政治', shenlun: '提出对策 + 贯彻执行格式学习' },
  { week: 4, theme: '基础小结', xingce: '行测分模块小测，找薄弱项', shenlun: '大作文五段三分式 + 列 1 篇提纲' },
  { week: 5, theme: '资料强化', xingce: '资料分析每天 20 题，速算提速', shenlun: '小题限时训练，每天 1 道' },
  { week: 6, theme: '判断强化', xingce: '判断推理每天 30 题，图形推理专项', shenlun: '素材积累周：每天摘抄 3 条金句' },
  { week: 7, theme: '言语强化', xingce: '言语每天 30 题，逻辑填空成语本', shenlun: '大作文完整写 1 篇（周末）' },
  { week: 8, theme: '强化小结', xingce: '行测限时模考 1 套（只做行测部分）', shenlun: '申论小题全套限时练' },
  { week: 9, theme: '模考周 1', xingce: '周六全真模考行测', shenlun: '周日全真模考申论 + 对照答案' },
  { week: 10, theme: '模考周 2', xingce: '第二套全真模考 + 错题深度复盘', shenlun: '大作文重写 1 篇（针对模考薄弱环节）' },
  { week: 11, theme: '模考周 3', xingce: '第三套全真模考，调整做题顺序', shenlun: '申论小题速度训练（每题 10 分钟内）' },
  { week: 12, theme: '考前冲刺', xingce: '保持手感：每天 30 题维持状态', shenlun: '回顾素材本 + 默写大作文框架' },
];

/** 在职备考专属建议 */
export const WORKING_TIPS = [
  { title: '通勤碎片时间', content: '听时政音频、刷常识题 APP、回顾错题本（每天额外 30 分钟）' },
  { title: '午休 20 分钟', content: '看一篇人民日报评论或背 5 个成语辨析' },
  { title: '保证睡眠', content: '在职党切忌熬夜，每天 2 小时高效学习 > 4 小时低效耗时间' },
  { title: '周末是主战场', content: '工作日保持手感，周末集中模考和写申论大作文' },
  { title: '请假策略', content: '考前 1 周如有年假，建议请 2-3 天做最后冲刺模考' },
];

/** 180 小时时间分配 */
export const HOUR_ALLOCATION = [
  { module: '资料分析', hours: 36, percent: 20 },
  { module: '判断推理', hours: 32, percent: 18 },
  { module: '言语理解', hours: 28, percent: 16 },
  { module: '申论小题', hours: 40, percent: 22 },
  { module: '申论大作文', hours: 24, percent: 13 },
  { module: '常识判断', hours: 12, percent: 7 },
  { module: '数量关系', hours: 8, percent: 4 },
];
