import { SKILLS } from "../utils/variables.js"
import { fetchData } from "../utils/utils.js"

export async function fetchSkillsData(arg) {
  const token = localStorage.getItem('jwt')
  return await fetchData(SKILLS, { login: arg }, token)
}


export function createSkillsBarChart(skillsData) {
  const chartWidth = 1500
  const chartHeight = 500
  const padding = 60
  const barGap = 20


  const skillMap = {}
  skillsData.forEach(item => {
    if (!item.type || typeof item.amount !== 'number') return
    const label = item.type.replace('skill_', '').replace(/-/g, ' ')
    if (!skillMap[label] || skillMap[label] < item.amount) {
      skillMap[label] = item.amount
    }
  })

  const data = Object.entries(skillMap).map(([label, amount]) => ({ label, amount }))
  if (data.length === 0) return `<p>No skill data available.</p>`

  const maxAmount = 100

  const drawableHeight = chartHeight - padding * 1.5
  const scaleY = (value) => (value / maxAmount) * drawableHeight
  const barWidth = (chartWidth - padding * 2) / data.length - barGap

  let bars = ''
  let labels = ''
  let yTicks = ''

  data.forEach((item, index) => {
    const barHeight = scaleY(item.amount)
    const x = padding + index * (barWidth + barGap)
    const y = chartHeight - padding - barHeight

    bars += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#06b6d4" />
    `

    labels += `
      <text x="${x + barWidth / 2}" y="${chartHeight - padding + 20}" font-size="10" text-anchor="middle" fill="black">
        ${item.label}
      </text>
    `
  })

  const yStep = 10
  for (let percent = 0; percent <= 100; percent += yStep) {
    const y = chartHeight - padding - scaleY(percent)
    yTicks += `
      <line x1="${padding}" y1="${y}" x2="${chartWidth - padding}" y2="${y}" stroke="#ccc" stroke-dasharray="2" />
      <text x="${padding - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="black">${percent}%</text>
    `
  }

  const axisLines = `
    <line x1="${padding}" y1="${padding / 2}" x2="${padding}" y2="${chartHeight - padding}" stroke="#000" />
    <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#000" />
  `

  // 8. Return full SVG
  return `
    <h2 class="skills-title">Skills Overview</h2>
    <svg
      class="skillsSvg"
      viewBox="0 0 ${chartWidth} ${chartHeight}"
      preserveAspectRatio="xMidYMid meet"
    >
      ${axisLines}
      ${yTicks}
      ${bars}
      ${labels}
    </svg>
  `
}

