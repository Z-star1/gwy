export interface ReadingLink {
  id: string;
  name: string;
  url: string;
  blurb: string;
  tags: string[];
}

/** 日常积累用的权威来源（外链，手机浏览器直接打开） */
export const READING_LINKS: ReadingLink[] = [
  {
    id: 'rmrb',
    name: '人民日报',
    url: 'https://www.people.com.cn/',
    blurb: '头版评论、任仲平文章，大作文金句与时政表述首选。',
    tags: ['评论', '金句', '时政'],
  },
  {
    id: 'rmrb-opinion',
    name: '人民网·观点频道',
    url: 'https://opinion.people.com.cn/',
    blurb: '短评论、热点评，练综合分析和短评语气。',
    tags: ['评论', '综合分析'],
  },
  {
    id: 'rmrb-theory',
    name: '人民网·理论频道',
    url: 'https://theory.people.com.cn/',
    blurb: '理论阐释、学习问答，适合提炼总论点表述。',
    tags: ['理论', '作文'],
  },
  {
    id: 'qiushi',
    name: '求是网',
    url: 'https://www.qstheory.cn/',
    blurb: '权威理论文章，政策热词与规范表述密度高。',
    tags: ['理论', '热词'],
  },
  {
    id: 'xinhua',
    name: '新华网',
    url: 'https://www.news.cn/',
    blurb: '要闻与时政通稿，跟进一周重大部署。',
    tags: ['时政', '要闻'],
  },
  {
    id: 'xinhua-commentary',
    name: '新华网·网评',
    url: 'https://www.news.cn/comments/',
    blurb: '网评短文，学开门见山、一事一评。',
    tags: ['短评', '网评'],
  },
  {
    id: 'gmw',
    name: '光明网·评论',
    url: 'https://guancha.gmw.cn/',
    blurb: '文化教育科技类评论较多，素材面更宽。',
    tags: ['评论', '文化'],
  },
  {
    id: 'cctv-news',
    name: '央视新闻',
    url: 'https://news.cctv.com/',
    blurb: '联播体要闻，抓一天的主旋律事件。',
    tags: ['要闻', '时政'],
  },
  {
    id: 'gov-cn',
    name: '中国政府网',
    url: 'https://www.gov.cn/',
    blurb: '政策原文、国务院文件，对策题表述可直接对齐。',
    tags: ['政策', '对策'],
  },
  {
    id: 'gov-policy',
    name: '中国政府网·政策',
    url: 'https://www.gov.cn/zhengce/',
    blurb: '最新政策解读入口，积累「文件原词」。',
    tags: ['政策', '热词'],
  },
  {
    id: 'moj',
    name: '司法部',
    url: 'https://www.moj.gov.cn/',
    blurb: '行政执法、法治政府相关政策与案例线索。',
    tags: ['行政执法', '法治'],
  },
  {
    id: 'samr',
    name: '市场监管总局',
    url: 'https://www.samr.gov.cn/',
    blurb: '免罚清单、监管执法动态，执法向申论常用。',
    tags: ['行政执法', '市场监管'],
  },
  {
    id: 'legaldaily',
    name: '法治日报',
    url: 'https://www.legaldaily.com.cn/',
    blurb: '法治案例与评论，程序正义、过罚相当类素材。',
    tags: ['法治', '案例'],
  },
  {
    id: 'learning-power',
    name: '学习强国',
    url: 'https://www.xuexi.cn/',
    blurb: '碎片时间听看时政，通勤积累表述。',
    tags: ['时政', '碎片'],
  },
];
