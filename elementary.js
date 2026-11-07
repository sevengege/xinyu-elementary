(function () {
  const ACADEMIC = {
    chinese: [0, 1, 2, 3, 4],
    math: [10, 11, 12, 13, 14],
    english: [5, 6, 7, 8, 9]
  };
  const METHODS = [15, 16, 17, 18, 19, 20, 21];
  const TOOLS = [22, 23, 24, 25];
  const ALLOWED = [...ACADEMIC.chinese, ...ACADEMIC.math, ...ACADEMIC.english, ...METHODS, ...TOOLS];
  const PROFILE_KEY = 'xy_elementary_profile';
  const PAGE_KEY = 'xy_elementary_page';
  let currentPage = 'today';
  let currentSubject = 'math';
  let toastTimer = null;

  const safeReplace = value => typeof value === 'string' ? value.replace(/小智/g, '心语伴学') : value;
  MODES.forEach(mode => {
    mode.subtitle = safeReplace(mode.subtitle);
    mode.placeholder = safeReplace(mode.placeholder);
    mode.quickBtns = mode.quickBtns.map(safeReplace);
  });
  for (let i = 0; i < 27; i++) SYS_PROMPTS[i] = safeReplace(SYS_PROMPTS[i]);

  if (!ALLOWED.includes(currentMode)) currentMode = 14;

  document.body.className = 'elementary-app';
  document.body.innerHTML = `
    <div class="xy-shell">
      <aside class="xy-rail" aria-label="主导航">
        <div class="xy-rail-logo" aria-label="心语伴学">✨</div>
        <nav class="xy-rail-nav">
          ${navButton('today', 'home', '今天')}
          ${navButton('islands', 'explore', '学习岛')}
          ${navButton('ai', 'smart_toy', '问心语')}
          ${navButton('profile', 'spa', '我的')}
        </nav>
        <div class="xy-rail-spacer"></div>
        <button class="xy-rail-settings" onclick="toggleSettings()" aria-label="设置与家长守护"><span class="material-symbols-outlined">settings</span></button>
      </aside>

      <section class="xy-app">
        <header class="xy-header">
          <div class="xy-brand"><span class="xy-brand-star">✦</span><span>心语伴学</span><span class="xy-grade" data-profile-grade>三年级</span></div>
          <div class="xy-header-actions">
            <button class="xy-icon-button" onclick="xyOpenGuardian()" aria-label="家长守护"><span class="material-symbols-outlined">family_restroom</span></button>
            <button class="xy-avatar" onclick="xyNavigate('profile')" aria-label="进入我的成长屋">😊</button>
          </div>
        </header>

        <main class="xy-pages">
          <section class="xy-page active" id="page-today" aria-label="今天">
            <div class="xy-page-wrap">
              <div class="xy-profile-row">
                <div class="xy-student"><div class="xy-student-face">🧒</div><div><div class="xy-student-name"><span data-profile-name>乐乐</span> <span class="xy-grade" data-profile-class>三年级一班</span></div><div class="xy-student-meta" id="today-date"></div></div></div>
                <div class="xy-growing"><span class="material-symbols-outlined">light_mode</span><span>生长中</span></div>
              </div>
              <div class="xy-card xy-greeting"><span class="material-symbols-outlined">smart_toy</span><p>早上好，<span data-profile-name>乐乐</span>！今天先完成一个小目标吧，心语伴学陪着你。🌱</p></div>

              <div class="xy-today-grid">
                <article class="xy-card xy-task-card">
                  <div class="xy-task-tags"><span class="xy-tag">⏱ 预计10分钟</span><span class="xy-tag blue">数学 · 巧解应用题</span></div>
                  <h2>用 10 分钟找出这道应用题的线索</h2>
                  <div class="xy-reason"><span class="material-symbols-outlined">lightbulb</span><span>这是你最近练习中值得巩固的知识点，今天一起弄懂它！</span></div>
                  <div class="xy-story-scene" aria-label="森林数学探险插画"><span>🐿️</span><span>🔎</span><span>🦡</span></div>
                  <button class="xy-primary full" onclick="xyStartToday()"><span class="material-symbols-outlined">play_circle</span>开始今天的任务</button>
                </article>

                <div class="xy-today-side">
                  <div class="xy-quick-grid">
                    <button class="xy-quick" onclick="xyQuickAction('photo')"><span class="material-symbols-outlined">photo_camera</span><span>拍一道题<br>伴学点拨</span></button>
                    <button class="xy-quick" onclick="xyQuickAction('ask')"><span class="material-symbols-outlined">chat_bubble</span><span>问心语伴学<br>随时轻声问</span></button>
                    <button class="xy-quick" onclick="xyQuickAction('review')"><span class="material-symbols-outlined">inventory_2</span><span>复习错题<br>巩固宝盒</span></button>
                  </div>
                  <article class="xy-card xy-continue">
                    <div class="xy-continue-top"><div><h3 id="continue-title">继续：数学 · 应用题建模</h3><p id="continue-meta">上次停留在：找出数量关系</p></div><span style="color:#07804d;font-size:12px;font-weight:800">● 已保存</span></div>
                    <div class="xy-progress"><span></span></div>
                    <div style="display:flex;justify-content:space-between;align-items:center"><small style="color:var(--xy-muted)">预计剩余 4 分钟</small><button class="xy-link" onclick="xyContinueLearning()">继续学习 →</button></div>
                  </article>
                </div>
              </div>

              <div class="xy-section-title"><h2><span class="material-symbols-outlined" style="color:#087b4a">forest</span>本周成长岛屿</h2><small>给小树苗浇浇水</small></div>
              <article class="xy-card xy-growth-map">
                <p class="xy-growth-copy">这周小树苗正在蓬勃生长，每一步都有金色星光陪伴！</p>
                <div class="xy-milestones">
                  <div class="xy-milestone done"><div class="xy-node"><span class="material-symbols-outlined">check</span></div>周一<br>语文生字</div>
                  <div class="xy-milestone done"><div class="xy-node"><span class="material-symbols-outlined">check</span></div>周二<br>周长小探</div>
                  <div class="xy-milestone done"><div class="xy-node"><span class="material-symbols-outlined">check</span></div>周三<br>自然拼读</div>
                  <div class="xy-milestone today"><div class="xy-node"><span class="material-symbols-outlined">eco</span></div>今天<br>应用题线索</div>
                  <div class="xy-milestone"><div class="xy-node"><span class="material-symbols-outlined">lock</span></div>周五<br>科学小实验</div>
                </div>
                <div class="xy-learned"><span class="material-symbols-outlined">potted_plant</span><div><strong>银杏小树苗：第 4 片绿叶正在萌芽</strong><div style="font-size:13px;color:var(--xy-muted);margin-top:4px">不用和任何人比赛，按自己的节奏走就好！</div></div></div>
              </article>

              <div class="xy-section-title"><h2><span class="material-symbols-outlined" style="color:#a56700">emoji_objects</span>今天学会了什么</h2></div>
              <article class="xy-card xy-learned"><span class="material-symbols-outlined">psychology</span><div><strong>“画线段图”找倍数线索的秘诀</strong><div style="font-size:13px;color:var(--xy-muted);line-height:1.7;margin-top:4px">先画一份的线段图，再画多倍的长线段。两张图一摆，隐藏的关系就跳出来啦！</div></div></article>
            </div>
          </section>

          <section class="xy-page" id="page-islands" aria-label="学习岛">
            <div class="xy-page-wrap">
              <div class="xy-eyebrow"><span class="material-symbols-outlined">explore</span>探索与成长</div>
              <h1 class="xy-page-title">欢迎来到学习岛！</h1>
              <p class="xy-page-sub">今天想解决哪方面的疑问？和心语伴学一起点亮新知识吧。</p>
              <div class="xy-section-title"><h2>探索岛屿 <span class="xy-grade">3 座已知岛屿</span></h2><small>轻触卡片选择学科</small></div>
              <div class="xy-island-grid">
                ${islandCard('chinese','menu_book','语文岛','汉字与阅读探索','古诗词意境理解与词语积淀','#087c50','#75e7a8','#dff7e9','去读《望天门山》')}
                ${islandCard('math','calculate','数学岛','逻辑与数学乐园','多位数乘除法与应用题建模','#9a6500','#ffd995','#fff0d2','解一道倍数应用题')}
                ${islandCard('english','record_voice_over','英语岛','自然拼读与表达天地','常用场景生活口语自信开口','#176cad','#cfe4ff','#e1efff','跟读 3 句情景对话')}
              </div>
              <section class="xy-intents">
                <h2>告诉心语伴学你的真实需求</h2><p id="intent-subtitle">已选择数学岛，心语伴学会自动找到最合适的方法。</p>
                <div class="xy-intent-list">
                  ${intentButton(0,'document_scanner','我有一道不会的题','拍题或读题，心语伴学分步启发')}
                  ${intentButton(1,'account_tree','我想弄懂一个概念','用生活类比和图示讲明白')}
                  ${intentButton(2,'manage_search','我要复习以前做错的题','找出错因，再做一题巩固')}
                  ${intentButton(3,'edit_note','我要练表达或写作','讲故事、口语或作文练习')}
                  ${intentButton(4,'sports_score','我要准备一次小测验','5 题趣味闯关检验掌握')}
                </div>
              </section>
              <div class="xy-backpack"><span class="material-symbols-outlined">backpack</span><div><strong>背包里的成长工具已就绪</strong><div style="font-size:12px;color:var(--xy-muted);margin-top:3px">讲给心语伴学听 · 三栏笔记卡 · 错题小侦探，都放在“我的”里。</div></div></div>
            </div>
          </section>

          <section class="xy-page" id="page-ai" aria-label="问心语伴学">
            <div class="xy-ai-layout">
              <aside class="xy-ai-modes" id="mode-list" aria-label="学习能力选择"></aside>
              <section class="xy-ai-workspace">
                <div class="xy-ai-toolbar">
                  <div class="xy-ai-title"><div class="xy-ai-title-icon" id="active-mode-icon">📝</div><div><strong id="active-mode-name">应用题建模教练</strong><small id="active-mode-subtitle"></small></div></div>
                  <div class="xy-toolbar-btns">
                    <button class="xy-toolbar-btn" onclick="xyOpenModePicker()"><span class="material-symbols-outlined">apps</span><span class="xy-label">选择能力</span></button>
                    <button class="xy-toolbar-btn" onclick="newChat()"><span class="material-symbols-outlined">add</span><span class="xy-label">新对话</span></button>
                    <button class="xy-toolbar-btn" onclick="toggleSettings()"><span class="material-symbols-outlined">tune</span><span class="xy-label">设置</span></button>
                  </div>
                </div>
                <div class="xy-chat-area" id="chatArea"></div>
                <div class="xy-input-area">
                  <div class="xy-input-wrap">
                    <div class="img-preview-container" id="imgPreviewContainer"></div>
                    <div class="xy-input-row">
                      <input type="file" id="imgInput" accept="image/*" capture="environment" hidden onchange="handleImageSelect(event)">
                      <button class="xy-upload" onclick="document.getElementById('imgInput').click()" aria-label="拍照或上传图片"><span class="material-symbols-outlined">photo_camera</span></button>
                      <button class="xy-upload" onclick="xyStartVoice()" aria-label="语音输入"><span class="material-symbols-outlined">mic</span></button>
                      <textarea class="xy-input" id="inputBox" rows="1" placeholder="把问题告诉心语伴学..."></textarea>
                      <button class="xy-send" id="sendBtn" onclick="sendMessage()" aria-label="发送"><span class="material-symbols-outlined">send</span></button>
                    </div>
                  </div>
                  <div class="xy-input-hint">心语伴学会先听你怎么想，再一步一步陪你找到答案</div>
                </div>
              </section>
            </div>
          </section>

          <section class="xy-page" id="page-profile" aria-label="我的成长屋">
            <div class="xy-page-wrap">
              <div class="xy-profile-hero"><div class="xy-tree-title"><div class="xy-tree-avatar">🌳</div><div><h1><span data-profile-name>乐乐</span>的成长树屋</h1><p>每一次好奇和坚持，都在让你的小树长高。</p></div></div><button class="xy-link" onclick="toggleSettings()">编辑资料</button></div>
              <div class="xy-profile-grid">
                <div>
                  <section class="xy-card xy-panel"><h2>我的成长</h2><div class="xy-stat-grid"><div class="xy-stat"><span class="material-symbols-outlined">task_alt</span><strong id="stat-tasks">0</strong><small>这周小任务</small></div><div class="xy-stat"><span class="material-symbols-outlined">chat</span><strong id="stat-asks">0</strong><small>向心语提问</small></div><div class="xy-stat"><span class="material-symbols-outlined">inventory_2</span><strong id="stat-modes">0</strong><small>温故小复习</small></div></div><div class="xy-insights"><div class="xy-insight"><span class="material-symbols-outlined">verified</span><div><strong>你较擅长主动抓住关键词</strong><small>这周在阅读和应用题里都有发现</small></div></div><div class="xy-insight"><span class="material-symbols-outlined" style="background:#e3eaff;color:#315f9a">auto_stories</span><div><strong>正在长大的小能力</strong><small>把想法说完整，再用图示表达</small></div></div></div><div class="xy-growth-card"><div class="xy-growth-card-top"><strong>正在变亮的小堡垒</strong><span class="xy-tag">已掌握 80%</span></div><p>正在攻克：长除法竖式进位。允许自己多试两步，很快就能稳稳拿下！</p><div class="xy-progress"><span></span></div></div></section>
                  <section class="xy-tool-section"><div class="xy-tool-section-head"><h2>我的好方法宝库</h2><small>7 种学习方法</small></div><div class="xy-tool-list" id="method-tools"></div></section>
                </div>
                <div>
                  <section class="xy-card xy-panel"><h2>我的成长作品集</h2><div class="xy-insights"><div class="xy-insight"><span class="material-symbols-outlined" style="background:#ffeed0;color:#9b6500">photo_library</span><div><strong>线段图秘籍</strong><small>数学 · 手绘</small></div></div><div class="xy-insight"><span class="material-symbols-outlined" style="background:#dff0ff;color:#176cad">mic</span><div><strong>讲给心语伴学听</strong><small>语文 · 讲解录音</small></div></div><div class="xy-insight"><span class="material-symbols-outlined" style="background:#e4faeb;color:#0c7950">edit</span><div><strong>秋日森林作文</strong><small>语文 · 写作</small></div></div></div></section>
                  <section class="xy-tool-section"><div class="xy-tool-section-head"><h2>探索与贴心提醒</h2><small>4 项成长工具</small></div><div id="system-tools"></div></section>
                  <section class="xy-guardian"><div class="xy-guardian-top"><h3>家长守护中心</h3><span class="xy-grade">PIN 码验证</span></div><p>可由家长自主配置守护选项，陪伴孩子健康平衡成长。</p><div class="xy-guardian-actions"><button onclick="xyGuardianTip('使用时长')">⏳ 每日使用时长</button><button onclick="xyGuardianTip('周报')">👀 学习周报</button><button onclick="xyGuardianTip('提醒')">🔔 提醒服务</button><button onclick="xyGuardianTip('隐私')">☁️ 个性化与开关</button></div><button class="xy-guardian-main" onclick="xyOpenGuardian()">验证家长身份并进入设置</button></section>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>

    <nav class="xy-mobile-bar" aria-label="移动端主导航">
      ${navButton('today', 'home', '今天')}${navButton('islands', 'explore', '学习岛')}${navButton('ai', 'smart_toy', '问心语')}${navButton('profile', 'spa', '我的')}
    </nav>
    <button type="button" class="xy-mode-backdrop" id="xy-mode-backdrop" onclick="xyCloseModePicker()" aria-label="关闭学习能力选择"></button>

    <div class="modal-overlay" id="settingsModal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div class="modal">
        <h2 id="settings-title"><span class="material-symbols-outlined">family_restroom</span>设置与家长守护</h2>
        <div class="modal-grid"><div><label for="profileName">孩子昵称</label><input id="profileName" value="乐乐"></div><div><label for="gradeSelect">年级</label><select id="gradeSelect">${[1,2,3,4,5,6].map(n=>`<option value="${n}">${toChineseGrade(n)}年级</option>`).join('')}</select></div></div>
        <label for="className">班级（选填）</label><input id="className" value="一班" placeholder="例如：一班">
        <div class="modal-divider"></div>
        <h3 style="font-size:15px;margin:0">AI 服务设置</h3>
        <label for="apiKeyInput">DeepSeek API Key</label><input type="password" id="apiKeyInput" placeholder="sk-...">
        <p style="margin:7px 0 0;color:#7a8495;font-size:11px;line-height:1.6">Key 只保存在当前浏览器中，不会上传到 GitHub 仓库。请勿在公共设备上保存。</p>
        <label for="apiBaseInput">API 地址</label><input type="text" id="apiBaseInput" placeholder="https://api.deepseek.com">
        <div class="modal-grid"><div><label for="modelInput">模型</label><input type="text" id="modelInput" placeholder="deepseek-flash"></div><div><label for="ttsBaseInput">语音服务（选填）</label><input type="text" id="ttsBaseInput" placeholder="http://127.0.0.1:8100"></div></div>
        <div class="modal-actions"><button class="modal-btn secondary" onclick="toggleSettings()">取消</button><button class="modal-btn primary" onclick="saveSettings()">保存设置</button></div>
      </div>
    </div>
    <div class="xy-toast" id="xy-toast" role="status"></div>
  `;

  function navButton(page, icon, label) {
    return `<button class="xy-nav-btn" data-page-link="${page}" onclick="xyNavigate('${page}')"><span class="material-symbols-outlined">${icon}</span><span>${label}</span></button>`;
  }

  function islandCard(key, icon, name, badge, desc, color, bg, soft, next) {
    return `<article class="xy-card xy-island ${key === 'math' ? 'selected' : ''}" data-island="${key}" style="--island-color:${color};--island-bg:${bg};--island-soft:${soft}" onclick="xySelectIsland('${key}')" tabindex="0" role="button"><div class="xy-island-top"><div class="xy-island-icon"><span class="material-symbols-outlined">${icon}</span></div><button class="xy-island-go" aria-label="进入${name}"><span class="material-symbols-outlined">arrow_forward</span></button></div><h2>${name} <span class="xy-tag" style="background:${soft};color:${color}">${badge}</span></h2><p>${desc}</p><div class="xy-island-next"><span class="material-symbols-outlined" style="font-size:17px">recommend</span>推荐下一步：${next}</div></article>`;
  }

  function intentButton(index, icon, title, copy) {
    return `<button class="xy-intent" onclick="xyOpenIntent(${index})"><span class="xy-intent-icon"><span class="material-symbols-outlined">${icon}</span></span><span><strong>${title}</strong><span>${copy}</span></span><span class="material-symbols-outlined" style="margin-left:auto;color:#9aa4b4">chevron_right</span></button>`;
  }

  function toChineseGrade(value) {
    return ['一','二','三','四','五','六'][Number(value)-1] || '三';
  }

  function getProfile() {
    try {
      return Object.assign({name:'乐乐', grade:3, className:'一班'}, JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'));
    } catch (_) {
      return {name:'乐乐', grade:3, className:'一班'};
    }
  }

  function applyProfile() {
    const profile = getProfile();
    document.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = profile.name);
    document.querySelectorAll('[data-profile-grade]').forEach(el => el.textContent = `${toChineseGrade(profile.grade)}年级`);
    document.querySelectorAll('[data-profile-class]').forEach(el => el.textContent = `${toChineseGrade(profile.grade)}年级${profile.className || ''}`);
    const nameInput = document.getElementById('profileName');
    if (nameInput) nameInput.value = profile.name;
    const gradeSelect = document.getElementById('gradeSelect');
    if (gradeSelect) gradeSelect.value = String(profile.grade);
    const classInput = document.getElementById('className');
    if (classInput) classInput.value = profile.className || '';
  }

  function loadApiSettings() {
    let settings = {};
    try { settings = JSON.parse(localStorage.getItem('yw_setting') || '{}'); } catch (_) {}
    document.getElementById('apiKeyInput').value = settings.apiKey || localStorage.getItem('yw_apiKey') || '';
    document.getElementById('apiBaseInput').value = settings.apiBase || 'https://api.deepseek.com';
    document.getElementById('modelInput').value = settings.model || 'deepseek-flash';
    document.getElementById('ttsBaseInput').value = settings.ttsBase || localStorage.getItem('yw_ttsBase') || '';
  }

  function modeGroup(title, indices) {
    return `<div class="xy-mode-group"><div class="xy-mode-group-title">${title}</div>${indices.map(i => `<button class="xy-mode-button ${i === currentMode ? 'active' : ''}" data-mode-idx="${i}" onclick="xySelectMode(${i})"><span class="xy-mode-emoji">${MODES[i].emoji}</span><span>${MODES[i].name}</span></button>`).join('')}</div>`;
  }

  function renderModeList() {
    const list = document.getElementById('mode-list');
    if (!list) return;
    const extra = [...METHODS, ...TOOLS].includes(currentMode) ? modeGroup('从“我的”打开', [currentMode]) : '';
    list.innerHTML = `<div class="xy-ai-modes-head"><div class="xy-ai-modes-copy"><h2>选择学习能力</h2><p>语文、数学、英语能力均可切换</p></div><button class="xy-mode-close" onclick="xyCloseModePicker()" aria-label="关闭能力菜单"><span class="material-symbols-outlined">close</span></button></div>${extra}${modeGroup('语文岛',ACADEMIC.chinese)}${modeGroup('数学岛',ACADEMIC.math)}${modeGroup('英语岛',ACADEMIC.english)}`;
  }

  function renderTools() {
    const methodMeta = [
      [15,'view_agenda','三栏魔法笔记','把课堂重点变成清楚的三栏卡','#1473ad','#dfeeff'],
      [16,'record_voice_over','讲给心语伴学听','用自己的话讲明白才是真的会','#9a6500','#ffeed0'],
      [17,'manage_search','错题小侦探','找到错因，再安排一次小复习','#2872ad','#e0efff'],
      [18,'fingerprint','我的学习画像','看见自己的优势和成长变化','#286d68','#dff7ee'],
      [19,'monitoring','一周小结','回顾本周收获和下一件小事','#734c9a','#eee4ff'],
      [20,'calendar_month','30天成长计划','只看今天和本周，不被长计划压住','#9a5c24','#fff0df'],
      [21,'timer','专注小树','专注计时、休息和节奏记录','#08784b','#def8e9']
    ];
    document.getElementById('method-tools').innerHTML = methodMeta.map(toolButton).join('');
    const systemMeta = [
      [22,'travel_explore','主题侦探周','把一个好奇的问题连到多门学科','#176dac','#dfedff'],
      [23,'notifications_active','我的提醒','安排复习和成长计划提醒','#9a6500','#ffeed0'],
      [24,'local_florist','兴趣花园','记录尝试、兴趣和自己的作品','#08784b','#def8e9'],
      [25,'hub','学习管家','连接错题、笔记与复习','#68419a','#eee3ff']
    ];
    document.getElementById('system-tools').innerHTML = systemMeta.map((m, idx) => `<article class="xy-card xy-project"><div class="xy-project-icon" style="background:${m[5]};color:${m[4]}"><span class="material-symbols-outlined">${m[1]}</span></div><div><h3>${m[2]}</h3><p>${m[3]}</p></div><button class="xy-link" onclick="xySelectMode(${m[0]})">打开 →</button></article>`).join('');
  }

  function toolButton(m) {
    return `<button class="xy-tool" onclick="xySelectMode(${m[0]})" style="--tool-color:${m[4]};--tool-bg:${m[5]}"><span class="xy-tool-icon"><span class="material-symbols-outlined">${m[1]}</span></span><span><strong>${m[2]}</strong><small>${m[3]}</small></span><span class="material-symbols-outlined xy-tool-arrow">chevron_right</span></button>`;
  }

  function renderDynamicStats() {
    const used = ALLOWED.filter(i => (conversations[i] || []).length > 0);
    const userMessages = used.reduce((sum, i) => sum + conversations[i].filter(m => m.role === 'user').length, 0);
    const assistantMessages = used.reduce((sum, i) => sum + conversations[i].filter(m => m.role === 'assistant').length, 0);
    const statTasks = document.getElementById('stat-tasks');
    if (statTasks) statTasks.textContent = Math.min(99, assistantMessages);
    const statAsks = document.getElementById('stat-asks');
    if (statAsks) statAsks.textContent = Math.min(99, userMessages);
    const statModes = document.getElementById('stat-modes');
    if (statModes) statModes.textContent = used.length;
    const mode = MODES[currentMode] || MODES[14];
    const continueTitle = document.getElementById('continue-title');
    if (continueTitle) continueTitle.textContent = `继续：${mode.name}`;
    const continueMeta = document.getElementById('continue-meta');
    if (continueMeta) continueMeta.textContent = (conversations[currentMode] || []).length ? `已保存 ${conversations[currentMode].length} 条学习记录` : '从一个小问题开始吧';
  }

  function updateAiHeader() {
    const mode = MODES[currentMode];
    document.getElementById('active-mode-icon').textContent = mode.emoji;
    document.getElementById('active-mode-name').textContent = mode.name;
    document.getElementById('active-mode-subtitle').textContent = mode.subtitle;
    document.getElementById('inputBox').placeholder = mode.placeholder || '把问题告诉心语伴学...';
  }

  function renderElementaryChat() {
    const area = document.getElementById('chatArea');
    if (!area) return;
    const msgs = conversations[currentMode] || [];
    if (msgs.length === 0) {
      const mode = MODES[currentMode];
      area.innerHTML = `<div class="xy-welcome"><div class="xy-welcome-icon">${mode.emoji}</div><h1>${mode.name}</h1><p>${mode.subtitle}</p><div class="xy-quick-prompts">${mode.quickBtns.map(btn => `<button class="xy-quick-prompt" onclick="sendQuick('${escapeForOnclick(btn)}')">${escapeHtml(btn)}</button>`).join('')}</div></div>`;
      return;
    }
    area.innerHTML = msgs.map((msg, idx) => {
      const isUser = msg.role === 'user';
      let content = isUser ? escapeHtml(msg.content || '') : renderMarkdown(msg.content || '');
      if (isUser && msg.images && msg.images.length) content = msg.images.map(url => `<img class="user-img" src="${url}" alt="上传的题目图片">`).join('') + (msg.content ? `<br>${content}` : '');
      return `<div class="msg ${isUser ? 'user' : 'assistant'}"><div class="msg-avatar">${isUser ? '🧒' : '✨'}</div><div><div class="msg-bubble">${content}</div>${isUser ? '' : `<div class="msg-actions"><button class="msg-action-btn" onclick="xyCopyMessage(${idx},this)"><span class="material-symbols-outlined">content_copy</span> 复制</button><button class="tts-play-btn" data-idx="${idx}" onclick="toggleSpeak('${escapeForOnclick(msg.content)}',${idx})"><span class="material-symbols-outlined">volume_up</span> 朗读</button></div>`}</div></div>`;
    }).join('');
    if (msgs[msgs.length - 1]?.role === 'user' && !isStreaming) {
      area.insertAdjacentHTML('beforeend', `<div class="msg assistant"><div class="msg-avatar">↻</div><div><div class="msg-bubble"><strong>上一次追问还没有得到回答</strong><br><span style="color:#68758a;font-size:13px">可以直接重试，心语伴学会使用精简后的最近对话继续。</span><div style="margin-top:10px"><button class="xy-quick-prompt" onclick="xyRetryLastQuestion()">重新发送上一个问题</button></div></div></div></div>`);
    }
    area.scrollTop = area.scrollHeight;
  }

  renderChat = renderElementaryChat;
  renderSidebar = function () {};
  toggleSidebar = function () { window.xyOpenModePicker(); };
  switchMode = function (idx) {
    if (!ALLOWED.includes(Number(idx))) idx = 14;
    currentMode = Number(idx);
    localStorage.setItem('yw_mode', String(currentMode));
    renderModeList();
    updateAiHeader();
    renderChat();
    renderDynamicStats();
  };
  toggleSettings = function () {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.toggle('show');
  };
  saveSettings = function () {
    const settings = getSettings();
    localStorage.setItem('yw_setting', JSON.stringify(settings));
    localStorage.setItem('yw_apiKey', settings.apiKey);
    localStorage.setItem('yw_ttsBase', settings.ttsBase);
    const profile = {
      name: document.getElementById('profileName').value.trim() || '乐乐',
      grade: Number(document.getElementById('gradeSelect').value) || 3,
      className: document.getElementById('className').value.trim()
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    applyProfile();
    toggleSettings();
    window.xyToast('设置已保存');
  };

  window.xyNavigate = function (page) {
    if (!['today','islands','ai','profile'].includes(page)) page = 'today';
    if (page !== 'ai') window.xyCloseModePicker();
    currentPage = page;
    localStorage.setItem(PAGE_KEY, page);
    document.querySelectorAll('.xy-page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
    document.querySelectorAll('[data-page-link]').forEach(el => el.classList.toggle('active', el.dataset.pageLink === page));
    if (page === 'ai') { renderModeList(); updateAiHeader(); renderChat(); }
    if (page === 'profile' || page === 'today') renderDynamicStats();
  };

  window.xySelectMode = function (idx) {
    switchMode(idx);
    window.xyCloseModePicker();
    window.xyNavigate('ai');
  };

  window.xyStartToday = function () {
    switchMode(14);
    window.xyNavigate('ai');
    const input = document.getElementById('inputBox');
    input.value = '我想用线段图学习一道适合小学三年级的倍数应用题，请先出题，再一步一步提示我。';
    input.focus();
    window.xyToast('今日任务已准备好，先说说你的想法吧');
  };

  window.xyContinueLearning = function () {
    if (!ALLOWED.includes(currentMode)) switchMode(14);
    window.xyNavigate('ai');
  };

  window.xyQuickAction = function (type) {
    if (type === 'photo') {
      switchMode(13); window.xyNavigate('ai');
      setTimeout(() => document.getElementById('imgInput').click(), 100);
    } else if (type === 'review') {
      switchMode(17); window.xyNavigate('ai');
      document.getElementById('inputBox').value = '我想复习最近的错题，请先问我是哪一科。';
      document.getElementById('inputBox').focus();
    } else {
      window.xyNavigate('ai');
      document.getElementById('inputBox').focus();
    }
  };

  window.xySelectIsland = function (subject) {
    currentSubject = subject;
    document.querySelectorAll('[data-island]').forEach(el => el.classList.toggle('selected', el.dataset.island === subject));
    const names = {chinese:'语文岛',math:'数学岛',english:'英语岛'};
    document.getElementById('intent-subtitle').textContent = `已选择${names[subject]}，心语伴学会自动找到最合适的方法。`;
    document.querySelector('.xy-intents').scrollIntoView({behavior:'smooth',block:'center'});
  };

  window.xyOpenIntent = function (intent) {
    const maps = {
      chinese: [3, 0, 1, 4, 3],
      math: [13, 10, 11, 14, 12],
      english: [5, 5, 8, 7, 6]
    };
    const prompts = [
      '我有一道不会的题，请先问我题目，再一步一步提示我。',
      '我想弄懂一个概念，请用适合小学生的生活例子讲给我听。',
      '我想复习以前做错的题，请帮我找出错误原因，再出一道类似题。',
      '我想练表达，请给我一个适合现在年级的小任务。',
      '我想做一次 5 题小测验，每次只出一道题。'
    ];
    switchMode(maps[currentSubject][intent]);
    window.xyNavigate('ai');
    const input = document.getElementById('inputBox');
    input.value = prompts[intent];
    input.focus();
  };

  window.xyOpenModePicker = function () {
    if (window.innerWidth > 700) {
      document.getElementById('mode-list').scrollIntoView({behavior:'smooth'});
      window.xyToast('可在左侧选择语文、数学或英语能力');
      return;
    }
    renderModeList();
    const list = document.getElementById('mode-list');
    const backdrop = document.getElementById('xy-mode-backdrop');
    list.classList.add('open');
    list.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('show');
    document.body.classList.add('xy-mode-picker-open');
    setTimeout(() => (list.querySelector('.xy-mode-button.active') || list.querySelector('.xy-mode-button'))?.focus(), 80);
  };

  window.xyCloseModePicker = function () {
    const list = document.getElementById('mode-list');
    const backdrop = document.getElementById('xy-mode-backdrop');
    if (list) {
      list.classList.remove('open');
      if (window.innerWidth <= 700) list.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) backdrop.classList.remove('show');
    document.body.classList.remove('xy-mode-picker-open');
  };

  window.xyCopyMessage = function (idx, button) {
    const text = conversations[currentMode]?.[idx]?.content || '';
    navigator.clipboard.writeText(text).then(() => {
      const old = button.innerHTML;
      button.innerHTML = '<span class="material-symbols-outlined">check</span> 已复制';
      setTimeout(() => button.innerHTML = old, 1400);
    });
  };

  window.xyRetryLastQuestion = function () {
    const history = conversations[currentMode] || [];
    const last = history[history.length - 1];
    if (!last || last.role !== 'user' || isStreaming) return;
    history.pop();
    saveConversation(currentMode);
    const input = document.getElementById('inputBox');
    input.value = last.content || '';
    pendingImages = (last.images || []).map(dataUrl => ({
      dataUrl,
      base64: dataUrl.includes(',') ? dataUrl.split(',')[1] : '',
      mimeType: dataUrl.match(/^data:([^;]+);/)?.[1] || 'image/jpeg'
    }));
    renderImagePreviews();
    autoResize(input);
    sendMessage();
  };

  window.xyStartVoice = function () {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { window.xyToast('当前浏览器暂不支持语音输入，可以使用文字或拍照'); return; }
    const recognition = new Recognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.onstart = () => window.xyToast('正在听，请开始说话…');
    recognition.onresult = event => {
      const input = document.getElementById('inputBox');
      input.value = `${input.value}${input.value ? ' ' : ''}${event.results[0][0].transcript}`;
      input.dispatchEvent(new Event('input'));
      input.focus();
    };
    recognition.onerror = () => window.xyToast('没有听清楚，可以再试一次');
    recognition.start();
  };

  window.xyOpenGuardian = function () {
    toggleSettings();
    setTimeout(() => document.getElementById('profileName').focus(), 80);
  };
  window.xyGuardianTip = function (name) { window.xyToast(`${name}可在家长守护设置中管理`); };
  window.xyToast = function (message) {
    const toast = document.getElementById('xy-toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const input = document.getElementById('inputBox');
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => autoResize(input));
  document.getElementById('settingsModal').addEventListener('click', event => {
    if (event.target === event.currentTarget) toggleSettings();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') window.xyCloseModePicker();
  });
  document.querySelectorAll('[data-island]').forEach(card => card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.xySelectIsland(card.dataset.island); }
  }));

  const now = new Date();
  const weekNames = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  document.getElementById('today-date').textContent = `${now.getMonth()+1}月${now.getDate()}日 ${weekNames[now.getDay()]} · 晴朗微风`;
  loadApiSettings();
  applyProfile();
  renderTools();
  renderModeList();
  updateAiHeader();
  renderChat();
  renderDynamicStats();
  window.xyNavigate(localStorage.getItem(PAGE_KEY) || 'today');
})();
