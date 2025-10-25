// 🆕 EXPANDED DATA STRUCTURE (20 POINTS)
const loveLanguages = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const subCategories = ['Intensity', 'Frequency', 'Preference']; // 3 sub-categories per language

function getExpandedData() {
    const baseRecData = loveLanguages.map(lang => parseInt(document.getElementById(`rec_${lang.toLowerCase()}`).value) || 5);
    const baseGiveData = loveLanguages.map(lang => parseInt(document.getElementById(`give_${lang.toLowerCase()}`).value) || 5);
    
    // Generate 20 points: 5 languages x 2 (Give/Receive) x 2 derived metrics
    const expandedData = [];
    loveLanguages.forEach((lang, i) => {
        // Receive data
        expandedData.push(baseRecData[i]); // Base score
        expandedData.push(Math.floor(baseRecData[i] * 0.8)); // Intensity (80% of base)
        expandedData.push(Math.floor(baseRecData[i] * 0.6)); // Frequency (60% of base)
        // Give data
        expandedData.push(baseGiveData[i]); // Base score
        expandedData.push(Math.floor(baseGiveData[i] * 0.7)); // Intensity (70% of base)
        expandedData.push(Math.floor(baseGiveData[i] * 0.5)); // Frequency (50% of base)
    });
    return expandedData;
}

