/* ==============================================================
   LoveSync – Fixed Mode Switch + Dark Mode
   ============================================================== */

const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const full = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];

// Observations (same as before)
const obsReceive = { /* ... unchanged ... */ };
const obsGive = { /* ... unchanged ... */ };

let soloChart, chart1, chart2;

// Build sliders
function buildSliders(containerId, prefix) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = labels.map((l, i) => `
    <div class="slider-row">
      <label>${full[i]} (Receive)</label>
      <input type="range" min="0" max="10" value="5" id="${prefix}_rec_${l.toLowerCase()}" oninput="updateCharts()">
      <span id="val_${prefix}_rec_${l.toLowerCase()}">5</span>
    </div>
    <div class="slider-row">
      <label>${full[i]} (Give)</label>
      <input type="range" min="0" max="10" value="5" id="${prefix}_give_${l.toLowerCase()}" oninput="updateCharts()">
      <span id="val_${prefix}_give_${l.toLowerCase()}">5</span>
    </div>
  `).join('');
}

// Create chart
function createChart(canvasId, rec, give) {
  return new Chart(document.getElementById(canvasId), {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Receive', data: rec, backgroundColor: 'rgba(52,152,219,0.2)', borderColor: '#3498db', pointBackgroundColor: colors, pointBorderColor: '#fff', borderWidth: 2 },
        { label: 'Give',    data: give, backgroundColor: 'rgba(46,204,113,0.2)', borderColor: '#2ecc71', pointBackgroundColor: colors.map(c => c + '80'), pointBorderColor: '#fff', borderWidth: 2 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// Get data
function getData(prefix) {
  const rec = labels.map(l => +document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value);
  const give = labels.map(l => +document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value);
  return { rec, give };
}

// Update charts
function updateCharts() {
  if (document.getElementById('solo-container').style.display !== 'none') {
    const data = getData('solo');
    if (soloChart) {
      soloChart.data.datasets[0].data = data.rec;
      soloChart.data.datasets[1].data = data.give;
      soloChart.update('none');
    }
    updateValues('solo');
  } else {
    const p1 = getData('p1'), p2 = getData('p2');
    if (chart1) { chart1.data.datasets[0].data = p1.rec; chart1.data.datasets[1].data = p1.give; chart1.update('none'); }
    if (chart2) { chart2.data.datasets[0].data = p2.rec; chart2.data.datasets[1].data = p2.give; chart2.update('none'); }
    updateValues('p1'); updateValues('p2');
  }
}
function updateValues(prefix) {
  labels.forEach(l => {
    const rec = document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value;
    const give = document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value;
    document.getElementById(`val_${prefix}_rec_${l.toLowerCase()}`).textContent = rec;
    document.getElementById(`val_${prefix}_give_${l.toLowerCase()}`).textContent = give;
  });
}

// === MODE SWITCH (FIXED) ===
function setMode(mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');

  document.getElementById('solo-container').style.display = mode === 'solo' ? 'block' : 'none';
  document.getElementById('couple-container').style.display = mode === 'couple' ? 'block' : 'none';
  document.getElementById('page-title').textContent = `LoveSync – ${mode === 'solo' ? 'Solo' : 'Couple'} Mode`;

  if (mode === 'solo') {
    if (!soloChart) {
      buildSliders('solo-sliders', 'solo');
      soloChart = createChart('solo-chart', [5,5,5,5,5], [5,5,5,5,5]);
    }
    updateCharts();
  } else {
    // Always rebuild couple mode to avoid stale data
    buildSliders('p1-sliders', 'p1');
    buildSliders('p2-sliders', 'p2');
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();
    chart1 = createChart('chart1', [5,5,5,5,5], [5,5,5,5,5]);
    chart2 = createChart('chart2', [5,5,5,5,5], [5,5,5,5,5]);
    document.getElementById('slidersContainer').style.display = 'grid';
    updateCharts();
  }
}

// === DARK MODE ===
function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById('darkModeBtn');
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark);
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkMode') === 'true';
  if (saved) {
    document.body.classList.add('dark');
    document.getElementById('darkModeBtn').textContent = 'Light Mode';
  }
  setMode('solo');
});

// Reports (unchanged – use your therapist-ready version)
function showSoloReport() { /* ... same ... */ }
function showCoupleReport() { /* ... same ... */ }
function toggleSliders() { /* ... same ... */ }
