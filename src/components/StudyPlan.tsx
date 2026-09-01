import { STUDY_PHASES } from '../data/examData';

export function StudyPlan() {
  return (
    <section className="plan-section">
      <h2>📅 备考规划（12周）</h2>
      <div className="phase-timeline">
        {STUDY_PHASES.map((p) => (
          <div key={p.phase} className="phase-card">
            <div className="phase-num">第 {p.phase} 阶段</div>
            <h3>{p.name}</h3>
            <span className="phase-weeks">{p.weeks}</span>
            <p>{p.focus}</p>
          </div>
        ))}
      </div>

      <div className="strategy-cards">
        <div className="strategy-card">
          <h3>行测策略</h3>
          <ul>
            <li><strong>资料分析</strong>：优先做，目标正确率 95%+，是提分最快模块</li>
            <li><strong>判断推理</strong>：题量大，类比和定义要全对</li>
            <li><strong>言语理解</strong>：靠积累，每天精读一篇人民日报评论</li>
            <li><strong>常识判断</strong>：广而不深，利用碎片时间</li>
            <li><strong>数量关系</strong>：战略性放弃难题，简单题必拿</li>
          </ul>
        </div>
        <div className="strategy-card">
          <h3>申论策略</h3>
          <ul>
            <li><strong>小题</strong>：答案来源于材料，不要脱离材料发挥</li>
            <li><strong>大作文</strong>：立意准确 &gt; 文采华丽，结构清晰最重要</li>
            <li><strong>字迹</strong>：工整卷面直接加分，练字每天 15 分钟</li>
            <li><strong>素材</strong>：每周积累 3 个典型案例 + 5 条金句</li>
            <li><strong>模考</strong>：严格限时，小题 10 分钟/题，作文 50 分钟</li>
          </ul>
        </div>
        <div className="strategy-card">
          <h3>160 分拆解</h3>
          <table className="score-table">
            <thead>
              <tr><th>模块</th><th>目标</th><th>策略</th></tr>
            </thead>
            <tbody>
              <tr><td>资料分析</td><td>19/20</td><td>必拿模块，多练速算</td></tr>
              <tr><td>判断推理</td><td>32/35</td><td>类比定义全对</td></tr>
              <tr><td>言语理解</td><td>36/40</td><td>主旨题不丢分</td></tr>
              <tr><td>常识判断</td><td>14/20</td><td>时政+法律重点</td></tr>
              <tr><td>数量关系</td><td>9/15</td><td>简单题必做</td></tr>
              <tr><td>申论小题</td><td>57/80</td><td>要点全面、格式规范</td></tr>
              <tr><td>申论大作文</td><td>28/40</td><td>立意+结构+素材</td></tr>
              <tr className="total-row"><td><strong>合计</strong></td><td><strong>160/200</strong></td><td></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
