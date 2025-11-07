// LoveSync App JavaScript - Full Implementation with Share Codes

const labels = ["Words", "Acts", "Gifts", "Time", "Touch"];
const full = [
  "Words of Affirmation",
  "Acts of Service",
  "Receiving Gifts",
  "Quality Time",
  "Physical Touch",
];

const emojiMap = {
  high: "❤️",
  medium: "💛",
  low: "🖤",
};

const obsReceive = {
  Words: {
    high: "You feel most loved when your partner says kind, affirming things.",
    medium: "Words of appreciation help you feel valued.",
    low: "You don't need many words to feel loved.",
  },
  Acts: {
    high: "You feel loved when your partner helps with tasks or responsibilities.",
    medium: "Acts of service make you feel supported.",
    low: "You're independent and don't rely on help to feel loved.",
  },
  Gifts: {
    high: "Thoughtful gifts make you feel remembered and cherished.",
    medium: "Small gifts on special days mean a lot.",
    low: "Gifts are nice but not your main way of feeling loved.",
  },
  Time: {
    high: "Undivided attention is how you feel most connected.",
    medium: "Quality time strengthens your bond.",
    low: "You're okay with less focused time.",
  },
  Touch: {
    high: "Physical affection is essential to feeling loved.",
    medium: "Touch helps you feel close.",
    low: "You're fine with less physical contact.",
  },
};

const obsGive = {
  Words: {
    high: "You naturally express love through compliments and encouragement.",
    medium: "You give words of affirmation when it feels right.",
    low: "You rarely use words to show love.",
  },
  Acts: {
    high: "You show love by doing things for your partner.",
    medium: "You help out when you can.",
    low: "You don't often express love through actions.",
  },
  Gifts: {
    high: "You love giving thoughtful, meaningful gifts.",
    medium: "You give gifts on special occasions.",
    low: "Gifts aren't your go-to way of showing love.",
  },
  Time: {
    high: "You express love by being fully present.",
    medium: "You make time when it matters.",
    low: "You're not big on giving focused time.",
  },
  Touch: {
    high: "You're very affectionate and use touch to show love.",
    medium: "You use appropriate touch to connect.",
    low: "You're not very physically expressive.",
  },
};

const praiseAffirmations = [
  "Your participation in this session shows hope and commitment.",
  "You both share the value of growth—which is a foundation for healing.",
  "Even small steps toward understanding are worth celebrating.",
  "Acknowledging each other's efforts can open doors to reconnection.",
  "Gratitude and appreciation can transform challenge into opportunity."
];

let soloChart, chart1, chart2;

// ==================== SHARE CODE FUNCTIONS ====================
// ==================== FIXED SHARE CODE FUNCTIONS ====================

function generateShareCode(data) {
  const values = [...data.rec, ...data.give];
  // Simple base64 encode without character replacement
  const encoded = btoa(values.join(','));
  // Return first 16 chars for better uniqueness
  return encoded.substring(0, 16).toUpperCase();
}

function parseShareCode(code) {
  try {
    // Try to decode directly
    const decoded = atob(code);
    const values = decoded.split(',').map(Number);
    
    // Validate: must have exactly 10 values, all between 0-10
    if (values.length !== 10) {
      console.log("Invalid code length:", values.length);
      return null;
    }
    
    if (values.some(v => isNaN(v) || v < 0 || v > 10)) {
      console.log("Invalid values:", values);
      return null;
    }
    
    return {
      rec: values.slice(0, 5),
      give: values.slice(5, 10)
    };
  } catch(e) {
    console.error("Decode error:", e);
    return null;
  }
}

function applyDataToSliders(prefix, data) {
  labels.forEach((l, i) => {
    const recSlider = document.getElementById(`${prefix}rec${l.toLowerCase()}`);
    const giveSlider = document.getElementById(`${prefix}give${l.toLowerCase()}`);
    if (recSlider && giveSlider) {
      recSlider.value = data.rec[i];
      giveSlider.value = data.give[i];
      document.getElementById(`val${prefix}rec${l.toLowerCase()}`).textContent = data.rec[i];
      document.getElementById(`val${prefix}give${l.toLowerCase()}`).textContent = data.give[i];
    }
  });
  updateCharts();
}

// Solo Share Code
function generateSoloShareCode() {
  const data = getData("solo");
  const code = generateShareCode(data);
  document.getElementById("solo-share-code").value = code;
  document.getElementById("solo-share-display").classList.remove("hidden");
}

