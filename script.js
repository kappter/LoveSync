/* ==============================================================
   LoveSync – Solo & Couple Mode
   ============================================================== */

const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const full = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];

// Observations
const obsReceive = { /* same as before */ 
  Words: { high: "You thrive on verbal encouragement!", medium: "Words matter to you.", low: "Verbal praise is nice but not primary." },
  Acts:  { high: "Helping with tasks feels like love.", medium: "Practical help is appreciated.", low: "Acts are secondary." },
  Gifts: { high: "Thoughtful gifts speak volumes.", medium: "Gifts warm your heart.", low: "Gifts are pleasant but not essential." },
  Time:  { high: "Undivided attention is everything.", medium: "Quality time strengthens bonds.", low: "Time together is nice." },
  Touch: { high: "Physical touch makes you feel secure.", medium: "Touch helps you connect.", low: "Touch is comforting." }
};
const obsGive = {
  Words: { high: "You naturally encourage with words.", medium: "You enjoy giving compliments.", low: "Words aren’t your main way." },
  Acts:  { high: "You show love by doing.", medium: "You like helping out.", low: "Helping isn’t your default." },
  Gifts: { high: "You love finding the perfect gift.", medium: "You give gifts on special occasions.", low: "Gifts aren’t your style." },
  Time:  { high: "Your presence is the gift.", medium: "You value shared moments.", low: "Time isn’t your primary expression." },
  Touch: { high: "You’re naturally affectionate.", medium: "You use touch to connect.", low: "Touch isn’t your go-to." }
};

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
    soloChart.data.datasets[0].data = data.rec;
    soloChart.data.datasets[1].data = data.give;
    soloChart.update('none');
    updateValues('solo');
  } else {
    const p1 = getData('p1'), p2 = getData('p2');
    chart1.data.datasets[0].data = p1.rec; chart1.data.datasets[1].data = p1.give; chart1.update('none');
    chart2.data.datasets[0].data = p2.rec; chart2.data.datasets[1].data = p2.give; chart2.update('none');
    updateValues('p1'); updateValues('p2');
  }
}
function updateValues(prefix) {
  labels.forEach(l => {
    const idx = labels.indexOf(l);
    const rec = document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value;
    const give = document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value;
    document.getElementById(`val_${prefix}_rec_${l.toLowerCase()}`).textContent = rec;
    document.getElementById(`val_${prefix}_give_${l.toLowerCase()}`).textContent = give;
  });
}

// Observation
function getObs(key, score, isReceive) {
  const set = isReceive ? obsReceive : obsGive;
  const cat = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
  return set[key][cat];
}

// Solo Report
function showSoloReport() {
  const data = getData('solo');
  const cards = (isReceive) => labels.map((l, i) => {
    const s = isReceive ? data.rec[i] : data.give[i];
    const o = getObs(l, s, isReceive);
    const cls = s >= 7 ? 'score-high' : s >= 4 ? 'score-medium' : 'score-low';
    return `<div class="language-card ${cls}"><strong>${full[i]}</strong> – ${s}/10<br><em>${o}</em></div>`;
  }).join('');

  const html = `
    <h2 style="text-align:center">Your Love Profile Report</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
      <div><h3>Receiving</h3>${cards(true)}</div>
      <div><h3>Giving</h3>${cards(false)}</div>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn" onclick="document.getElementById('report').style.display='none'">Close</button>
    </div>`;

  const rep = document.getElementById('report');
  rep.innerHTML = html;
  rep.style.display = 'block';
}

// Couple Report
function showCoupleReport() {
  const p1 = getData('p1'), p2 = getData('p2');
  const cards = (data, isReceive) => labels.map((l, i) => {
    const s = data[i];
    const o = getObs(l, s, isReceive);
    const cls = s >= 7 ? 'score-high' : s >= 4 ? 'score-medium' : 'score-low';
    return `<div class="language-card ${cls}"><strong>${full[i]}</strong> – ${s}/10<br><em>${o}</em></div>`;
  }).join('');

  const loveGap = () => {
    const gaps = labels.map((_, i) => Math.abs(p1.give[i] - p2.rec[i]));
    const max = Math.max(...gaps);
    const idx = gaps.indexOf(max);
    return max > 3 ? `Mismatch: <strong>${full[idx]}</strong> – P1 gives ${p1.give[idx]}, P2 receives ${p2.rec[idx]}` : 'Balanced!';
  };
  const topMatch = () => {
    const matches = labels.map((_, i) => Math.min(p1.give[i], p2.rec[i]));
    const best = Math.max(...matches);
    const idx = matches.indexOf(best);
    return `Mutual strength: <strong>${full[idx]}</strong> (${best}/10)`;
  };

  const html = `
    <h2 style="text-align:center">Couple Comparison Report</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
      <div><h3>P1 Receiving</h3>${cards(p1.rec, true)}<h3>P1 Giving</h3>${cards(p1.give, false)}</div>
      <div><h3>P2 Receiving</h3>${cards(p2.rec, true)}<h3>P2 Giving</h3>${cards(p2.give, false)}</div>
    </div>
    <div style="margin-top:1.5rem;padding:1rem;background:#fff3cd;border-radius:8px">
      <p class="love-gap">${loveGap()}</p>
      <p class="top-match">${topMatch()}</p>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn" onclick="document.getElementById('report').style.display='none'">Close</button>
    </div>`;

  const rep = document.getElementById('report');
  rep.innerHTML = html;
  rep.style.display = 'block';
}

// Mode Switch
function setMode(mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');

  document.getElementById('solo-container').style.display = mode === 'solo' ? 'block' : 'none';
  document.getElementById('couple-container').style.display = mode === 'couple' ? 'block' : 'none';
  document.getElementById('page-title').textContent = `LoveSync – ${mode === 'solo' ? 'Solo' : 'Couple'} Mode`;

  if (mode === 'solo' && !soloChart) {
    buildSliders('solo-sliders', 'solo');
    soloChart = createChart('solo-chart', [5,5,5,5,5], [5,5,5,5,5]);
    updateCharts();
  } else if (mode === 'couple') {
    if (!chart1) {
      buildSliders('p1-sliders', 'p1');
      buildSliders('p2-sliders', 'p2');
      chart1 = createChart('chart1', [5,5,5,5,5], [5,5,5,5,5]);
      chart2 = createChart('chart2', [5,5,5,5,5], [5,5,5,5,5]);
      updateCharts();
    }
  }
}

// Toggle sliders (couple mode)
function toggleSliders() {
  const cont = document.getElementById('slidersContainer');
  const btn = document.querySelector('.toggle-btn');
  const isHidden = cont.style.display === 'none' || !cont.style.display;
  cont.style.display = isHidden ? 'grid' : 'none';
  btn.textContent = isHidden ? 'Hide Sliders' : 'Show Sliders';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setMode('solo'); // default
});
