import { fetchUserData, createUserInfoHTML } from "../data/userdata.js"
import { fetchAuditData, calculateAuditStats, createChartsHTML } from "../data/auditData.js"
import { fetchTransactionData, createLinearSVG } from "../data/transactionData.js"
import { fetchSkillsData, createSkillsBarChart } from "../data/skillsData.js"
import { setupEventListeners } from "../utils/utils.js"



function createNavigationHTML() {
  return `
    <nav class="navBar">
      <h1>GraphQl</h1>
      <button id="logout">logout</button>
    </nav>
  `
}

// Main render function
export async function renderHome() {
  const userData = await fetchUserData()
  const auditData = await fetchAuditData()
  const transactionData = await fetchTransactionData()
  const skills = await fetchSkillsData(userData.data.user[0].login)

  const auditStats = calculateAuditStats(auditData)

  const navigationHTML = createNavigationHTML()
  const userInfoHTML = createUserInfoHTML(userData)
  const chartsHTML = createChartsHTML(auditStats)
  const linearSVG =  createLinearSVG(transactionData.data.transaction)
  const skillSVG =  createSkillsBarChart(skills.data.user[0].transactions)

  document.body.innerHTML = `
    ${navigationHTML}
    <main id="home_page">
      ${userInfoHTML}
      ${chartsHTML}
      ${linearSVG}
      ${skillSVG}
    </main>
  `

  setupEventListeners()
}