function copySoloCode() {
  const codeInput = document.getElementById("solo-share-code");
  codeInput.select();
  codeInput.setSelectionRange(0, 99999);
  
  try {
    document.execCommand("copy");
    showToast("✓ Code copied!");
  } catch(e) {
    navigator.clipboard.writeText(codeInput.value).then(() => {
      showToast("✓ Code copied!");
    }).catch(() => {
      showToast("⚠ Copy manually");
    });
  }
}

// Person 1 Share Code
function generateP1ShareCode() {
  const data = getData("p1");
  const code = generateShareCode(data);
  document.getElementById("p1-share-code").value = code;
  document.getElementById("p1-share-display").classList.remove("hidden");
}

function copyP1Code() {
  const codeInput = document.getElementById("p1-share-code");
  codeInput.select();
  codeInput.setSelectionRange(0, 99999);
  
  try {
    document.execCommand("copy");
    showToast("✓ Person 1 code copied!");
  } catch(e) {
    navigator.clipboard.writeText(codeInput.value).then(() => {
      showToast("✓ Person 1 code copied!");
    }).catch(() => {
      showToast("⚠ Copy manually");
    });
  }
}

// Person 2 Share Code
function generateP2ShareCode() {
  const data = getData("p2");
  const code = generateShareCode(data);
  document.getElementById("p2-share-code").value = code;
  document.getElementById("p2-share-display").classList.remove("hidden");
}

function copyP2Code() {
  const codeInput = document.getElementById("p2-share-code");
  codeInput.select();
  codeInput.setSelectionRange(0, 99999);
  
  try {
    document.execCommand("copy");
    showToast("✓ Person 2 code copied!");
  } catch(e) {
    navigator.clipboard.writeText(codeInput.value).then(() => {
      showToast("✓ Person 2 code copied!");
    }).catch(() => {
      showToast("⚠ Copy manually");
    });
  }
}

// Load Partner Code - FIXED
function loadPartnerCode() {
  const code = document.getElementById("partner-code-input").value.trim().toUpperCase();
  const statusEl = document.getElementById("code-status");
  
  if (!code) {
    statusEl.textContent = "⚠ Please enter a code";
    statusEl.style.color = "#f1c40f";
    return;
  }
  
  const data = parseShareCode(code);
  
  if (data) {
    applyDataToSliders("p1", data);
    statusEl.textContent = "✓ Partner data loaded successfully!";
    statusEl.style.color = "#2ecc71";
    
    // Show sliders if hidden
    const slidersContainer = document.getElementById("slidersContainer");
    if (slidersContainer.style.display === "none") {
      toggleSliders();
    }
    
    // Clear input after successful load
    document.getElementById("partner-code-input").value = "";
  } else {
    statusEl.textContent = "✗ Invalid code. Please verify and try again.";
    statusEl.style.color = "#e74c3c";
  }
}

// Toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #2ecc71;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease-out;
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slideDown 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ==================== CORE FUNCTIONS ====================

function isDarkMode() {
  return document.body.classList.contains("dark");
}

function showOnboardingOnce() {
  if (!localStorage.getItem("seenOnboarding")) {
    document.getElementById("onboarding-overlay").classList.remove("hidden");
    localStorage.setItem("seenOnboarding", "true");
  }
}

function closeOnboarding() {
  document.getElementById("onboarding-overlay").classList.add("hidden");
}

function buildSliders(containerId, prefix) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = labels.map((l, i) => `
    <div class="slider-row">
      <label for="${prefix}rec${l.toLowerCase()}">${full[i]} Receive</label>
      <input type="range" id="${prefix}rec${l.toLowerCase()}" min="0" max="10" value="5"
        aria-label="${full[i]} receive slider" oninput="updateCharts()" />
      <span id="val${prefix}rec${l.toLowerCase()}">5</span>
    </div>
    <div class="slider-row">
      <label for="${prefix}give${l.toLowerCase()}">${full[i]} Give</label>
      <input type="range" id="${prefix}give${l.toLowerCase()}" min="0" max="10" value="5"
        aria-label="${full[i]} give slider" oninput="updateCharts()" />
      <span id="val${prefix}give${l.toLowerCase()}">5</span>
    </div>
  `).join('');
}

