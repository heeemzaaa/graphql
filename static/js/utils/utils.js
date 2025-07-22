async function fetchData(query, variables = null, token) {
    if (!token) {
        console.error('❌ No token provided to fetchData!')
        return
    }

    const res = await fetch(url_data, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    })

    return res.json()
}

// function createTransactionChartSVG(transactionData) {
//   const chartWidth = 1500;
//   const chartHeight = 300;
//   const padding = 60;
//   const barGap = 10;

//   const data = transactionData.transaction;
//   const barWidth = (chartWidth - padding * 2) / data.length - barGap;

//   const maxAmount = Math.max(...data.map(d => d.amount));
//   const scaleY = (value) => (value / maxAmount) * (chartHeight - padding);

//   let bars = '';
//   let labels = '';

//   data.forEach((item, index) => {
//     const barHeight = scaleY(item.amount);
//     const x = padding + index * (barWidth + barGap);
//     const y = chartHeight - padding - barHeight;

//     bars += `
//       <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#810e0eff"></rect>
//     `;

//     labels += `
//       <text class="name_of_projects" x="${x + barWidth / 2}" y="${chartHeight - padding + 15}" font-size="10" text-anchor="middle" fill="white" transform="rotate(75, ${x + barWidth / 2}, ${chartHeight - padding + 15})">
//         ${item.object.name}
//       </text>
//     `;
//   });

//   const yAxis = `
//     <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${chartHeight - padding}" stroke="#000" />
//     <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#000" />
//   `;

//   return `
//     <svg width="${chartWidth}" height="${chartHeight}">
//       ${yAxis}
//       ${bars}
//       ${labels}
//     </svg>
//   `;
// }

//   const chartSVG = createTransactionChartSVG(transactionData.data);
