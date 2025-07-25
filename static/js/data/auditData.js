import { AUDIT } from "../utils/variables.js";
import { fetchData } from "../utils/utils.js"

export async function fetchAuditData() {
  const token = localStorage.getItem('jwt');
  return await fetchData(AUDIT, {}, token);
}


export function calculateAuditStats(auditData) {
  const succeeded = auditData.data?.user[0].audits_aggregate?.aggregate?.count || 0;
  const failed = auditData.data?.user[0].failed_audits?.aggregate?.count || 0;
  const total = succeeded + failed;
  const succeededPercentage = total ? ((succeeded / total) * 100).toFixed(1) : "No Data";
  const failedPercentage = total ? ((failed / total) * 100).toFixed(1) : "No Data";
  const auditRatio = auditData.data?.user[0].auditRatio ? auditData.data.user[0].auditRatio.toFixed(1) : "No Data";

  return { succeeded, failed, total, succeededPercentage, failedPercentage, auditRatio };
}


export function createChartsHTML(auditStats) {
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
