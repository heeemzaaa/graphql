function createNavigationHTML() {
  return `
    <nav class="navBar">
      <h1>GraphQl</h1>
      <button id="logout">logout</button>
    </nav>
  `
}

// Main render function
async function renderHome() {
  const userData = await fetchUserData()
  const auditData = await fetchAuditData()
  const transactionData = await fetchTransactionData()
  const skills = await fetchSkillsData(userData.data.user[0].login)

  const auditStats = calculateAuditStats(auditData)

  const navigationHTML = createNavigationHTML()
  const userInfoHTML = createUserInfoHTML(userData)
  const chartsHTML = createChartsHTML(auditStats)
  const infoSectionHTML = createInfoSectionHTML()
  const linearSVG =  createLinearSVG(transactionData.data.transaction)
  const skillSVG =  createSkillsBarChart(skills.data.user[0].transactions)

  document.body.innerHTML = `
    ${navigationHTML}
    <main id="home_page">
      ${userInfoHTML}
      ${chartsHTML}
      ${infoSectionHTML}
      ${linearSVG}
      ${skillSVG}
    </main>
  `

  setupEventListeners()
}