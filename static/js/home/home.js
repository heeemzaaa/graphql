// Fetch and Render Dashboard Data with SVG Charts
async function fetchUserData() {
  const token = localStorage.getItem('jwt')
  return await fetchData(USER, {}, token);
}

async function fetchAuditData() {
  const token = localStorage.getItem('jwt');
  return await fetchData(AUDIT, {}, token);
}

async function fetchTransactionData() {
  const token = localStorage.getItem('jwt');
  return await fetchData(TRANSACTIONS, {}, token);
}

async function fetchSkillsData(arg) {
  const token = localStorage.getItem('jwt');
  return await fetchData(SKILLS, { login: arg }, token);
}

function calculateAuditStats(auditData) {
  const succeeded = auditData.data?.user[0].audits_aggregate?.aggregate?.count || 0;
  const failed = auditData.data?.user[0].failed_audits?.aggregate?.count || 0;
  const total = succeeded + failed;
  const succeededPercentage = total ? ((succeeded / total) * 100).toFixed(1) : "No Data";
  const failedPercentage = total ? ((failed / total) * 100).toFixed(1) : "No Data";
  const auditRatio = auditData.data?.user[0].auditRatio ? auditData.data.user[0].auditRatio.toFixed(1) : "No Data";

  return { succeeded, failed, total, succeededPercentage, failedPercentage, auditRatio };
}

function createNavigationHTML() {
  return `
    <nav class="navBar">
      <h1>GraphQl</h1>
      <button id="logout">logout</button>
    </nav>
  `;
}

function createUserInfoHTML(userData) {
  return `
    <section class="user_infos">
      <h1>Welcome ${userData.data.user[0].firstName} ${userData.data.user[0].lastName}</h1>
      <p>Login: <span>${userData.data.user[0].login}</span></p>
      <p>Email: <span>${userData.data.user[0].email}</span></p>
      <p>Campus: <span>${userData.data.user[0].campus}</span></p>
    </section>
  `;
}

function createChartsHTML(auditStats) {
  return `
    <section class="charts">
      <div class="first_chart"></div>
      <div class="chart-border">
        <h2 class="audits-title">Your Audit Statistics</h2>
        <div class="audits-grid">
          <div class="audit-card">
            <span class="audit-number">${auditStats.auditRatio}</span>
            <span class="audit-label">Audit Ratio</span>
          </div>
          <div class="audit-card">
            <span class="audit-number">${auditStats.total || "No Data"}</span>
            <span class="audit-label">Total Audits</span>
          </div>
          <div class="audit-card">
            <span class="audit-number" style="color:green;">${auditStats.succeededPercentage}%</span>
            <span class="audit-label">Success Rate</span>
          </div>
          <div class="audit-card">
            <span class="audit-number" style="color:red;">${auditStats.failedPercentage}%</span>
            <span class="audit-label">Fail Rate</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function createInfoSectionHTML() {
  return `
    <section class="infos">
      <h2 class="transaction-title">Transactions Overview</h2>
      <div class="transaction-chart"></div>
      <div class="skills-chart"></div>
    </section>
  `;
}

function setupEventListeners() {
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    checkAccess();
  });
}

function createLinearSVG(transactionData) {
  const amounts = transactionData.map(d => d.amount);
  const maxAmount = amounts.reduce((a, b) => a + b, 0);
  const chartHeight = 300;
  const chartWidth = 1000;
  const gap = 40;

  let cumulativeXP = 0;
  const points = transactionData.map((d, i) => {
    cumulativeXP += d.amount;
    const x = i * gap;
    const y = chartHeight - (cumulativeXP / maxAmount) * (chartHeight - 50);
    return { x, y, label: d.object.name, total: cumulativeXP };
  });

  const lines = points.map((p, i, arr) => {
    if (i === 0) return "";
    return `<line x1="${arr[i - 1].x}" y1="${arr[i - 1].y}" x2="${p.x}" y2="${p.y}" stroke="blue" stroke-width="2"/>`;
  }).join("");

  const circles = points.map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="blue" />`
  ).join("");

  const labels = points.map(p =>
    `<text x="${p.x}" y="290" font-size="10" fill="black" transform="rotate(45, ${p.x}, 290)">${p.label} (${p.total})</text>`
  ).join("");

  return `
    <svg width="${chartWidth}" height="${chartHeight}">
      <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="black" />
      ${lines}
      ${circles}
      ${labels}
    </svg>
  `;
}

// Create bar chart SVG for skill XP (aggregated by unique skill type)
function createSkillsBarChart(skillsData) {
  const chartWidth = 1000;
  const chartHeight = 300;
  const padding = 60;
  const barGap = 10;

  // Aggregate amounts by skill type
  const skillMap = {};
  skillsData.forEach(item => {
    if (!item.type || typeof item.amount !== 'number') return;
    const label = item.type.replace('skill_', '').replace(/-/g, ' ');
    skillMap[label] = (skillMap[label] || 0) + item.amount;
  });

  const data = Object.entries(skillMap).map(([label, amount]) => ({ label, amount }));
  if (data.length === 0) return `<p>No skill data available.</p>`;

  const maxAmount = Math.max(...data.map(d => d.amount));
  const barWidth = (chartWidth - padding * 2) / data.length - barGap;
  const scaleY = (value) => (value / maxAmount) * (chartHeight - padding);

  let bars = '';
  let labels = '';

  data.forEach((item, index) => {
    const barHeight = scaleY(item.amount);
    const x = padding + index * (barWidth + barGap);
    const y = chartHeight - padding - barHeight;

    bars += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#4caf50"></rect>
    `;

    labels += `
      <text x="${x + barWidth / 2}" y="${chartHeight - padding + 15}" font-size="10" text-anchor="middle" fill="black" transform="rotate(45, ${x + barWidth / 2}, ${chartHeight - padding + 15})">
        ${item.label}
      </text>
    `;
  });

  const yAxis = `
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${chartHeight - padding}" stroke="#000" />
    <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#000" />
  `;

  return `
    <svg width="${chartWidth}" height="${chartHeight}">
      ${yAxis}
      ${bars}
      ${labels}
    </svg>
  `;
}

// Main render function
async function renderHome() {
  const userData = await fetchUserData();
  const auditData = await fetchAuditData();
  const transactionData = await fetchTransactionData();
  const skills = await fetchSkillsData(userData.data.user[0].login);

  const auditStats = calculateAuditStats(auditData);

  const navigationHTML = createNavigationHTML();
  const userInfoHTML = createUserInfoHTML(userData);
  const chartsHTML = createChartsHTML(auditStats);
  const infoSectionHTML = createInfoSectionHTML();
  const linearSVG =  createLinearSVG(transactionData.data.transaction);
  const skillSVG =  createSkillsBarChart(skills.data.user[0].transactions);

  document.body.innerHTML = `
    ${navigationHTML}
    <main id="home_page">
      ${userInfoHTML}
      ${chartsHTML}
      ${infoSectionHTML}
      ${linearSVG}
      ${skillSVG}
    </main>
  `;

  setupEventListeners();
}