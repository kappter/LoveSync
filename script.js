// Chart.js setup
const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];
const fullLabels = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];

// OBSERVATION STATEMENTS
const receiveObservations = {
    'Words': {
        high: "You thrive on verbal encouragement! Compliments and sincere appreciation fill your love tank.",
        medium: "Words of affirmation are meaningful to you and help you feel valued.",
        low: "Verbal praise isn't your primary love language, but kind words still touch your heart."
    },
    'Acts': {
        high: "Nothing says 'I love you' like helping with tasks! You feel deeply loved through practical support.",
        medium: "Help with chores and responsibilities makes you feel cared for.",
        low: "Acts of service are appreciated but not your main way of feeling loved."
    },
    'Gifts': {
        high: "Thoughtful gifts speak volumes to you! They show you've been remembered.",
        medium: "Small, meaningful gifts warm your heart and make you feel special.",
        low: "Gifts are nice but not essential for you to feel loved."
    },
    'Time': {
        high: "Undivided attention is your love language! Quality time makes you feel truly connected.",
        medium: "Shared experiences and focused attention strengthen your relationships.",
        low: "Quality time is pleasant but not your primary need."
    },
    'Touch': {
        high: "Physical touch is your love language! Hugs, hand-holding, and closeness make you feel secure.",
        medium: "Physical affection helps you feel connected and loved.",
        low: "Touch is comforting but not your main way of receiving love."
    }
};

const giveObservations = {
    'Words': {
        high: "You naturally encourage others! Your affirming words uplift those around you.",
        medium: "You enjoy giving compliments and positive feedback when it feels authentic.",
        low: "Verbal affirmation isn't your go-to way of showing love."
    },
    'Acts': {
        high: "You're a natural helper! Serving others through actions is how you show your love.",
        medium: "You like helping out and making life easier for those you care about.",
        low: "Practical help isn't your primary way of expressing love."
    },
    'Gifts': {
        high: "You love giving thoughtful gifts! Finding the perfect present brings you joy.",
        medium: "You enjoy giving meaningful gifts on special occasions.",
        low: "Gifts aren't your main way of showing appreciation."
    },
    'Time': {
        high: "Your presence is your present! You show love by being fully present with others.",
        medium: "You value giving focused attention and creating memories together.",
        low: "Quality time is nice but not your primary way of giving love."
    },
    'Touch': {
        high: "You're naturally affectionate! Physical touch is how you express your love most comfortably.",
        medium: "You enjoy appropriate physical affection as a way to connect.",
        low: "Physical touch isn't your main way of showing love."
    }
};

const config = {
    type: 'radar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Receive',
            data: [5,5,5,5,5],
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderColor: '#3498db',
            pointBackgroundColor: colors,
            pointBorderColor: '#fff',
            borderWidth: 2
        }, {
            label: 'Give',
            data: [5,5,5,5,5],
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            borderColor: '#2ecc71',
            pointBackgroundColor: colors.map(c => c + '80'),
            pointBorderColor: '#fff',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
        plugins: { 
            legend: { position: 'bottom', labels: { font: { size: 12 } } } 
        }
    }
};

const myChart = new Chart(document.getElementById('loveChart'), config);

// Live update function
function updateLive() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        const valueSpan = document.getElementById(`val_${slider.id}`);
        if (valueSpan) valueSpan.textContent = slider.value;
    });

    const recData = [
        document.getElementById('rec_words').value,
        document.getElementById('rec_acts').value,
        document.getElementById('rec_gifts').value,
        document.getElementById('rec_time').value,
        document.getElementById('rec_touch').value
    ].map(Number);

    const giveData = [
        document.getElementById('give_words').value,
        document.getElementById('give_acts').value,
        document.getElementById('give_gifts').value,
        document.getElementById('give_time').value,
        document.getElementById('give_touch').value
    ].map(Number);

    myChart.data.datasets[0].data = recData;
    myChart.data.datasets[1].data = giveData;
    myChart.update('none');

    updateDescription(recData, giveData);
}

