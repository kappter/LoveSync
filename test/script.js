const LABELS = [
  "Words of Affirmation",
  "Acts of Service",
  "Receiving Gifts",
  "Quality Time",
  "Physical Touch"
];

const DEFAULT = 5;
const soloData = LABELS.map(() => ({ rec: DEFAULT, give: DEFAULT }));
const partnerAData = LABELS.map(() => ({ rec: DEFAULT, give: DEFAULT }));
const partnerBData = LABELS.map(() => ({ rec: DEFAULT, give: DEFAULT }));

let mode = "solo";
let activePartner = "A";
let darkMode = false;

const soloBtn = document.getElementById("soloBtn");
const coupleBtn = document.getElementById("coupleBtn");
const soloSection = document.getElementById("soloSection");
const coupleSection = document.getElementById("coupleSection");
const reportSection = document.getElementById("reportSection");
const reportContent = document.getElementById("reportContent");
const darkModeBtn = document.getElementById("darkModeBtn");
const partnerABtn = document.getElementById("partnerABtn");
const partnerBBtn = document.getElementById("partnerBBtn");

// --- Setup ---
createSliders("soloSliders", soloData, "solo");
createSliders("coupleSliders", partnerAData, "A");
updateCharts();

// --- Mode switching ---
soloBtn.onclick = () => switchMode("solo");
coupleBtn.onclick = () => switchMode("couple");
partnerABtn.onclick = () => switchPartner("A");
partnerBBtn.onclick = () => switchPartner("B");

function switchMode(m) {
  mode = m;
  if (mode === "solo") {
    soloSection.classList.remove("hidden");
    coupleSection.classList.add("hidden");
  } else {
    coupleSection.classList.remove("hidden");
    soloSection.classList.add("hidden");
  }
  soloBtn.classList.toggle("active", mode === "solo");
  coupleBtn.classList.toggle("active", mode === "couple");
  updateCharts();
}

function switchPartner(p) {
  activePartner = p;
  partnerABtn.classList.toggle("active", p === "A");
  partnerBBtn.classList.toggle("active", p === "B");
  createSliders("coupleSliders", p === "A" ? partnerAData : partnerBData, p);
  updateCharts();
}

// --- Sliders ---
function createSliders(containerId, data, prefix) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  LABELS.forEach((label, i) => {
    const row = document.createElement("div");
    row.className = "slider-row";
    row.innerHTML = `
      <label>${label}</label>
      <input type="range" min="0" max="10" value="${data[i].rec}" data-index="${i}" data-type="rec" data-prefix="${prefix}">
      <input type="range" min="0" max="10" value="${data[i].give}" data-index="${i}" data-type="give" data-prefix="${prefix}">
    `;
    container.appendChild(row);
  });

  container.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", (e) => {
      const { index, type, prefix } = e.target.dataset;
      const value = Number(e.target.value);
      const arr = prefix === "solo" ? soloData : prefix === "A" ? partnerAData : partnerBData;
      arr[index][type] = value;
      updateCharts();
    });
  });
}

// --- Charts ---
let soloChart, coupleChart;

function updateCharts() {
  updateChart("soloChart", soloData, (chart) => (soloChart = chart));
  updateChart("coupleChart", activePartner === "A" ? partnerAData : partnerBData, (chart) => (coupleChart = chart));
}

function updateChart(canvasId, data, refSetter) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (refSetter === soloChart && soloChart) soloChart.destroy();
  if (refSetter === coupleChart && coupleChart) coupleChart.destroy();

  const datasetReceive = data.map((d) => d.rec);
  const datasetGive = data.map((d) => d.give);

  const newChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: LABELS,
      datasets: [
        {
          label: "Receive",
          data: datasetReceive,
          backgroundColor: "rgba(37,99,235,0.2)",
          borderColor: "#2563eb",
        },
        {
          label: "Give",
          data: datasetGive,
          backgroundColor: "rgba(16,185,129,0.2)",
          borderColor: "#10b981",
        },
      ],
    },
    options: {
      responsive: true,
      scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
      plugins: { legend: { display: false } },
    },
  });

  refSetter(newChart);
}

// --- Report generation ---
document.getElementById("soloReportBtn").onclick = () => generateReport(soloData);
document.getElementById("coupleReportBtn").onclick = () => generateReport([...partnerAData, ...partnerBData], true);
document.getElementById("closeReport").onclick = () => reportSection.classList.add("hidden");

function generateReport(data, isCouple = false) {
  reportSection.classList.remove("hidden");

  let html = `<h2>${isCouple ? "Couple Report" : "Solo Report"}</h2>`;
  html += `<p>${new Date().toLocaleString()}</p>`;
  html += `<ul>`;
  if (isCouple) {
    html += `<li>Partner A top give: ${getTopLabel(partnerAData, "give")}</li>`;
    html += `<li>Partner B top need: ${getTopLabel(partnerBData, "rec")}</li>`;
  } else {
    html += `<li>Top need: ${getTopLabel(data, "rec")}</li>`;
    html += `<li>Top strength: ${getTopLabel(data, "give")}</li>`;
  }
  html += `</ul>`;
  reportContent.innerHTML = html;
}

function getTopLabel(arr, key) {
  const maxIndex = arr.reduce((acc, cur, i) => (cur[key] > arr[acc][key] ? i : acc), 0);
  return `${LABELS[maxIndex]} (${arr[maxIndex][key]})`;
}

// --- Dark mode ---
darkModeBtn.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  darkModeBtn.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// --- Export PDF ---
document.getElementById("exportBtn").onclick = async () => {
  const element = document.getElementById("reportSection");
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });
  const width = pdf.internal.pageSize.getWidth();
  const ratio = width / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, canvas.height * ratio);
  pdf.save(`LoveSync_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};
