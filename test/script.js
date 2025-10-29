// LoveSync App JavaScript

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
  const firstSlider = document.querySelector("input[type=range]");
  if (firstSlider) firstSlider.focus();
}

function buildSliders(containerId, prefix) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = labels.map((l, i) => `
    <div class="slider-row">
      <label for="${prefix}rec${l.toLowerCase()}" title="${full[i]} Receive Preference">${full[i]} Receive</label>
      <input type="range" id="${prefix}rec${l.toLowerCase()}" min="0" max="10" value="5"
        aria-valuemin="0" aria-valuemax="10" aria-valuenow="5"
        aria-label="${full[i]} receive preference slider"
        oninput="updateCharts()" />
      <span id="val${prefix}rec${l.toLowerCase()}">5</span>
    </div>
    <div class="slider-row">
      <label for="${prefix}give${l.toLowerCase()}" title="${full[i]} Give Preference">${full[i]} Give</label>
      <input type="range" id="${prefix}give${l.toLowerCase()}" min="0" max="10" value="5"
        aria-valuemin="0" aria-valuemax="10" aria-valuenow="5"
        aria-label="${full[i]} give preference slider"
        oninput="updateCharts()" />
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
          pointBackgroundColor: [
            "#3498db",
            "#2ecc71",
            "#f1c40f",
            "#9b59b6",
            "#e74c3c",
          ],
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
      animation: {
        duration: 600,
        easing: "easeOutQuad",
      },
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
            font: { size: 14, weight: "600" },
            color: dark ? "#bbe3cc" : "#2c3e50",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: dark ? "#bbd1ea" : "#2c3e50",
            font: { weight: "bold", size: 14 },
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
        document.getElementById(`val${prefix}rec${l.toLowerCase()}`).textContent =
          recVal.value;
        document.getElementById(`val${prefix}give${l.toLowerCase()}`).textContent =
          giveVal.value;
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

// For paired row rendering
function generateSingleLanguageCard(data, isReceive, i, prefix) {
  const score = isReceive ? data.rec[i] : data.give[i];
  const obs = getObs(labels[i], score, isReceive);
  return `<div class="language-card score-${obs.level}" data-emoji="${obs.emoji}" style="flex:1; min-width:190px;">
    <strong>${full[i]}</strong>: ${obs.text} <span>(Score: ${score}/10)</span>
  </div>`;
}

function generatePairedLanguageRows(p1Data, p2Data, isReceive) {
  const out = [];
  labels.forEach((l, i) => {
    const p1Card = generateSingleLanguageCard(p1Data, isReceive, i, "p1");
    const p2Card = generateSingleLanguageCard(p2Data, isReceive, i, "p2");
    out.push(`
      <div class="paired-row">
        ${p1Card}
        ${p2Card}
      </div>
    `);
  });
  return out.join("");
}

function getPraise() {
  const idx = Math.floor(Math.random() * praiseAffirmations.length);
  return praiseAffirmations[idx];
}

function buildGraphWarnings(p1, p2) {
  const gaps = labels.map((l, i) => Math.abs(p1.give[i] - p2.rec[i]));
  const maxGap = Math.max(...gaps);
  const maxIndex = gaps.indexOf(maxGap);

  let warningHtml = "";
  if (maxGap >= 3) {
    warningHtml = `
    <div class="report-section warning-section">
      <div class="report-icon" aria-hidden="true">⚠️</div>
      <strong>Potential Love Gap:</strong>
      <span>There is a strong mismatch in <em>${full[maxIndex]}</em> (gap of ${maxGap}). This can sometimes lead to misunderstandings or unmet needs. <br />
      <b>Therapist prompt:</b> <i>How do you both feel when needs go unmet in this area? What has worked in the past to bridge this gap?</i></span>
    </div>
    <div class="report-section insight-section">
      <div class="report-icon" aria-hidden="true">💡</div>
      <span>Some emotional or communication challenges may reflect underlying hurt, not lack of caring. If talking about these feelings triggers defensiveness or withdrawal, try pressing pause and offering gentle reassurance to each other first.</span>
    </div>
    `;
  } else {
    warningHtml = `
    <div class="report-section good-news-section">
      <div class="report-icon" aria-hidden="true">🌱</div>
      <strong>Alignment:</strong> Your love languages are largely in sync! Use this as a foundation for ongoing connection and support.
    </div>`;
  }
  return warningHtml;
}

function buildPraiseSection(p1, p2) {
  const shared = labels.filter(
    (l, i) =>
      p1.rec[i] >= 7 && p2.rec[i] >= 7
  );
  let praiseHtml = `
  <div class="report-section praise-section">
    <div class="report-icon" aria-hidden="true">🌟</div>
    <strong>Praise & Affirmation:</strong>
    <ul>
      <li>${getPraise()}</li>
  `;

  if (shared.length > 0) {
    praiseHtml += `<li>You both highly value <strong>${shared
      .map((l) => full[labels.indexOf(l)])
      .join(", ")}</strong>—this is a great strength!</li>`;
  } else {
    praiseHtml += `<li>Just by engaging in this exercise, you are showing care and willingness to grow together.</li>`;
  }

  praiseHtml += `
      <li>Try naming one thing your partner does, even if it's small, that you appreciate this week.</li>
    </ul>
  </div>
  `;
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
}

function showCoupleReport() {
  const p1 = getData("p1");
  const p2 = getData("p2");

  const html = `
    <h2 style="text-align:center;">Couple Love Language Report</h2>
    ${buildPraiseSection(p1, p2)}
    <div style="margin: 1rem 0;">
      <canvas id="compare-chart" width="340" height="220" style="margin:0 auto;display:block;"></canvas>
    </div>
    ${buildGraphWarnings(p1, p2)}
    <div>
      <h3>Receiving</h3>
      <div class="paired-columns">
        ${generatePairedLanguageRows(p1, p2, true)}
      </div>
    </div>
    <div>
      <h3>Giving</h3>
      <div class="paired-columns">
        ${generatePairedLanguageRows(p1, p2, false)}
      </div>
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
  const ctx = document.getElementById("compare-chart").getContext("2d");

  if (window.compareChart) {
    window.compareChart.destroy();
  }

  window.compareChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Person 1 Receive",
          data: p1.rec,
          backgroundColor: "rgba(52,152,219,0.2)",
          borderColor: "#3498db",
          borderWidth: 2,
          pointBackgroundColor: "#3498db",
        },
        {
          label: "Person 2 Receive",
          data: p2.rec,
          backgroundColor: "rgba(231,76,60,0.14)",
          borderColor: "#e74c3c",
          borderWidth: 2,
          pointBackgroundColor: "#e74c3c",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutCirc" },
      plugins: {
        legend: {
          labels: {
            color: dark ? "#bbd1ea" : "#2c3e50",
            font: { weight: "bold", size: 13 },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: { stepSize: 2, color: dark ? "#e0e0e0" : "#2c3e50" },
          pointLabels: {
            font: { size: 12, weight: "bold" },
            color: dark ? "#bbe3cc" : "#2c3e50",
          },
        },
      },
    },
  });
}