function createChart(canvasId, rec, give) {
  const dark = isDarkMode();
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Receive",
          data: rec,
          backgroundColor: "rgba(52,152,219,0.2)",
          borderColor: "#3498db",
          pointBackgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e74c3c"],
          pointBorderColor: "#fff",
          borderWidth: 2,
          fill: true,
        },
        {
          label: "Give",
          data: give,
          backgroundColor: "rgba(46,204,113,0.2)",
          borderColor: "#2ecc71",
          pointBackgroundColor: Array(5).fill("#2ecc71"),
          pointBorderColor: "#fff",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutQuad" },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            color: dark ? "#e0e0e0" : "#2c3e50",
            backdropColor: "transparent",
          },
          grid: {
            color: dark ? "rgba(187,209,234,0.3)" : "rgba(44,62,80,0.2)",
          },
          angleLines: {
            color: dark ? "rgba(187,209,234,0.7)" : "rgba(44,62,80,0.4)",
          },
          pointLabels: {
            font: { size: 13, weight: "600" },
            color: dark ? "#bbe3cc" : "#2c3e50",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: dark ? "#bbd1ea" : "#2c3e50",
            font: { weight: "bold", size: 13 },
          },
        },
      },
    },
  });
}

function getData(prefix) {
  const rec = labels.map(
    (l) => Number(document.getElementById(`${prefix}rec${l.toLowerCase()}`).value)
  );
  const give = labels.map(
    (l) => Number(document.getElementById(`${prefix}give${l.toLowerCase()}`).value)
  );
  return { rec, give };
}

function updateCharts() {
  ["solo", "p1", "p2"].forEach((prefix) => {
    labels.forEach((l) => {
      const recVal = document.getElementById(`${prefix}rec${l.toLowerCase()}`);
      const giveVal = document.getElementById(`${prefix}give${l.toLowerCase()}`);
      if (recVal && giveVal) {
        document.getElementById(`val${prefix}rec${l.toLowerCase()}`).textContent = recVal.value;
        document.getElementById(`val${prefix}give${l.toLowerCase()}`).textContent = giveVal.value;
      }
    });
  });

  if (document.getElementById("solo-container").style.display !== "none") {
    const data = getData("solo");
    if (soloChart) {
      soloChart.data.datasets[0].data = data.rec;
      soloChart.data.datasets[1].data = data.give;
      soloChart.update();
    } else {
      soloChart = createChart("solo-chart", data.rec, data.give);
    }
  } else {
    const p1 = getData("p1");
    const p2 = getData("p2");
    if (chart1 && chart2) {
      chart1.data.datasets[0].data = p1.rec;
      chart1.data.datasets[1].data = p1.give;
      chart2.data.datasets[0].data = p2.rec;
      chart2.data.datasets[1].data = p2.give;
      chart1.update();
      chart2.update();
    } else {
      chart1 = createChart("chart1", p1.rec, p1.give);
      chart2 = createChart("chart2", p2.rec, p2.give);
    }
  }
}

function getObs(key, score, isReceive) {
  const set = isReceive ? obsReceive[key] : obsGive[key];
  if (score >= 7) {
    return { text: set.high, level: "high", emoji: emojiMap.high };
  } else if (score >= 4) {
    return { text: set.medium, level: "medium", emoji: emojiMap.medium };
  } else {
    return { text: set.low, level: "low", emoji: emojiMap.low };
  }
}

function generateSingleLanguageCard(data, isReceive, i, prefix) {
  const score = isReceive ? data.rec[i] : data.give[i];
  const obs = getObs(labels[i], score, isReceive);
  return `<div class="language-card score-${obs.level}" data-emoji="${obs.emoji}">
    <strong>${full[i]}</strong>: ${obs.text} <span>(Score: ${score}/10)</span>
  </div>`;
}

function generatePairedLanguageRows(p1Data, p2Data, isReceive) {
  return labels.map((l, i) => {
    const p1Card = generateSingleLanguageCard(p1Data, isReceive, i, "p1");
    const p2Card = generateSingleLanguageCard(p2Data, isReceive, i, "p2");
    return `<div class="paired-row">${p1Card}${p2Card}</div>`;
  }).join("");
}

function getPraise() {
  return praiseAffirmations[Math.floor(Math.random() * praiseAffirmations.length)];
}

function buildGraphWarnings(p1, p2) {
  const gaps = labels.map((l, i) => Math.abs(p1.give[i] - p2.rec[i]));
  const maxGap = Math.max(...gaps);
  const maxIndex = gaps.indexOf(maxGap);

  if (maxGap >= 3) {
    return `
    <div class="report-section warning-section">
      <div class="report-icon">⚠️</div>
      <div>
        <strong>Potential Love Gap:</strong>
        <span>There is a strong mismatch in <em>${full[maxIndex]}</em> (gap of ${maxGap}). 
        This can sometimes lead to misunderstandings or unmet needs.<br/>
        <b>Therapist prompt:</b> <i>How do you both feel when needs go unmet in this area? 
        What has worked in the past to bridge this gap?</i></span>
      </div>
    </div>
    <div class="report-section insight-section">
      <div class="report-icon">💡</div>
      <span>Some emotional or communication challenges may reflect underlying hurt, not lack of caring. 
      If talking about these feelings triggers defensiveness or withdrawal, try pressing pause and 
      offering gentle reassurance to each other first.</span>
    </div>`;
  } else {
    return `
    <div class="report-section good-news-section">
      <div class="report-icon">🌱</div>
      <strong>Alignment:</strong> Your love languages are largely in sync! Use this as a foundation 
      for ongoing connection and support.
    </div>`;
  }
}

