// Labels and full names
const labels = ["Words", "Acts", "Gifts", "Time", "Touch"];
const full = [
  "Words of Affirmation",
  "Acts of Service",
  "Receiving Gifts",
  "Quality Time",
  "Physical Touch",
];

// Emojis for observations by score level
const emojiMap = {
  high: "❤️",
  medium: "💛",
  low: "🖤",
};

// Observation texts same as before – shortened here for brevity
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
// Positive affirmations, color codes for praise and warnings
const praiseAffirmations = [
  "Your participation in this session shows hope and commitment.",
  "You both share the value of growth—which is a foundation for healing.",
  "Even small steps toward understanding are worth celebrating.",
  "Acknowledging each other's efforts can open doors to reconnection.",
  "Gratitude and appreciation can transform challenge into opportunity."
];

// Randomly choose a praise to display
function getPraise() {
  const idx = Math.floor(Math.random() * praiseAffirmations.length);
  return praiseAffirmations[idx];
}

// Colorful warning and praise message blocks
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
function isDarkMode() {
  return document.body.classList.contains("dark");
}
// Build strengths (praise) section based on overlapping high scores or effort
function buildPraiseSection(p1, p2) {
  // Look for shared strengths
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
    praiseHtml += `<li>You both highly value <strong>${shared.map(
      (l) => full[labels.indexOf(l)]
    ).join(", ")}</strong>—this is a great strength!</li>`;
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

// In your showCoupleReport function, insert these inside your report HTML
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
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <div>
        <h3>Person 1 Receiving</h3>${generateLanguageCards(p1, true, "p1")}
        <h3>Person 1 Giving</h3>${generateLanguageCards(p1, false, "p1")}
      </div>
      <div>
        <h3>Person 2 Receiving</h3>${generateLanguageCards(p2, true, "p2")}
        <h3>Person 2 Giving</h3>${generateLanguageCards(p2, false, "p2")}
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

  // Optional: Add a side-by-side radar chart, if you wish:
  const ctx = document.getElementById("compare-chart").getContext("2d");
  new Chart(ctx, {
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
          pointBackgroundColor: "#3498db"
        },
        {
          label: "Person 2 Receive",
          data: p2.rec,
          backgroundColor: "rgba(231,76,60,0.14)",
          borderColor: "#e74c3c",
          borderWidth: 2,
          pointBackgroundColor: "#e74c3c"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutCirc" },
      plugins: {
        legend: { labels: {color: "#2c3e50", font: {weight: "bold", size: 13}} },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: { stepSize: 2 },
          pointLabels: { font: {size: 12, weight: "bold"} }
        },
      },
    }
  });
}

// Chart variables
let soloChart, chart1, chart2;

// Function to build sliders with accessible labels and proper ARIA roles for speed on mobile
function buildSliders(containerId, prefix) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = labels
    .map((l) => {
      return `
    <div class="slider-row">
      <label for="${prefix}rec${l.toLowerCase()}" title="${full[labels.indexOf(l)]} Receive Preference">${full[labels.indexOf(l)]} Receive</label>
      <input type="range" id="${prefix}rec${l.toLowerCase()}" min="0" max="10" value="5" 
        aria-valuemin="0" aria-valuemax="10" aria-valuenow="5" 
        aria-label="${full[labels.indexOf(l)]} receive preference slider"
        oninput="updateCharts()" />
      <span id="val${prefix}rec${l.toLowerCase()}">5</span>
    </div>
    <div class="slider-row">
      <label for="${prefix}give${l.toLowerCase()}" title="${full[labels.indexOf(l)]} Give Preference">${full[labels.indexOf(l)]} Give</label>
      <input type="range" id="${prefix}give${l.toLowerCase()}" min="0" max="10" value="5" 
        aria-valuemin="0" aria-valuemax="10" aria-valuenow="5" 
        aria-label="${full[labels.indexOf(l)]} give preference slider"
        oninput="updateCharts()" />
      <span id="val${prefix}give${l.toLowerCase()}">5</span>
    </div>
  `;
    })
    .join("");
}

// Build sliders initially
document.addEventListener("DOMContentLoaded", () => {
  buildSliders("solo-sliders", "solo");
  buildSliders("p1-sliders", "p1");
  buildSliders("p2-sliders", "p2");
  setMode("solo");
  toggleDarkModeInit();
  showOnboardingOnce();
});

function createChart(canvasId, rec, give) {
  const dark = isDarkMode();
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "radar",
    data: { ... }, // as before
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
            color: dark ? "#e0e0e0" : "#2c3e50", // improved for dark mode
            backdropColor: "transparent",
          },
          grid: {
            color: dark ? "rgba(187,209,234,0.3)" : "rgba(44,62,80,0.2)"
          },
          angleLines: {
            color: dark ? "rgba(187,209,234,0.7)" : "rgba(44,62,80,0.4)"
          },
          pointLabels: {
            font: { size: 14, weight: "600" },
            color: dark ? "#bbe3cc" : "#2c3e50"
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: dark ? "#bbd1ea" : "#2c3e50",
            font: { weight: "bold", size: 14 }
          }
        }
      }
    }
  });
}


