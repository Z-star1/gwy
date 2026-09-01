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
  { phase: 1, name: '基础阶段', weeks: '1-4周', focus: '系统学习各模块知识点，建立知识框架' },
  { phase: 2, name: '强化阶段', weeks: '5-8周', focus: '分模块刷题，总结错题，提升速度和正确率' },
  { phase: 3, name: '冲刺阶段', weeks: '9-12周', focus: '全真模考，查漏补缺，调整答题策略' },
];
