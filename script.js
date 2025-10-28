<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>LoveSync – Instant 2-Person Compare</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f9;margin:0;padding:1rem}
  h1,h2{color:#2c3e50;text-align:center}
  .container{display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:1200px;margin:auto}
  @media(max-width:900px){.container{grid-template-columns:1fr}}
  .panel{background:#fff;padding:1.5rem;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,.1)}
  .slider-row{display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem}
  .slider-row label{flex:1;white-space:nowrap}
  .slider-row input{flex:2}
  .chart-box{height:300px;margin-top:1rem}
  .report{background:#fff;padding:2rem;margin-top:2rem;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,.1);display:none}
  .btn{background:#3498db;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:6px;cursor:pointer;font-size:1rem}
  .btn:hover{background:#2980b9}
  .love-gap{font-weight:bold;color:#e74c3c}
  .top-match{font-weight:bold;color:#27ae60}
</style>
</head>
<body>

<h1>LoveSync – Instant 2-Person Comparison</h1>

<div class="container">

  <!-- PERSON 1 -->
  <div class="panel">
    <h2>Person 1</h2>
    <div id="p1-sliders"></div>
    <div class="chart-box"><canvas id="chart1"></canvas></div>
  </div>

  <!-- PERSON 2 -->
  <div class="panel">
    <h2>Person 2</h2>
    <div id="p2-sliders"></div>
    <div class="chart-box"><canvas id="chart2"></canvas></div>
  </div>

</div>

<div style="text-align:center;margin-top:2rem">
  <button class="btn" onclick="showReport()">Show Comparison Report</button>
</div>

<!-- REPORT SECTION (hidden until button press) -->
<div id="report" class="report"></div>

<script>
/* ==============================================================
   DATA & HELPERS
   ============================================================== */
const labels = ['Words','Acts','Gifts','Time','Touch'];
const full  = ['Words of Affirmation','Acts of Service','Receiving Gifts','Quality Time','Physical Touch'];
const colors = ['#3498db','#2ecc71','#f1c40f','#9b59b6','#e74c3c'];

const obsReceive = {Words:{high:"You thrive on verbal encouragement!",medium:"Words matter to you.",low:"Verbal praise is nice but not primary."},
                    Acts:{high:"Helping with tasks feels like love.",medium:"Practical help is appreciated.",low:"Acts are secondary."},
                    Gifts:{high:"Thoughtful gifts speak volumes.",medium:"Gifts warm your heart.",low:"Gifts are pleasant but not essential."},
                    Time:{high:"Undivided attention is everything.",medium:"Quality time strengthens bonds.",low:"Time together is nice."},
                    Touch:{high:"Physical touch makes you feel secure.",medium:"Touch helps you connect.",low:"Touch is comforting."}};

const obsGive = {Words:{high:"You naturally encourage with words.",medium:"You enjoy giving compliments.",low:"Words aren’t your main way."},
                 Acts:{high:"You show love by doing.",medium:"You like helping out.",low:"Helping isn’t your default."},
                 Gifts:{high:"You love finding the perfect gift.",medium:"You give gifts on special occasions.",low:"Gifts aren’t your style."},
                 Time:{high:"Your presence is the gift.",medium:"You value shared moments.",low:"Time isn’t your primary expression."},
                 Touch:{high:"You’re naturally affectionate.",medium:"You use touch to connect.",low:"Touch isn’t your go-to."}};

/* ---------- CREATE SLIDERS ---------- */
function buildSliders(containerId, prefix){
  const cont = document.getElementById(containerId);
  cont.innerHTML = labels.map((l,i)=>`
    <div class="slider-row">
      <label>${full[i]} (Receive)</label>
      <input type="range" min="0" max="10" value="5" id="${prefix}_rec_${l.toLowerCase()}" oninput="update()">
      <span id="val_${prefix}_rec_${l.toLowerCase()}">5</span>
    </div>
    <div class="slider-row">
      <label>${full[i]} (Give)</label>
      <input

 type="range" min="0" max="10" value="5" id="${prefix}_give_${l.toLowerCase()}" oninput="update()">
      <span id="val_${prefix}_give_${l.toLowerCase()}">5</span>
    </div>`).join('');
}

/* ---------- CHART CONFIG ---------- */
function makeChart(canvasId, dataRec, dataGive){
  return new Chart(document.getElementById(canvasId),{
    type:'radar',
    data:{labels:labels,
          datasets:[
            {label:'Receive',data:dataRec,backgroundColor:'rgba(52,152,219,0.2)',borderColor:'#3498db',pointBackgroundColor:colors,pointBorderColor:'#fff',borderWidth:2},
            {label:'Give',   data:dataGive,backgroundColor:'rgba(46,204,113,0.2)',borderColor:'#2ecc71',pointBackgroundColor:colors.map(c=>c+'80'),pointBorderColor:'#fff',borderWidth:2}
          ]},
    options:{responsive:true,maintainAspectRatio:false,
             scales:{r:{min:0,max:10,ticks:{stepSize:2}}},
             plugins:{legend:{position:'bottom'}}}
  });
}
let chart1, chart2;

/* ---------- READ DATA ---------- */
function getData(prefix){
  const rec = labels.map(l=>+document.getElementById(`${prefix}_rec_${l.toLowerCase()}`).value);
  const give= labels.map(l=>+document.getElementById(`${prefix}_give_${l.toLowerCase()}`).value);
  return {rec,give};
}

/* ---------- UPDATE CHARTS & VALUES ---------- */
function update(){
  const p1 = getData('p1'), p2 = getData('p2');

  // update value readouts
  labels.forEach(l=>{
    document.getElementById(`val_p1_rec_${l.toLowerCase()}`).textContent = p1.rec[labels.indexOf(l)];
    document.getElementById(`val_p1_give_${l.toLowerCase()}`).textContent = p1.give[labels.indexOf(l)];
    document.getElementById(`val_p2_rec_${l.toLowerCase()}`).textContent = p2.rec[labels.indexOf(l)];
    document.getElementById(`val_p2_give_${l.toLowerCase()}`).textContent = p2.give[labels.indexOf(l)];
  });

  // update charts
  chart1.data.datasets[0].data = p1.rec; chart1.data.datasets[1].data = p1.give; chart1.update('none');
  chart2.data.datasets[0].data = p2.rec; chart2.data.datasets[1].data = p2.give; chart2.update('none');
}

/* ---------- OBSERVATION TEXT ---------- */
function observation(key,score,isReceive){
  const set = isReceive?obsReceive:obsGive;
  const cat = score>=7?'high':score>=4?'medium':'low';
  return set[key][cat];
}

/* ---------- LOVE GAP & TOP MATCH ---------- */
function loveGap(p1rec,p1give,p2rec,p2give){
  const gaps = labels.map((_,i)=>Math.abs(p1give[i]-p2rec[i]));
  const max = Math.max(...gaps);
  const idx = gaps.indexOf(max);
  return max>3?`Biggest mismatch: **${full[idx]}** – P1 gives ${p1give[idx]} but P2 receives ${p2rec[idx]}`:'Giving & receiving are nicely balanced!';
}
function topMatch(p1rec,p1give,p2rec,p2give){
  const matches = labels.map((_,i)=>Math.min(p1give[i],p2rec[i]));
  const best = Math.max(...matches);
  const idx = matches.indexOf(best);
  return `Strongest mutual love language: **${full[idx]}** (${best}/10)`;
}

/* ---------- BUILD REPORT ---------- */
function showReport(){
  const p1 = getData('p1'), p2 = getData('p2');

  const cards = (data,isReceive,person)=>labels.map((l,i)=>{
    const s = data[i];
    const o = observation(l,s,isReceive);
    const cls = s>=7?'score-high':s>=4?'score-medium':'score-low';
    const col = s>=7?'#e74c3c':s>=4?'#f1c40f':'#95a5a6';
    return `<div class="language-card ${cls}" style="border-left:4px solid ${col};padding:.8rem;margin:.5rem 0">
      <strong>${full[i]}</strong> – ${s}/10<br><em>${o}</em>
    </div>`;
  }).join('');

  const html = `
    <h2 style="text-align:center">Comparison Report</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem">
      <div>
        <h3>Person 1 – Receiving</h3>${cards(p1.rec,true,'P1')}
        <h3>Person 1 – Giving</h3>${cards(p1.give,false,'P1')}
      </div>
      <div>
        <h3>Person 2 – Receiving</h3>${cards(p2.rec,true,'P2')}
        <h3>Person 2 – Giving</h3>${cards(p2.give,false,'P2')}
      </div>
    </div>
    <div style="margin-top:2rem;padding:1rem;background:#fff3cd;border-radius:8px">
      <p class="love-gap">${loveGap(p1.rec,p1.give,p2.rec,p2.give)}</p>
      <p class="top-match">${topMatch(p1.rec,p1.give,p2.rec,p2.give)}</p>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn" onclick="document.getElementById('report').style.display='none'">Close Report</button>
    </div>`;

  const rep = document.getElementById('report');
  rep.innerHTML = html;
  rep.style.display = 'block';
}

/* ---------- INITIALISE ---------- */
buildSliders('p1-sliders','p1');
buildSliders('p2-sliders','p2');
chart1 = makeChart('chart1',[5,5,5,5,5],[5,5,5,5,5]);
chart2 = makeChart('chart2',[5,5,5,5,5],[5,5,5,5,5]);
update();   // show initial values
</script>

</body>
</html>