// Data extraction from slider inputs
function getData(prefix) {
  const rec = labels.map(
    (l) => Number(document.getElementById(`${prefix}rec${l.toLowerCase()}`).value)
  );
  const give = labels.map(
    (l) => Number(document.getElementById(`${prefix}give${l.toLowerCase()}`).value)
  );
  return { rec, give };
}

// Update slider values text and chart datasets
function updateCharts() {
  // Update slider numeric value display
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

// Observations with emoji based on score threshold
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

// Generate language cards with emoji and color-coded score levels
function generateLanguageCards(data, isReceive, prefix) {
  return labels
    .map((l, i) => {
      const score = isReceive ? data.rec[i] : data.give[i];
      const obs = getObs(l, score, isReceive);
      return `<div class="language-card score-${obs.level}" data-emoji="${obs.emoji}">
        <strong>${full[i]}</strong>: ${obs.text} <span>(Score: ${score}/10)</span>
      </div>`;
    })
    .join("");
}

// SOLO REPORT GENERATION
function showSoloReport() {
  const data = getData("solo");
  const cardsReceive = generateLanguageCards(data, true, "solo");
  const cardsGive = generateLanguageCards(data, false, "solo");

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

// Close the report overlay
function closeReport() {
  document.getElementById("report").style.display = "none";
}

// COUPLE REPORT GENERATION
function showCoupleReport() {
  const p1 = getData("p1");
  const p2 = getData("p2");

  // Helper to build cards
  function cards(data, isReceive, prefix) {
    return labels
      .map((l, i) => {
        const score = isReceive ? data.rec[i] : data.give[i];
        const obs = getObs(l, score, isReceive);
        return `<div class="language-card score-${obs.level}" data-emoji="${obs.emoji}">
          <strong>${full[i]}</strong>: ${obs.text} <span>(Score: ${score}/10)</span>
        </div>`;
      })
      .join("");
  }

  // Love Gap calculation for discussion
  const gaps = labels.map(
    (l, i) => Math.abs(p1.give[i] - p2.rec[i])
  );
  const maxGap = Math.max(...gaps);
  const maxIndex = gaps.indexOf(maxGap);

  let loveGapHtml = "";
  if (maxGap >= 3) {
    loveGapHtml = `<p class="love-gap"><strong>Love Gap</strong>: There is a high mismatch in <em>${full[maxIndex]}</em> (gap of ${maxGap}), which might require extra attention in your relationship.</p>`;
  } else {
    loveGapHtml = `<p class="love-gap">Giving and receiving are well-aligned across all love languages.</p>`;
  }

  // Other insightful blocks can be added here as needed (blind spots, discussion prompts)...

  const html = `
    <h2 style="text-align:center;">Couple Love Language Report</h2>
    <p style="text-align:center; font-style:italic; color:#7f8c8d;">Use in therapy or date night.</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <div>
        <h3>Person 1 Receiving</h3>${cards(p1, true, "p1")}
        <h3>Person 1 Giving</h3>${cards(p1, false, "p1")}
      </div>
      <div>
        <h3>Person 2 Receiving</h3>${cards(p2, true, "p2")}
        <h3>Person 2 Giving</h3>${cards(p2, false, "p2")}
      </div>
    </div>
    <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3f3; border-radius: 8px; font-size: 1rem;">
      ${loveGapHtml}
    </div>
    <div style="text-align:center; margin-top: 1.5rem;">
      <button class="btn" onclick="closeReport()">Close Report</button>
    </div>
  `;

  const rep = document.getElementById("report");
  rep.innerHTML = html;
  rep.style.display = "block";
  rep.focus();
}

// Mode switching logic with ARIA updates
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

// Toggle sliders in couple mode
function toggleSliders() {
  const cont = document.getElementById("slidersContainer");
  const btn = document.querySelector(".toggle-btn");
  const isHidden = cont.style.display === "none";
  cont.style.display = isHidden ? "grid" : "none";
  btn.textContent = isHidden ? "Hide Sliders" : "Show Sliders";
}

// Dark mode toggle initialization and toggle button update
function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("darkModeBtn");
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  btn.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("darkMode", isDark);
}

function toggleDarkModeInit() {
  const saved = localStorage.getItem("darkMode");
  if (saved === "true") {
    document.body.classList.add("dark");
    document.getElementById("darkModeBtn").textContent = "Light Mode";
  }
  updateCharts();
}

// Onboarding overlay - show only once per client device
function showOnboardingOnce() {
  if (!localStorage.getItem("seenOnboarding")) {
    document.getElementById("onboarding-overlay").classList.remove("hidden");
    localStorage.setItem("seenOnboarding", "true");
  }
}

function closeOnboarding() {
  document.getElementById("onboarding-overlay").classList.add("hidden");
  // Focus to first slider for screen readers
  const firstSlider = document.querySelector("input[type=range]");
  if (firstSlider) firstSlider.focus();
}
