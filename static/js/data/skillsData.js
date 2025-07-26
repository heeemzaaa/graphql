import { SKILLS } from "../utils/variables.js";
import { fetchData } from "../utils/utils.js"

export async function fetchSkillsData(arg) {
  const token = localStorage.getItem('jwt');
  return await fetchData(SKILLS, { login: arg }, token);
}


export function createSkillsBarChart(skillsData) {
  const chartWidth = 1500;
  const chartHeight = 500;
  const padding = 60;
  const barGap = 20;

  // 1. Group by skill type and get only the HIGHEST amount once
  const skillMap = {};
  skillsData.forEach(item => {
    if (!item.type || typeof item.amount !== 'number') return;
    const label = item.type.replace('skill_', '').replace(/-/g, ' ');
    if (!skillMap[label] || skillMap[label] < item.amount) {
      skillMap[label] = item.amount; // keep only highest
    }
  });

  // 2. Convert skillMap to array
  const data = Object.entries(skillMap).map(([label, amount]) => ({ label, amount }));

  if (data.length === 0) return `<p>No skill data available.</p>`;

  // 3. Determine the highest amount to scale everything to
  const maxAmount = Math.max(...data.map(d => d.amount));

  // 4. Define scaling function
  const drawableHeight = chartHeight - padding * 1.5;
  const scaleY = (value) => (value / maxAmount) * drawableHeight;
  const barWidth = (chartWidth - padding * 2) / data.length - barGap;

  let bars = '';
  let labels = '';
  let yTicks = '';

  // 5. Create bars and x-axis labels
  data.forEach((item, index) => {
    const barHeight = scaleY(item.amount);
    const x = padding + index * (barWidth + barGap);
    const y = chartHeight - padding - barHeight;

    bars += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#06b6d4" />
    `;

    labels += `
      <text x="${x + barWidth / 2}" y="${chartHeight - padding + 20}" font-size="11" text-anchor="middle" fill="black">
        ${item.label}
      </text>
    `;
  });

  // 6. Calculate Y-axis tick step (smart rounding)
  const rawStep = maxAmount / 5;
  const step = Math.ceil(rawStep / 5) * 5;

  for (let val = 0; val <= maxAmount; val += step) {
    const y = chartHeight - padding - scaleY(val);
    yTicks += `
      <line x1="${padding - 5}" y1="${y}" x2="${padding}" y2="${y}" stroke="black" />
      <text x="${padding - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="black">${val}</text>
    `;
  }

  // 7. Axis lines
  const axisLines = `
    <!-- Y Axis -->
    <line x1="${padding}" y1="${padding / 2}" x2="${padding}" y2="${chartHeight - padding}" stroke="#000" />

    <!-- X Axis -->
    <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#000" />
  `;

  // 8. Final chart HTML
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
