import { SKILLS } from "../utils/variables.js";
import { fetchData } from "../utils/utils.js"

export async function fetchSkillsData(arg) {
  const token = localStorage.getItem('jwt');
  return await fetchData(SKILLS, { login: arg }, token);
}


export function createSkillsBarChart(skillsData) {
  const chartWidth = 1500
  const chartHeight = 500
  const padding = 60
  const barGap = 20

  // Group skill amounts by type
  const skillMap = {}
  skillsData.forEach(item => {
    if (!item.type || typeof item.amount !== 'number') return
    const label = item.type.replace('skill_', '').replace(/-/g, ' ')
    skillMap[label] = (skillMap[label] || 0) + item.amount
  })

  const data = Object.entries(skillMap).map(([label, amount]) => ({ label, amount }))
  if (data.length === 0) return `<p>No skill data available.</p>`

  const maxAmount = Math.max(...data.map(d => d.amount))
  const barWidth = (chartWidth - padding * 2) / data.length - barGap

  const scaleY = (value) => (value / maxAmount) * (chartHeight - padding * 1.5)

  let bars = ''
  let labels = ''
  let yTicks = ''

  data.forEach((item, index) => {
    const barHeight = scaleY(item.amount)
    const x = padding + index * (barWidth + barGap)
    const y = chartHeight - padding - barHeight

    // Bar rectangle
    bars += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" "fill="#0ea5e9"></rect>
    `

    // Label below X axis
    labels += `
      <text x="${x + barWidth / 2}" y="${chartHeight - padding + 20}" font-size="11" text-anchor="middle" fill="black">
        ${item.label}
      </text>
    `;
  });

  // Draw Y-axis percentage ticks (from 10% to 100%)
  for (let p = 10; p <= 100; p += 10) {
    const percentHeight = (p / 100) * (chartHeight - padding * 1.5);
    const y = chartHeight - padding - percentHeight;
    yTicks += `
      <line x1="${padding - 5}" y1="${y}" x2="${padding}" y2="${y}" stroke="black" />
      <text x="${padding - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="black">${p}%</text>
    `;
  }

  const axisLines = `
    <!-- Y Axis -->
    <line x1="${padding}" y1="${padding / 2}" x2="${padding}" y2="${chartHeight - padding}" stroke="#000" />
    
    <!-- X Axis -->
    <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#000" />
  `;

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
  `;
}
