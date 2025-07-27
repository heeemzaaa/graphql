import { TRANSACTIONS } from "../utils/variables.js";
import { fetchData } from "../utils/utils.js"

export async function fetchTransactionData() {
  const token = localStorage.getItem('jwt');
  return await fetchData(TRANSACTIONS, {}, token);
}

export function createLinearSVG(transactionData) {
  const amounts = transactionData.map(d => d.amount);
  const totalXP = amounts.reduce((a, b) => a + b, 0);

  const roundedMaxXP = Math.ceil(totalXP / 1000) * 1000;

  const chartHeight = 450;
  const gap = 60;
  const chartWidth = transactionData.length * gap + 60;



  let cumulativeXP = 0;
  const points = transactionData.map((d, i) => {
    cumulativeXP += d.amount;
    const x = i * gap + 40;
    const y = chartHeight - (cumulativeXP / roundedMaxXP) * (chartHeight - 50);
    return { x, y, label: d.object.name, total: cumulativeXP };
  })

  // ✅ Clean Y-axis: step every 10% of student's XP
  const yStep = roundedMaxXP/10
  const yLabels = [];
  const yLines = [];
  for (let xp = 0; xp <= roundedMaxXP; xp += yStep) {
    const y = chartHeight - (xp / roundedMaxXP) * (chartHeight - 50);
    yLabels.push(`<text x="0" y="${y}" font-size="10">${xp}</text>`);
    yLines.push(`<line x1="40" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="#ccc" stroke-dasharray="2"/>`);
  }

  const circles = points.map(p =>
    `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#06b6d4" />`
  ).join("");
  
  const lines = points.map((p, i, arr) => {
    if (i === 0) return "";
    return `<line x1="${arr[i - 1].x}" y1="${arr[i - 1].y}" x2="${p.x}" y2="${p.y}" stroke="#06b6d4" stroke-width="2"/>`;
  }).join("");


  // ✅ Labels BELOW the chart aligned to point.x
  const labelY = chartHeight + 20;
  const labels = points.map((p) =>
    `<text class="names" x="${p.x}" y="${labelY}" transform="rotate(45, ${p.x}, ${labelY})">${p.label}</text>`
  ).join("");
  
  return `
  <h2 class="transaction-title">Transactions Overview</h2>
  <div class="transaction-chart">
    <svg 
    class="transaction_chart" 
    viewBox="0 0 ${chartWidth + 60} ${chartHeight + 170}" 
    preserveAspectRatio="xMinYMin meet">
    <line x1="40" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="black" />
    <line x1="40" y1="0" x2="40" y2="${chartHeight}" stroke="black" />
    
    ${yLabels.join("")}
    ${yLines.join("")}
    ${lines}
    ${circles}
    ${labels}
    </svg>
    </div>
  `;
}