function buildPraiseSection(p1, p2) {
  const shared = labels.filter((l, i) => p1.rec[i] >= 7 && p2.rec[i] >= 7);
  let praiseHtml = `
  <div class="report-section praise-section">
    <div class="report-icon">🌟</div>
    <div>
      <strong>Praise & Affirmation:</strong>
      <ul style="margin:0.5rem 0; padding-left:1.5rem;">
        <li>${getPraise()}</li>`;

  if (shared.length > 0) {
    praiseHtml += `<li>You both highly value <strong>${shared.map(l => full[labels.indexOf(l)]).join(", ")}</strong>—this is a great strength!</li>`;
  } else {
    praiseHtml += `<li>Just by engaging in this exercise, you are showing care and willingness to grow together.</li>`;
  }

  praiseHtml += `
        <li>Try naming one thing your partner does, even if it's small, that you appreciate this week.</li>
      </ul>
    </div>
  </div>`;
  return praiseHtml;
}

function showSoloReport() {
  const data = getData("solo");
  const cardsReceive = labels.map((l, i) => generateSingleLanguageCard(data, true, i, "solo")).join("");
  const cardsGive = labels.map((l, i) => generateSingleLanguageCard(data, false, i, "solo")).join("");

  const html = `
    <h2 style="text-align:center;">Your Love Profile Report</h2>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <div><h3>Receiving</h3>${cardsReceive}</div>
      <div><h3>Giving</h3>${cardsGive}</div>
    </div>
    <div style="text-align:center; margin-top:1.5rem;">
      <button class="btn" onclick="closeReport()">Close Report</button>
    </div>
  `;

  const rep = document.getElementById("report");
  rep.innerHTML = html;
  rep.style.display = "block";
  rep.focus();
  window.scrollTo({ top: rep.offsetTop - 20, behavior: "smooth" });
}

function showCoupleReport() {
  const p1 = getData("p1");
  const p2 = getData("p2");

  const html = `
    <h2 style="text-align:center;">Couple Love Language Report</h2>
    ${buildPraiseSection(p1, p2)}
    
    <div class="charts-grid">
      <div class="chart-container">
        <h3>Receiving Comparison</h3>
        <canvas id="compare-chart-receive"></canvas>
      </div>
      <div class="chart-container">
        <h3>Giving Comparison</h3>
        <canvas id="compare-chart-give"></canvas>
      </div>
    </div>
    
    ${buildGraphWarnings(p1, p2)}
    
    <div>
      <h3>Receiving</h3>
      <div class="paired-columns">${generatePairedLanguageRows(p1, p2, true)}</div>
    </div>
    <div>
      <h3>Giving</h3>
      <div class="paired-columns">${generatePairedLanguageRows(p1, p2, false)}</div>
    </div>
    <div style="text-align:center; margin-top: 1.5rem;">
      <button class="btn" onclick="closeReport()">Close Report</button>
    </div>
  `;

  const rep = document.getElementById("report");
  rep.innerHTML = html;
  rep.style.display = "block";
  rep.focus();

  const dark = isDarkMode();

  const ctxReceive = document.getElementById("compare-chart-receive").getContext("2d");
  if (window.compareChartReceive) window.compareChartReceive.destroy();
  
  window.compareChartReceive = new Chart(ctxReceive, {
    type: "radar",
    data: {
      labels,
      datasets: [
        { label: "Person 1 Receive", data: p1.rec, backgroundColor: "rgba(52,152,219,0.2)", 
          borderColor: "#3498db", borderWidth: 2, pointBackgroundColor: "#3498db" },
        { label: "Person 2 Receive", data: p2.rec, backgroundColor: "rgba(231,76,60,0.14)", 
          borderColor: "#e74c3c", borderWidth: 2, pointBackgroundColor: "#e74c3c" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 800, easing: "easeOutCirc" },
      plugins: { legend: { labels: { color: dark ? "#bbd1ea" : "#2c3e50", font: { weight: "bold", size: 13 }}}},
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { stepSize: 2, color: dark ? "#e0e0e0" : "#2c3e50" },
          grid: { color: dark ? "rgba(187,209,234,0.3)" : "rgba(44,62,80,0.2)" },
          angleLines: { color: dark ? "rgba(187,209,234,0.7)" : "rgba(44,62,80,0.4)" },
          pointLabels: { font: { size: 12, weight: "bold" }, color: dark ? "#bbe3cc" : "#2c3e50" },
        },
      },
    },
  });

  const ctxGive = document.getElementById("compare-chart-give").getContext("2d");
  if (window.compareChartGive) window.compareChartGive.destroy();
  
  window.compareChartGive = new Chart(ctxGive, {
    type: "radar",
    data: {
      labels,
      datasets: [
        { label: "Person 1 Give", data: p1.give, backgroundColor: "rgba(46,204,113,0.2)", 
          borderColor: "#2ecc71", borderWidth: 2, pointBackgroundColor: "#2ecc71" },
        { label: "Person 2 Give", data: p2.give, backgroundColor: "rgba(241,196,15,0.2)", 
          borderColor: "#f1c40f", borderWidth: 2, pointBackgroundColor: "#f1c40f" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 800, easing: "easeOutCirc" },
      plugins: { legend: { labels: { color: dark ? "#bbd1ea" : "#2c3e50", font: { weight: "bold", size: 13 }}}},
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { stepSize: 2, color: dark ? "#e0e0e0" : "#2c3e50" },
          grid: { color: dark ? "rgba(187,209,234,0.3)" : "rgba(44,62,80,0.2)" },
          angleLines: { color: dark ? "rgba(187,209,234,0.7)" : "rgba(44,62,80,0.4)" },
          pointLabels: { font: { size: 12, weight: "bold" }, color: dark ? "#bbe3cc" : "#2c3e50" },
        },
      },
    },
  });

  window.scrollTo({ top: rep.offsetTop - 20, behavior: "smooth" });
}