function closeReport() {
  document.getElementById("report").style.display = "none";
}

function setMode(mode) {
  document.querySelectorAll(".mode-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
    b.setAttribute("tabindex", "-1");
  });
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
    activeBtn.setAttribute("aria-selected", "true");
    activeBtn.setAttribute("tabindex", "0");
  }

  document.getElementById("solo-container").style.display = mode === "solo" ? "block" : "none";
  document.getElementById("couple-container").style.display = mode === "couple" ? "block" : "none";
  document.getElementById("page-title").textContent = `LoveSync ${mode === "solo" ? "Solo" : "Couple"} Mode`;

  if (mode === "solo" && !soloChart) {
    const data = getData("solo");
    soloChart = createChart("solo-chart", data.rec, data.give);
  } else if (mode === "couple") {
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
  cont.style.display = isHidden ? "grid" : "none";
  btn.textContent = isHidden ? "Hide Sliders" : "Show Sliders";
}

function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("darkModeBtn");
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  btn.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("darkMode", isDark);
  // Refresh charts to update text colors
  if (soloChart) soloChart.destroy();
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();
  if (window.compareChart) window.compareChart.destroy();
  updateCharts();
}

function toggleDarkModeInit() {
  const saved = localStorage.getItem("darkMode");
  if (saved === "true") {
    document.body.classList.add("dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "Light Mode";
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
