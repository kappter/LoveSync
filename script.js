// Chart.js setup
const labels = ['Words', 'Acts', 'Gifts', 'Time', 'Touch'];
const colors = ['#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e74c3c'];
const fullLabels = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];

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
        scales: {
            r: { min: 0, max: 10, ticks: { stepSize: 2 } }
        },
        plugins: { 
            legend: { 
                position: 'bottom',
                labels: {
                    font: { size: 12 }
                }
            } 
        }
    }
};

const myChart = new Chart(document.getElementById('loveChart'), config);

// Live update function
function updateLive() {
    // Update value displays
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        document.getElementById(`val_${slider.id}`).textContent = slider.value;
    });

    // Get data
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

    // Update chart
    myChart.data.datasets[0].data = recData;
    myChart.data.datasets[1].data = giveData;
    myChart.update('none');

    // Update description
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

// Add event listeners to all sliders
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', updateLive);
    });
    updateLive(); // Initial load
});