function updateDescription(recData, giveData) {
    let desc = '<div class="profile-section"><h3>🎯 Receiving</h3><ul>';
    labels.map((l, i) => ({ language: fullLabels[i], score: recData[i] }))
        .sort((a, b) => b.score - a.score)
        .forEach(p => desc += `<li>${p.language}: ${p.score}/10</li>`);
    desc += '</ul></div>';

    desc += '<div class="profile-section"><h3>🎁 Giving</h3><ul>';
    labels.map((l, i) => ({ language: fullLabels[i], score: giveData[i] }))
        .sort((a, b) => b.score - a.score)
        .forEach(p => desc += `<li>${p.language}: ${p.score}/10</li>`);
    desc += '</ul></div>';

    document.getElementById('description').innerHTML = desc;
}

// 🎯 SIMPLIFIED REPORT - CHART RENDERS DIRECTLY IN NEW WINDOW
function generateReport() {
    const recData = [
        document.getElementById('rec_words').value,
        document.getElementById('rec_acts').value,
        document.getElementById('rec_gifts').value,
        document.getElementById('rec_time').value,
        document.getElementById('rec_touch').value
    ].map(Number);

    const giveData = [
        document.getElementById('give_words').value,
        document.getElementById('give_acts').value,
        document.getElementById('give_gifts').value,
        document.getElementById('give_time').value,
        document.getElementById('give_touch').value
    ].map(Number);

    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync Report - ${new Date().toLocaleDateString()}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 1rem; margin-bottom: 2rem; }
        h1 { color: #2c3e50; margin-bottom: 0.5rem; }
        .date { color: #7f8c8d; font-style: italic; }
        .chart-container { 
            height: 350px; 
            background: white;
            border-radius: 10px; 
            margin: 2rem 0; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .section { margin: 2rem 0; padding: 1.5rem; background: #f8f9fa; border-radius: 10px; }
        h2 { color: #3498db; border-left: 4px solid #2ecc71; padding-left: 1rem; }
        .language-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .language-card { 
            background: white; 
            padding: 1rem; 
            border-radius: 8px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
            border-left: 4px solid; 
        }
        .score-high { border-left-color: #e74c3c; }
        .score-medium { border-left-color: #f1c40f; }
        .score-low { border-left-color: #95a5a6; }
        .score { font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 0.5rem; }
        .observation { font-style: italic; color: #555; }
        .insights { background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
        .footer { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ddd; color: #7f8c8d; }
        @media print { 
            body { padding: 0.5rem; } 
            .chart-container { height: 300px !important; }
            canvas { max-height: 300px !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>❤️ LoveSync Report</h1>
        <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="chart-container">
        <canvas id="reportChart"></canvas>
    </div>

    <div class="section">
        <h2>🎯 How I Receive Love</h2>
        <div class="language-grid">
            ${createLanguageCards(recData, true)}
        </div>
    </div>

    <div class="section">
        <h2>🎁 How I Give Love</h2>
        <div class="language-grid">
            ${createLanguageCards(giveData, false)}
        </div>
    </div>

    <div class="insights">
        <h3>💡 Key Insights</h3>
        <p><strong>Your Love Gap:</strong> ${getLoveGap(recData, giveData)}</p>
        <p><strong>Top Match:</strong> ${getTopMatch(recData, giveData)}</p>
    </div>

    <div class="footer">
        <p>Powered by <strong>LoveSync</strong> • Based on The 5 Love Languages® by Gary Chapman</p>
        <p><em>Share this report with your partner for deeper connection!</em></p>
    </div>

    <script>
        // RENDER CHART IN REPORT
        const ctx = document.getElementById('reportChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'],
                datasets: [{
                    label: 'Receive',
                    data: [${recData.join(',')}],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    pointBackgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'],
                    pointBorderColor: '#fff',
                    borderWidth: 2
                }, {
                    label: 'Give',
                    data: [${giveData.join(',')}],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    pointBackgroundColor: ['#3498db80', '#2ecc7180', '#f1c40f80', '#9b59b680', '#e74c3c80'],
                    pointBorderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    </script>
</body>
</html>`;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(reportHTML);
    newWindow.document.close();
}

function createLanguageCards(data, isReceive) {
    return labels.map((label, i) => {
        const score = data[i];
        const fullLabel = fullLabels[i];
        const observation = getObservation(label, score, isReceive);
        const scoreClass = score >= 7 ? 'score-high' : score >= 4 ? 'score-medium' : 'score-low';
        const scoreColor = score >= 7 ? '#e74c3c' : score >= 4 ? '#f1c40f' : '#95a5a6';
        
        return `
        <div class="language-card ${scoreClass}">
            <div class="score" style="color: ${scoreColor}">${score}/10</div>
            <strong>${fullLabel}</strong>
            <p class="observation">${observation}</p>
        </div>`;
    }).join('');
}

function getObservation(key, score, isReceive) {
    try {
        const category = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
        const observations = isReceive ? receiveObservations : giveObservations;
        return observations[key] && observations[key][category] 
            ? observations[key][category] 
            : `You value ${key} at ${score}/10.`;
    } catch (error) {
        return `You value ${key} at ${score}/10.`;
    }
}

function getLoveGap(recData, giveData) {
    const gaps = labels.map((_, i) => Math.abs(recData[i] - giveData[i]));
    const maxGapIndex = gaps.indexOf(Math.max(...gaps));
    const maxGap = Math.max(...gaps);
    const lang = fullLabels[maxGapIndex];
    return maxGap > 3 ? `You give ${lang} ${giveData[maxGapIndex]} but receive ${recData[maxGapIndex]} — discuss this!` : "Balanced giving & receiving!";
}

function getTopMatch(recData, giveData) {
    const matches = labels.map((_, i) => Math.min(recData[i], giveData[i]));
    const topMatchIndex = matches.indexOf(Math.max(...matches));
    return fullLabels[topMatchIndex];
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.removeEventListener('input', updateLive);
        slider.addEventListener('input', updateLive);
    });
    updateLive();
});

// ... (KEEP ALL EXISTING CODE EXACTLY THE SAME) ...

// 🆕 NEW: COMPARE SCREEN
function showCompare() {
    const recData = [
        document.getElementById('rec_words').value,
        document.getElementById('rec_acts').value,
        document.getElementById('rec_gifts').value,
        document.getElementById('rec_time').value,
        document.getElementById('rec_touch').value
    ].map(Number);

    const giveData = [
        document.getElementById('give_words').value,
        document.getElementById('give_acts').value,
        document.getElementById('give_gifts').value,
        document.getElementById('give_time').value,
        document.getElementById('give_touch').value
    ].map(Number);

    const compareHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync Compare ❤️</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { 
            font-family: Georgia, serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333; 
        }
        .header { 
            text-align: center; 
            color: white; 
            margin-bottom: 2rem; 
        }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .charts-container { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 2rem; 
            margin: 2rem 0; 
        }
        .chart-box { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .chart-box h2 { 
            text-align: center; 
            color: #2c3e50; 
            margin-bottom: 1rem; 
        }
        .insights { 
            background: white; 
            padding: 2rem; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            margin-top: 2rem; 
        }
        .insight { 
            padding: 1rem; 
            margin: 1rem 0; 
            border-left: 4px solid #3498db; 
            background: #f8f9fa; 
            border-radius: 5px; 
        }
        .strong-match { border-left-color: #2ecc71; background: #d5f4e6; }
        .gap { border-left-color: #e74c3c; background: #fadbd8; }
        .close-match { border-left-color: #f1c40f; background: #fef9e7; }
        @media print { body { background: white; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>👫 LoveSync Compare</h1>
        <p>Your Giving vs Receiving Patterns</p>
    </div>

    <div class="charts-container">
        <div class="chart-box">
            <h2>🎯 How You Receive Love</h2>
            <canvas id="receiveChart" width="400" height="400"></canvas>
        </div>
        <div class="chart-box">
            <h2>🎁 How You Give Love</h2>
            <canvas id="giveChart" width="400" height="400"></canvas>
        </div>
    </div>

    <div class="insights">
        <h2>💡 Relationship Reflections</h2>
        ${getCompareInsights(recData, giveData)}
    </div>

    <script>
        // RENDER RECEIVE CHART
        new Chart(document.getElementById('receiveChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'],
                datasets: [{
                    label: 'Receive',
                    data: [${recData.join(',')}],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    pointBackgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
            }
        });

        // RENDER GIVE CHART
        new Chart(document.getElementById('giveChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'],
                datasets: [{
                    label: 'Give',
                    data: [${giveData.join(',')}],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    pointBackgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
            }
        });
    </script>
</body>
</html>`;

    const compareWindow = window.open('', '_blank');
    compareWindow.document.write(compareHTML);
    compareWindow.document.close();
}

// 🆕 NEW: COMPARE INSIGHTS
function getCompareInsights(recData, giveData) {
    const insights = [];
    const gaps = labels.map((_, i) => Math.abs(recData[i] - giveData[i]));
    
    // TOP 3 INSIGHTS
    if (gaps.some(g => g > 4)) {
        const bigGap = gaps.indexOf(Math.max(...gaps));
        insights.push(`
            <div class="insight gap">
                <strong>💔 Love Gap Alert:</strong> You <strong>give ${fullLabels[bigGap]} ${giveData[bigGap]}/10</strong> 
                but <strong>need ${recData[bigGap]}/10</strong>. Discuss how your partner can fill this gap!
            </div>`);
    }
    
    const matches = labels.map((_, i) => Math.min(recData[i], giveData[i]));
    const bestMatch = matches.indexOf(Math.max(...matches));
    insights.push(`
        <div class="insight strong-match">
            <strong>💚 Perfect Harmony:</strong> You both shine at <strong>${fullLabels[bestMatch]}</strong> 
            (${Math.max(...matches)}/10). Keep nurturing this strength together!
        </div>`);
    
    // OVERALL BALANCE
    const avgRec = recData.reduce((a,b)=>a+b)/5;
    const avgGive = giveData.reduce((a,b)=>a+b)/5;
    const balance = Math.abs(avgRec - avgGive);
    
    if (balance < 1) {
        insights.push(`
            <div class="insight strong-match">
                <strong>🎉 Beautiful Balance:</strong> Your giving (avg ${avgGive.toFixed(1)}) 
                and receiving (avg ${avgRec.toFixed(1)}) are perfectly aligned!
            </div>`);
    } else {
        insights.push(`
            <div class="insight close-match">
                <strong>⚖️ Slight Imbalance:</strong> You give ${avgGive.toFixed(1)}/10 
                but receive ${avgRec.toFixed(1)}/10. Small adjustments can create harmony!
            </div>`);
    }
    
    return insights.join('');
}

// 🆕 NEW: COMPARE SCREEN
function showCompare() {
    const recData = [
        document.getElementById('rec_words').value,
        document.getElementById('rec_acts').value,
        document.getElementById('rec_gifts').value,
        document.getElementById('rec_time').value,
        document.getElementById('rec_touch').value
    ].map(Number);

    const giveData = [
        document.getElementById('give_words').value,
        document.getElementById('give_acts').value,
        document.getElementById('give_gifts').value,
        document.getElementById('give_time').value,
        document.getElementById('give_touch').value
    ].map(Number);

    const compareHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync Compare ❤️</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { 
            font-family: Georgia, serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333; 
        }
        .header { 
            text-align: center; 
            color: white; 
            margin-bottom: 2rem; 
        }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .charts-container { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 2rem; 
            margin: 2rem 0; 
        }
        .chart-box { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .chart-box h2 { 
            text-align: center; 
            color: #2c3e50; 
            margin-bottom: 1rem; 
        }
        .insights { 
            background: white; 
            padding: 2rem; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            margin-top: 2rem; 
        }
        .insight { 
            padding: 1rem; 
            margin: 1rem 0; 
            border-left: 4px solid #3498db; 
            background: #f8f9fa; 
            border-radius: 5px; 
        }
        .strong-match { border-left-color: #2ecc71; background: #d5f4e6; }
        .gap { border-left-color: #e74c3c; background: #fadbd8; }
        .close-match { border-left-color: #f1c40f; background: #fef9e7; }
        @media print { body { background: white; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>👫 LoveSync Compare</h1>
        <p>Your Giving vs Receiving Patterns</p>
    </div>

    <div class="charts-container">
        <div class="chart-box">
            <h2>🎯 How You Receive Love</h2>
            <canvas id="receiveChart" width="400" height="400"></canvas>
        </div>
        <div class="chart-box">
            <h2>🎁 How You Give Love</h2>
            <canvas id="giveChart" width="400" height="400"></canvas>
        </div>
    </div>

    <div class="insights">
        <h2>💡 Relationship Reflections</h2>
        ${getCompareInsights(recData, giveData)}
    </div>

    <script>
        // RENDER RECEIVE CHART
        new Chart(document.getElementById('receiveChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'],
                datasets: [{
                    label: 'Receive',
                    data: [${recData.join(',')}],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    pointBackgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
            }
        });

        // RENDER GIVE CHART
        new Chart(document.getElementById('giveChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'],
                datasets: [{
                    label: 'Give',
                    data: [${giveData.join(',')}],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    pointBackgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
            }
        });
    </script>
</body>
</html>`;

    const compareWindow = window.open('', '_blank');
    compareWindow.document.write(compareHTML);
    compareWindow.document.close();
}

// 🆕 NEW: COMPARE INSIGHTS
function getCompareInsights(recData, giveData) {
    const insights = [];
    const gaps = labels.map((_, i) => Math.abs(recData[i] - giveData[i]));
    
    // TOP 3 INSIGHTS
    if (gaps.some(g => g > 4)) {
        const bigGap = gaps.indexOf(Math.max(...gaps));
        insights.push(`
            <div class="insight gap">
                <strong>💔 Love Gap Alert:</strong> You <strong>give ${fullLabels[bigGap]} ${giveData[bigGap]}/10</strong> 
                but <strong>need ${recData[bigGap]}/10</strong>. Discuss how your partner can fill this gap!
            </div>`);
    }
    
    const matches = labels.map((_, i) => Math.min(recData[i], giveData[i]));
    const bestMatch = matches.indexOf(Math.max(...matches));
    insights.push(`
        <div class="insight strong-match">
            <strong>💚 Perfect Harmony:</strong> You both shine at <strong>${fullLabels[bestMatch]}</strong> 
            (${Math.max(...matches)}/10). Keep nurturing this strength together!
        </div>`);
    
    // OVERALL BALANCE
    const avgRec = recData.reduce((a,b)=>a+b)/5;
    const avgGive = giveData.reduce((a,b)=>a+b)/5;
    const balance = Math.abs(avgRec - avgGive);
    
    if (balance < 1) {
        insights.push(`
            <div class="insight strong-match">
                <strong>🎉 Beautiful Balance:</strong> Your giving (avg ${avgGive.toFixed(1)}) 
                and receiving (avg ${avgRec.toFixed(1)}) are perfectly aligned!
            </div>`);
    } else {
        insights.push(`
            <div class="insight close-match">
                <strong>⚖️ Slight Imbalance:</strong> You give ${avgGive.toFixed(1)}/10 
                but receive ${avgRec.toFixed(1)}/10. Small adjustments can create harmony!
            </div>`);
    }
    
    return insights.join('');
}
