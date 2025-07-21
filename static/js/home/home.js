

async function renderHome() {

  const token = localStorage.getItem('jwt')
  let userData = await fetchData(USER, token)
  let auditData = await fetchData(AUDIT, token)
  let transactionData = await fetchData(TRANSACTIONS, token)
  console.log('transactionData', transactionData)

    const succeeded = auditData.data?.user[0].audits_aggregate?.aggregate?.count || 0;
    const failed = auditData.data?.user[0].failed_audits?.aggregate?.count || 0;
    const total = succeeded + failed;

    const succeededPercentage = total ? ((succeeded / total) * 100).toFixed(1) : "No Data";
    const failedPercentage = total ? ((failed / total) * 100).toFixed(1) : "No Data";
    const auditRatio = auditData.data?.user[0].auditRatio ? auditData.data.user[0].auditRatio.toFixed(1) : "No Data";

  document.body.innerHTML = `
      <nav class="navBar">
        <h1>GraphQl</h1>
        <button id="logout">logout</button>
      </nav>
    <main id="home_page">
          <section class="user_infos">
          <h1>Welcome ${userData.data.user[0].firstName} ${userData.data.user[0].lastName}</h1>
          <p>Login: <span>${userData.data.user[0].login}</span></p>
          <p>Email: <span>${userData.data.user[0].email}</span></p>
          <p>Campus: <span>${userData.data.user[0].campus}</span></p>

      </section>

      <section class="charts">
        <div class="first_chart"></div>
        <div class="chart-border">
          <h2 class="audits-title">Your Audit Statistics</h2>
          <div class="audits-grid">
        <div class="audit-card">
            <span class="audit-number">${auditRatio}</span>
            <span class="audit-label">Audit Ratio</span>
        </div>
        <div class="audit-card">
            <span class="audit-number">${total || "No Data"}</span>
            <span class="audit-label">Total Audits</span>
        </div>
        <div class="audit-card">
            <span class="audit-number" style="color:green;">${succeededPercentage} %</span>
            <span class="audit-label">Success Rate</span>
        </div>
        <div class="audit-card">
            <span class="audit-number" style="color:red;">${failedPercentage} %</span>
            <span class="audit-label">Fail Rate</span>
        </div>
    </div>
    </div>
      </section>

      <section class="infos">
      
      </section>
    </main>
  `;

  // Add logout click event
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    checkAccess();
  });
}