// 🆕 GENERATE SHAREABLE CODE
function generateCode() {
    const myData = getExpandedData();
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 13); // e.g., 20251025T1658
    const dataHash = btoa(String(myData.reduce((a, b) => a + b, 0))).substring(0, 6); // Base64 hash of sum
    const code = `${timestamp.substring(8, 12)}${dataHash}`.toUpperCase(); // e.g., 1658X7K9P2 (10 chars)

    const codeHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync - Share Code</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 2rem auto; padding: 1rem; text-align: center; }
        h2 { color: #3498db; }
        #codeDisplay { font-size: 1.5rem; font-weight: bold; color: #2ecc71; margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 5px; }
        button { background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; }
        button:hover { background: #2980b9; }
    </style>
</head>
<body>
    <h2>Share This Code</h2>
    <div id="codeDisplay">${code}</div>
    <p>Share this code with another person to compare your LoveSync results.</p>
    <button onclick="window.close()">Close</button>
</body>
</html>`;

    window.open().document.write(codeHTML);
    window.open().document.close();
}

// 🆕 RECEIVE AND COMPARE
function showCompare() {
    const inputHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync - Enter Compare Code</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 2rem auto; padding: 1rem; }
        h2 { color: #3498db; text-align: center; }
        .input-group { margin: 1rem 0; }
        label { display: block; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; text-transform: uppercase; }
        button { background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; }
        button:hover { background: #2980b9; }
        #error { color: red; display: none; margin-top: 1rem; }
    </style>
</head>
<body>
    <h2>Enter Compare Code</h2>
    <div class="input-group">
        <label>Enter the code shared with you:</label>
        <input type="text" id="compareCode" placeholder="e.g., 1658X7K9P2" maxlength="10">
        <button onclick="submitCode()">Submit</button>
        <div id="error">Invalid code. Please try again or generate a new one.</div>
    </div>

    <script>
        function submitCode() {
            const code = document.getElementById('compareCode').value.toUpperCase();
            if (code.length !== 10 || !/^\d{4}[A-Z]{6}$/.test(code)) {
                document.getElementById('error').style.display = 'block';
                return;
            }
            window.location.href = \`compare.html?code=${code}\`;
        }
    </script>
</body>
</html>`;

    const inputWindow = window.open();
    inputWindow.document.write(inputHTML);
    inputWindow.document.close();
}

// 🆕 DISPLAY COMPARE WITH 20 DATA POINTS
function displayCompare() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
        window.location.href = 'index.html';
        return;
    }

    // Parse my data from code (simplified; assume stored or fetched)
    const myData = getExpandedData(); // User's current data
    const timestamp = code.substring(0, 4); // e.g., 1658
    const otherData = [7, 6, 5, 8, 4, 6, 5, 4, 3, 6, 5, 4, 7, 6, 5, 8, 4, 3, 2, 1]; // Example other person's 20 points

    const compareHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LoveSync Compare ❤️</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Georgia, serif; max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa; }
        .header { text-align: center; color: #2c3e50; margin-bottom: 2rem; }
        .charts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0; }
        .chart-box { background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .chart-box h2 { text-align: center; color: #3498db; margin-bottom: 1rem; }
        .insights { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 2rem; }
        .insight { padding: 1rem; margin: 1rem 0; border-left: 4px solid #3498db; background: #f8f9fa; border-radius: 5px; }
        @media (max-width: 768px) { .charts-container { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>👫 LoveSync Compare</h1>
        <p>You vs. Another Person (Code: ${code})</p>
    </div>

    <div class="charts-container">
        <div class="chart-box">
            <h2>🎯 Your Receive Profile</h2>
            <canvas id="myReceiveChart"></canvas>
        </div>
        <div class="chart-box">
            <h2>🎯 Their Receive Profile</h2>
            <canvas id="otherReceiveChart"></canvas>
        </div>
        <div class="chart-box">
            <h2>🎁 Your Give Profile</h2>
            <canvas id="myGiveChart"></canvas>
        </div>
        <div class="chart-box">
            <h2>🎁 Their Give Profile</h2>
            <canvas id="otherGiveChart"></canvas>
        </div>
    </div>

    <div class="insights">
        <h2>💡 Key Insights</h2>
        <div class="insight">
            <strong>Top Receive Match:</strong> Your top (${getTopMatch(myData.slice(0, 10), myData.slice(10, 20))}) vs. their top (${getTopMatch(otherData.slice(0, 10), otherData.slice(10, 20))}).
        </div>
        <div class="insight">
            <strong>Top Give Match:</strong> Your top (${getTopMatch(myData.slice(10, 20), myData.slice(0, 10))}) vs. their top (${getTopMatch(otherData.slice(10, 20), otherData.slice(0, 10))}).
        </div>
    </div>

    <script>
        const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch', 'Words-I', 'Acts-I', 'Gifts-I', 'Time-I', 'Touch-I'];
        new Chart(document.getElementById('myReceiveChart'), {
            type: 'radar',
            data: { labels: labels, 
                    datasets: [{ label: 'You Receive', data: [${myData.slice(0, 10).join(',')}], 
                                backgroundColor: 'rgba(52, 152, 219, 0.2)', borderColor: '#3498db' }] },
            options: { responsive: true, scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } } }
        });
        new Chart(document.getElementById('otherReceiveChart'), {
            type: 'radar',
            data: { labels: labels, 
                    datasets: [{ label: 'Their Receive', data: [${otherData.slice(0, 10).join(',')}], 
                                backgroundColor: 'rgba(46, 204, 113, 0.2)', borderColor: '#2ecc71' }] },
            options: { responsive: true, scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } } }
        });
        new Chart(document.getElementById('myGiveChart'), {
            type: 'radar',
            data: { labels: labels, 
                    datasets: [{ label: 'You Give', data: [${myData.slice(10, 20).join(',')}], 
                                backgroundColor: 'rgba(52, 152, 219, 0.2)', borderColor: '#3498db' }] },
            options: { responsive: true, scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } } }
        });
        new Chart(document.getElementById('otherGiveChart'), {
            type: 'radar',
            data: { labels: labels, 
                    datasets: [{ label: 'Their Give', data: [${otherData.slice(10, 20).join(',')}], 
                                backgroundColor: 'rgba(46, 204, 113, 0.2)', borderColor: '#2ecc71' }] },
            options: { responsive: true, scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } } }
        });
    </script>
</body>
</html>`;

    document.write(compareHTML);
    document.close();
}
