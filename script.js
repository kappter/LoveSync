/* ==============================================================
   LoveSync – FULL, FIXED, DARK MODE + THERAPIST REPORT
   ============================================================== */

const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const full = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];

// === OBSERVATIONS ===
const obsReceive = {
  Words: { high: "You feel most loved when your partner says kind, affirming things.", medium: "Words of appreciation help you feel valued.", low: "You don’t need many words to feel loved." },
  Acts:  { high: "You feel loved when your partner helps with tasks or responsibilities.", medium: "Acts of service make you feel supported.", low: "You’re independent and don’t rely on help to feel loved." },
  Gifts: { high: "Thoughtful gifts make you feel remembered and cherished.", medium: "Small gifts on special days mean a lot.", low: "Gifts are nice but not your main way of feeling loved." },
  Time:  { high: "Undivided attention is how you feel most connected.", medium: "Quality time strengthens your bond.", low: "You’re okay with less focused time." },
  Touch: { high: "Physical affection is essential to feeling loved.", medium: "Touch helps you feel close.", low: "You’re fine with less physical contact." }
};
const obsGive = {
  Words: { high: "You naturally express love through compliments and encouragement.", medium: "You give words of affirmation when it feels right.", low: "You rarely use words to show love." },
  Acts:  { high: "You show love by doing things for your partner.", medium: "You help out when you can.", low: "You don’t often express love through actions." },
  Gifts: { high: "You love giving thoughtful, meaningful gifts.", medium: "You give gifts on special occasions.", low: "Gifts aren’t your go-to way of showing love." },
  Time:  { high: "You express love by being fully present.", medium: "You make time when it matters.", low: "You’re not big on giving focused time." },
  Touch: { high: "You’re very affectionate and use touch to show love.", medium: "You use appropriate touch to connect.", low: "You’re not very physically expressive." }
};

let soloChart, chart1, chart2;

// === BUILD SLIDERS ===
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

// === CREATE CHART ===
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

// === GET DATA ===
function getData(prefix) {
  const rec = labels.map(l => +document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value);
  const give = labels.map(l => +document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value);
  return { rec, give };
}

// === UPDATE CHARTS & VALUES ===
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

// === OBSERVATION TEXT ===
function getObs(key, score, isReceive) {
  const set = isReceive ? obsReceive : obsGive;
  const cat = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
  return set[key][cat];
}

// === SOLO REPORT ===
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

// === COUPLE REPORT – THERAPIST READY ===
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
    return max > 3
      ? `<strong>Love Gap:</strong> <em>${full[idx]}</em> – P1 gives ${p1.give[idx]}, P2 receives ${p2.rec[idx]}. <strong>High-risk mismatch.</strong>`
      : `<strong>Love Gap:</strong> Giving and receiving are well-aligned.`;
  };

  const topMatch = () => {
    const matches = labels.map((_, i) => Math.min(p1.give[i], p2.rec[i]));
    const best = Math.max(...matches);
    const idx = matches.indexOf(best);
    return `<strong>Mutual Strength:</strong> <em>${full[idx]}</em> (${best}/10)`;
  };

  const contention = () => {
    const issues = [];
    labels.forEach((l, i) => {
      if (p1.give[i] <= 3 && p2.rec[i] >= 7) issues.push(`P2 <strong>needs</strong> ${full[i]} (${p2.rec[i]}), but P1 gives ${p1.give[i]}.`);
      if (p2.give[i] <= 3 && p1.rec[i] >= 7) issues.push(`P1 <strong>needs</strong> ${full[i]} (${p1.rec[i]}), but P2 gives ${p2.give[i]}.`);
    });
    return issues.length > 0
      ? `<strong>Potential Conflict:</strong><ul><li>${issues.join('</li><li>')}</li></ul>`
      : `<em>No major unmet needs.</em>`;
  };

  const blindSpots = () => {
    const spots = [];
    labels.forEach((l, i) => {
      if (p1.give[i] >= 7 && p2.rec[i] <= 3) spots.push(`P1 gives a lot of ${full[i]}, but P2 doesn’t value it.`);
      if (p2.give[i] >= 7 && p1.rec[i] <= 3) spots.push(`P2 gives a lot of ${full[i]}, but P1 doesn’t value it.`);
    });
    return spots.length > 0
      ? `<strong>Blind Spots:</strong><ul><li>${spots.join('</li><li>')}</li></ul>`
      : `<em>No wasted effort.</em>`;
  };

  const prompts = () => {
    return `<strong>Discussion Starters:</strong>
      <ul>
        <li>“When was the last time you felt truly seen by your partner?”</li>
        <li>“What’s one small thing your partner does that makes you feel loved?”</li>
        <li>“Is there a love language you wish your partner understood better?”</li>
        <li>“How do you usually respond when your partner tries to show love in their way?”</li>
      </ul>`;
  };

  const html = `
    <h2 style="text-align:center">Couple Love Language Report</h2>
    <p style="text-align:center;font-style:italic;color:#7f8c8d">Use in therapy or date night.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
      <div>
        <h3>Person 1 – Receiving</h3>${cards(p1.rec, true)}
        <h3>Person 1 – Giving</h3>${cards(p1.give, false)}
      </div>
      <div>
        <h3>Person 2 – Receiving</h3>${cards(p2.rec, true)}
        <h3>Person 2 – Giving</h3>${cards(p2.give, false)}
      </div>
    </div>

    <div style="margin-top:2rem;padding:1.5rem;background:#fff3cd;border-radius:8px;font-size:0.95rem">
      <p class="love-gap">${loveGap()}</p>
      <p class="top-match">${topMatch()}</p>
      <div style="margin-top:1rem">${contention()}</div>
      <div style="margin-top:1rem">${blindSpots()}</div>
      <div style="margin-top:1.5rem">${prompts()}</div>
    </div>

    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn" onclick="document.getElementById('report').style.display='none'">Close Report</button>
    </div>`;

  const rep = document.getElementById('report');
  rep.innerHTML = html;
  rep.style.display = 'block';
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
    // Always rebuild couple mode
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

// === TOGGLE SLIDERS (COUPLE MODE) ===
function toggleSliders() {
  const cont = document.getElementById('slidersContainer');
  const btn = document.querySelector('.toggle-btn');
  const isHidden = cont.style.display === 'none' || !cont.style.display;
  cont.style.display = isHidden ? 'grid' : 'none';
  btn.textContent = isHidden ? 'Hide Sliders' : 'Show Sliders';
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

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkMode') === 'true';
  if (saved) {
    document.body.classList.add('dark');
    document.getElementById('darkModeBtn').textContent = 'Light Mode';
  }
  setMode('solo');
});
