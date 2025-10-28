/* --------------------------------------------------------------
   LoveSync – script.js
   Updated: 02:15 PM MDT, Monday, October 27, 2025
   -------------------------------------------------------------- */

const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];
const fullLabels = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch'
];

/* ---------- OBSERVATION TEXT ---------- */
const receiveObservations = {
  Words: { high: "You thrive on verbal encouragement! Compliments and sincere appreciation fill your love tank.", medium: "Words of affirmation are meaningful to you and help you feel valued.", low: "Verbal praise isn't your primary love language, but kind words still touch your heart." },
  Acts:  { high: "Nothing says 'I love you' like helping with tasks! You feel deeply loved through practical support.", medium: "Help with chores and responsibilities makes you feel cared for.", low: "Acts of service are appreciated but not your main way of feeling loved." },
  Gifts: { high: "Thoughtful gifts speak volumes to you! They show you've been remembered.", medium: "Small, meaningful gifts warm your heart and make you feel special.", low: "Gifts are nice but not essential for you to feel loved." },
  Time:  { high: "Undivided attention is your love language! Quality time makes you feel truly connected.", medium: "Shared experiences and focused attention strengthen your relationships.", low: "Quality time is pleasant but not your primary need." },
  Touch: { high: "Physical touch is your love language! Hugs, hand-holding, and closeness make you feel secure.", medium: "Physical affection helps you feel connected and loved.", low: "Touch is comforting but not your main way of receiving love." }
};

const giveObservations = {
  Words: { high: "You naturally encourage others! Your affirming words uplift those around you.", medium: "You enjoy giving compliments and positive feedback when it feels authentic.", low: "Verbal affirmation isn't your go-to way of showing love." },
  Acts:  { high: "You're a natural helper! Serving others through actions is how you show your love.", medium: "You like helping out and making life easier for those you care about.", low: "Practical help isn't your primary way of expressing love." },
  Gifts: { high: "You love giving thoughtful gifts! Finding the perfect present brings you joy.", medium: "You enjoy giving meaningful gifts on special occasions.", low: "Gifts aren't your main way of showing appreciation." },
  Time:  { high: "Your presence is your present! You show love by being fully present with others.", medium: "You value giving focused attention and creating memories together.", low: "Quality time is nice but not your primary way of giving love." },
  Touch: { high: "You're naturally affectionate! Physical touch is how you express your love most comfortably.", medium: "You enjoy appropriate physical affection as a way to connect.", low: "Physical touch isn't your main way of showing love." }
};