function closeReport() {
  document.getElementById("report").style.display = "none";
}

function setMode(mode) {
  // PRESERVE SOLO DATA when switching to couple mode
  let soloData = null;
  const currentMode = document.getElementById("solo-container").style.display !== "none" ? "solo" : "couple";
  
  // If switching FROM solo TO couple, save solo data
  if (currentMode === "solo" && mode === "couple") {
    try {
      soloData = getData("solo");
      console.log("Preserving solo data:", soloData);
    } catch(e) {
      console.log("No solo data to preserve");
    }
  }
  
  // Update UI
  document.querySelectorAll(".mode-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
    activeBtn.setAttribute("aria-selected", "true");
  }

  document.getElementById("solo-container").style.display = mode === "solo" ? "block" : "none";
  document.getElementById("couple-container").style.display = mode === "couple" ? "block" : "none";
  document.getElementById("page-title").textContent = `LoveSync ${mode === "solo" ? "Solo" : "Couple"} Mode`;

  if (mode === "solo") {
    if (!soloChart) {
      const data = getData("solo");
      soloChart = createChart("solo-chart", data.rec, data.give);
    }
  } else if (mode === "couple") {
    // Apply preserved solo data to Person 1
    if (soloData) {
      applyDataToSliders("p1", soloData);
      showToast("✓ Your data transferred to Person 1");
    }
    
    const p1 = getData("p1");
    const p2 = getData("p2");
    
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();
    
    chart1 = createChart("chart1", p1.rec, p1.give);
    chart2 = createChart("chart2", p2.rec, p2.give);
  }
}

function toggleSliders() {
  const cont = document.getElementById("slidersContainer");
  const btn = document.querySelector(".toggle-btn");
  const isHidden = cont.style.display === "none";
  cont.style.display = isHidden ? "flex" : "none";
  btn.textContent = isHidden ? "📊 Hide Assessment Sliders" : "📊 Show Assessment Sliders";
}

function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("darkModeBtn");
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  btn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("darkMode", isDark);
  
  if (soloChart) soloChart.destroy();
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();
  if (window.compareChartReceive) window.compareChartReceive.destroy();
  if (window.compareChartGive) window.compareChartGive.destroy();
  
  soloChart = null;
  chart1 = null;
  chart2 = null;
  window.compareChartReceive = null;
  window.compareChartGive = null;
  
  updateCharts();
}

function toggleDarkModeInit() {
  const saved = localStorage.getItem("darkMode");
  if (saved === "true") {
    document.body.classList.add("dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️ Light";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildSliders("solo-sliders", "solo");
  buildSliders("p1-sliders", "p1");
  buildSliders("p2-sliders", "p2");
  setMode("solo");
  toggleDarkModeInit();
  showOnboardingOnce();
});
