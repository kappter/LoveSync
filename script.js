/* ==============================================================
   LoveSync – Instant 2-Person Compare
   Fresh, clean, working version
   ============================================================== */

const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const full = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];

// Observation text
const obsReceive = {
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

// Chart creation
let chart1, chart2;
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

// Read data
function getData(prefix) {
  const rec = labels.map(l => +document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value);
  const give = labels.map(l => +document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value);
  return { rec, give };
}

// Update charts + value display
function updateCharts() {
  const p1 = getData('p1'), p2 = getData('p2');

  // Update value labels
  labels.forEach(l => {
    document.getElementById(`val_p1_rec_${l.toLowerCase()}`).textContent = p1.rec[labels.indexOf(l)];
    document.getElementById(`val_p1_give_${l.toLowerCase()}`).textContent = p1.give[labels.indexOf(l)];
    document.getElementById(`val_p2_rec_${l.toLowerCase()}`).textContent = p2.rec[labels.indexOf(l)];
    document.getElementById(`val_p2_give_${l.toLowerCase()}`).textContent = p2.give[labels.indexOf(l)];
  });

  // Update charts
  chart1.data.datasets[0].data = p1.rec; chart1.data.datasets[1].data = p1.give; chart1.update('none');
  chart2.data.datasets[0].data = p2.rec; chart2.data.datasets[1].data = p2.give; chart2.update('none');
}

// Observation
function getObs(key, score, isReceive) {
  const set = isReceive ? obsReceive : obsGive;
  const cat = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
  return set[key][cat];
}

// Love gap & top match
function loveGap(p1rec, p1give, p2rec, p2give) {
  const gaps = labels.map((_, i) => Math.abs(p1give[i] - p2rec[i]));
  const max = Math.max(...gaps);
  const idx = gaps.indexOf(max);
  return max > 3 ? `Big mismatch: <strong>${full[idx]}</strong> – P1 gives ${p1give[idx]} but P2 receives ${p2rec[idx]}` : 'Giving & receiving are balanced!';
}
function topMatch(p1rec, p1give, p2rec, p2give) {
  const matches = labels.map((_, i) => Math.min(p1give[i], p2rec[i]));
  const best = Math.max(...matches);
  const idx = matches.indexOf(best);
  return `Strongest mutual language: <strong>${full[idx]}</strong> (${best}/10)`;
}

// Show report
function showReport() {
  const p1 = getData('p1'), p2 = getData('p2');

  const cards = (data, isReceive, person) => labels.map((l, i) => {
    const s = data[i];
    const o = getObs(l, s, isReceive);
    const cls = s >= 7 ? 'score-high' : s >= 4 ? 'score-medium' : 'score-low';
    return `<div class="language-card ${cls}"><strong>${full[i]}</strong> – ${s}/10<br><em>${o}</em></div>`;
  }).join('');

  const html = `
    <h2 style="text-align:center">Comparison Report</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem">
      <div>
        <h3>Person 1 – Receiving</h3>${cards(p1.rec, true)}
        <h3>Person 1 – Giving</h3>${cards(p1.give, false)}
      </div>
      <div>
        <h3>Person 2 – Receiving</h3>${cards(p2.rec, true)}
        <h3>Person 2 – Giving</h3>${cards(p2.give, false)}
      </div>
    </div>
    <div style="margin-top:2rem;padding:1rem;background:#fff3cd;border-radius:8px">
      <p class="love-gap">${loveGap(p1.rec, p1.give, p2.rec, p2.give)}</p>
      <p class="top-match">${topMatch(p1.rec, p1.give, p2.rec, p2.give)}</p>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn" onclick="document.getElementById('report').style.display='none'">Close Report</button>
    </div>`;

  const rep = document.getElementById('report');
  rep.innerHTML = html;
  rep.style.display = 'block';
}

// Toggle sliders
function toggleSliders() {
  const cont = document.getElementById('slidersContainer');
  const btn = document.querySelector('.toggle-btn');
  const isHidden = cont.style.display === 'none' || !cont.style.display;
  cont.style.display = isHidden ? 'grid' : 'none';
  btn.textContent = isHidden ? 'Hide Sliders' : 'Show Sliders';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  buildSliders('p1-sliders', 'p1');
  buildSliders('p2-sliders', 'p2');
  chart1 = createChart('chart1', [5,5,5,5,5], [5,5,5,5,5]);
  chart2 = createChart('chart2', [5,5,5,5,5], [5,5,5,5,5]);
  updateCharts();
});