/* ---------- CHART SETUP ---------- */
const chartConfig = {
  type: 'radar',
  data: {
    labels: labels,
    datasets: [
      { label: 'Receive', data: [5,5,5,5,5], backgroundColor: 'rgba(52,152,219,0.2)', borderColor: '#3498db', pointBackgroundColor: colors, pointBorderColor: '#fff', borderWidth: 2 },
      { label: 'Give',    data: [5,5,5,5,5], backgroundColor: 'rgba(46,204,113,0.2)', borderColor: '#2ecc71', pointBackgroundColor: colors.map(c=>c+'80'), pointBorderColor: '#fff', borderWidth: 2 }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { r: { min:0, max:10, ticks:{stepSize:2} } },
    plugins: { legend: { position:'bottom', labels:{font:{size:12}} } }
  }
};
const myChart = new Chart(document.getElementById('loveChart'), chartConfig);

/* ---------- LIVE UPDATE ---------- */
function updateLive() {
  const rec = labels.map(l=>Number(document.getElementById(`rec_${l.toLowerCase()}`).value));
  const give = labels.map(l=>Number(document.getElementById(`give_${l.toLowerCase()}`).value));

  // update value readouts
  labels.forEach(l=>{
    document.getElementById(`val_rec_${l.toLowerCase()}`).textContent = rec[labels.indexOf(l)];
    document.getElementById(`val_give_${l.toLowerCase()}`).textContent = give[labels.indexOf(l)];
  });

  myChart.data.datasets[0].data = rec;
  myChart.data.datasets[1].data = give;
  myChart.update('none');

  updateDescription(rec, give);
}
function updateDescription(rec,give){
  let html = '<div class="profile-section"><h3>Receiving</h3><ul>';
  labels.map((l,i)=>({lang:fullLabels[i],score:rec[i]})).sort((a,b)=>b.score-a.score)
    .forEach(p=>html+=`<li>${p.lang}: ${p.score}/10</li>`);
  html+='</ul></div><div class="profile-section"><h3>Giving</h3><ul>';
  labels.map((l,i)=>({lang:fullLabels[i],score:give[i]})).sort((a,b)=>b.score-a.score)
    .forEach(p=>html+=`<li>${p.lang}: ${p.score}/10</li>`);
  html+='</ul></div>';
  document.getElementById('description').innerHTML = html;
}

/* ---------- REPORT ---------- */
function generateReport(){
  const rec = labels.map(l=>Number(document.getElementById(`rec_${l.toLowerCase()}`).value));
  const give = labels.map(l=>Number(document.getElementById(`give_${l.toLowerCase()}`).value));

  const reportHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LoveSync Report – ${new Date().toLocaleDateString()}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>/* (same styles you already have – omitted for brevity) */</style></head><body>
    <div class="header"><h1>LoveSync Report</h1><p class="date">Generated ${new Date().toLocaleDateString()}</p></div>
    <div class="chart-container"><canvas id="reportChart"></canvas></div>
    <div class="section"><h2>How I Receive Love</h2><div class="language-grid">${createLanguageCards(rec,true)}</div></div>
    <div class="section"><h2>How I Give Love</h2><div class="language-grid">${createLanguageCards(give,false)}</div></div>
    <div class="insights"><h3>Key Insights</h3>
      <p><strong>Love Gap:</strong> ${getLoveGap(rec,give)}</p>
      <p><strong>Top Match:</strong> ${getTopMatch(rec,give)}</p>
    </div>
    <script>
      new Chart(document.getElementById('reportChart').getContext('2d'),{
        type:'radar',data:{labels:${JSON.stringify(labels)},
          datasets:[{label:'Receive',data:${JSON.stringify(rec)},backgroundColor:'rgba(52,152,219,0.2)',borderColor:'#3498db',pointBackgroundColor:${JSON.stringify(colors)},pointBorderColor:'#fff',borderWidth:2},
                    {label:'Give',data:${JSON.stringify(give)},backgroundColor:'rgba(46,204,113,0.2)',borderColor:'#2ecc71',pointBackgroundColor:${JSON.stringify(colors.map(c=>c+'80'))},pointBorderColor:'#fff',borderWidth:2}]
        },options:${JSON.stringify(chartConfig.options)}
      });
    </script>
    </body></html>`;

  const win = window.open('','_blank');
  if(win){ win.document.write(reportHTML); win.document.close(); }
  else alert('Popup blocked – allow pop-ups to see the report.');
}

/* ---------- HELPERS ---------- */
function createLanguageCards(data,isReceive){
  return labels.map((l,i)=>{
    const score = data[i];
    const obs = getObservation(l,score,isReceive);
    const cls = score>=7?'score-high':score>=4?'score-medium':'score-low';
    const col = score>=7?'#e74c3c':score>=4?'#f1c40f':'#95a5a6';
    return `<div class="language-card ${cls}"><div class="score" style="color:${col}">${score}/10</div><strong>${fullLabels[i]}</strong><p class="observation">${obs}</p></div>`;
  }).join('');
}
function getObservation(key,score,isReceive){
  const cat = score>=7?'high':score>=4?'medium':'low';
  const set = isReceive?receiveObservations:giveObservations;
  return set[key][cat] || `You value ${key} at ${score}/10.`;
}
function getLoveGap(rec,give){
  const gaps = labels.map((_,i)=>Math.abs(rec[i]-give[i]));
  const max = Math.max(...gaps);
  const idx = gaps.indexOf(max);
  return max>3?`You give ${fullLabels[idx]} ${give[idx]} but receive ${rec[idx]} — discuss this!`:'Balanced giving & receiving!';
}
function getTopMatch(rec,give){
  const matches = labels.map((_,i)=>Math.min(rec[i],give[i]));
  return fullLabels[matches.indexOf(Math.max(...matches))];
}

/* ---------- 20-POINT DATA (for sharing) ---------- */
function getExpandedData(){
  const baseRec = labels.map(l=>Number(document.getElementById(`rec_${l.toLowerCase()}`).value)||5);
  const baseGive = labels.map(l=>Number(document.getElementById(`give_${l.toLowerCase()}`).value)||5);
  const out = [];
  labels.forEach((_,i)=>{
    out.push(baseRec[i]);                 // base receive
    out.push(Math.floor(baseRec[i]*0.8)); // intensity receive
    out.push(baseGive[i]);                // base give
    out.push(Math.floor(baseGive[i]*0.7)); // intensity give
  });
  return out; // 20 numbers
}

/* ---------- SHARE CODE (GENERATE) ---------- */
function generateCode(){
  const data = getExpandedData();
  const sum = data.reduce((a,b)=>a+b,0);
  const hash = sum.toString(36).toUpperCase().padEnd(6,'0').substring(0,6);
  const now = new Date().toISOString().replace(/[-:]/g,'').substring(0,13);
  const code = `${now.substring(8,12)}${hash}`; // e.g. 1415AB3C00
  console.log('Generated code →', code);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LoveSync – Your Code</title>
    <style>body{font-family:Arial;max-width:420px;margin:2rem auto;text-align:center}
    h2{color:#3498db}#code{font-size:1.8rem;font-weight:bold;color:#2ecc71;background:#f8f9fa;padding:1rem;border-radius:8px}
    button{background:#3498db;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:5px;cursor:pointer}</style></head>
    <body><h2>Share This Code</h2><div id="code">${code}</div>
    <p>Give it to your partner to compare profiles.</p><button onclick="window.close()">Close</button></body></html>`;

  const win = window.open('','_blank');
  if(win){ win.document.write(html); win.document.close(); }
  else alert('Popup blocked – allow pop-ups to see the code.');
}

/* ---------- RECEIVE CODE (INPUT) ---------- */
function showCompare(){
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LoveSync – Enter Code</title>
    <style>body{font-family:Arial;max-width:420px;margin:2rem auto;text-align:center}
    h2{color:#3498db}.input-group{margin:1rem 0}input{width:100%;padding:.5rem;margin-bottom:1rem;text-transform:uppercase}
    button{background:#3498db;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:5px;cursor:pointer}
    #error{color:red;display:none;margin-top:1rem}</style></head>
    <body><h2>Enter Compare Code</h2>
    <div class="input-group"><label>Code from your partner:</label>
    <input id="compareCode" placeholder="e.g. 1415AB3C00" maxlength="10">
    <button onclick="submitCode()">Submit</button>
    <div id="error">Invalid code. Please try again.</div></div>
    <script>
      function submitCode(){
        const code = document.getElementById('compareCode').value.toUpperCase().trim();
        console.log('Entered code →', code);
        if(!/^[0-9]{4}[A-Z0-9]{6}$/.test(code)){
          document.getElementById('error').style.display='block';
          return;
        }
        window.location.href='compare.html?code='+encodeURIComponent(code);
      }
    </script></body></html>`;

  const win = window.open('','_blank');
  if(win){ win.document.write(html); win.document.close(); }
  else alert('Popup blocked – allow pop-ups to enter the code.');
}

/* ---------- COMPARE PAGE (compare.html) ---------- */
function displayCompare(){
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  if(!code){ location.href='index.html'; return; }

  const myData = getExpandedData();               // 20 numbers from current sliders
  const otherData = [7,6,5,8,4,6,5,4,3,6,5,4,7,6,5,8,4,3,2,1]; // placeholder – replace with real fetch later

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LoveSync Compare</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>body{font-family:Georgia;max-width:1000px;margin:0 auto;padding:2rem;background:#f8f9fa}
    .charts{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
    .chart-box{background:#fff;padding:1.5rem;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,.1)}
    @media(max-width:768px){.charts{grid-template-columns:1fr}}</style></head><body>
    <h1 style="text-align:center">LoveSync Compare – Code ${code}</h1>
    <div class="charts">
      <div class="chart-box"><h2>Your Receive</h2><canvas id="myRec"></canvas></div>
      <div class="chart-box"><h2>Their Receive</h2><canvas id="otherRec"></canvas></div>
      <div class="chart-box"><h2>Your Give</h2><canvas id="myGive"></canvas></div>
      <div class="chart-box"><h2>Their Give</h2><canvas id="otherGive"></canvas></div>
    </div>
    <script>
      const shortLabels = ['Words','Acts','Gifts','Time','Touch','W-I','A-I','G-I','T-I','To-I'];
      new Chart(document.getElementById('myRec').getContext('2d'),{type:'radar',data:{labels:shortLabels,datasets:[{label:'You Receive',data:[${myData.slice(0,10).join(',')}],backgroundColor:'rgba(52,152,219,0.2)',borderColor:'#3498db'}]},options:${JSON.stringify(chartConfig.options)}});
      new Chart(document.getElementById('otherRec').getContext('2d'),{type:'radar',data:{labels:shortLabels,datasets:[{label:'They Receive',data:[${otherData.slice(0,10).join(',')}],backgroundColor:'rgba(46,204,113,0.2)',borderColor:'#2ecc71'}]},options:${JSON.stringify(chartConfig.options)}});
      new Chart(document.getElementById('myGive').getContext('2d'),{type:'radar',data:{labels:shortLabels,datasets:[{label:'You Give',data:[${myData.slice(10,20).join(',')}],backgroundColor:'rgba(52,152,219,0.2)',borderColor:'#3498db'}]},options:${JSON.stringify(chartConfig.options)}});
      new Chart(document.getElementById('otherGive').getContext('2d'),{type:'radar',data:{labels:shortLabels,datasets:[{label:'They Give',data:[${otherData.slice(10,20).join(',')淀)],backgroundColor:'rgba(46,204,113,0.2)',borderColor:'#2ecc71'}]},options:${JSON.stringify(chartConfig.options)}});
    </script>
    </body></html>`;
  document.write(html); document.close();
}

/* ---------- SLIDER TOGGLE (two-column layout) ---------- */
function toggleSliders(){
  const cont = document.getElementById('slidersContainer');
  const btn  = document.querySelector('.toggle-btn');
  const hidden = !cont.style.display || cont.style.display==='none';
  cont.style.display = hidden ? 'grid' : 'none';
  btn.textContent = hidden ? 'Hide Sliders' : 'Show Sliders';
}

/* ---------- MODAL INSTRUCTIONS ---------- */
function showInstructions(){ document.getElementById('instructionsModal').style.display='block'; }
function closeInstructions(){ document.getElementById('instructionsModal').style.display='none'; }
window.onclick = e=>{ if(e.target.id==='instructionsModal') closeInstructions(); };

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('input[type="range"]').forEach(s=>s.addEventListener('input',updateLive));
  updateLive();
});
