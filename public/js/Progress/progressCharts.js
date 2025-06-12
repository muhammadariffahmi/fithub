// Global variables for data management
let activityData = {
    cardio: [],
    strength: [],
    steps: [],
    bodyweight: []
};

// Fetch data from server
async function fetchActivityData(timeRange = 7) {
    try {
        const response = await fetch(`/api/activities?timeRange=${timeRange}`);
        const data = await response.json();
        
        // Process and categorize the data
        activityData = {
            cardio: data.filter(a => ['running', 'cycling', 'swimming', 'walking', 'hiking'].includes(a.activityType)),
            strength: data.filter(a => ['weightlifting', 'deadlifts', 'bench press', 'squat'].includes(a.activityType)),
            steps: data.filter(a => a.steps),
            bodyweight: data.filter(a => ['push-ups', 'pull-ups', 'squats', 'lunges', 'planks'].includes(a.activityType))
        };
        
        updateAllCharts();
    } catch (error) {
        console.error('Error fetching activity data:', error);
    }
}

// Chart 1: Cardio Activity
let activityDurationChart;
function initActivityDurationChart() {
    const ctx = document.getElementById("activityDurationChart").getContext("2d");
    activityDurationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            datasets: [
                {
                    label: "duration (min)",
                    data: [30, 25, 40, 35, 20, 45, 30],
                    borderColor: "#970C3C",
                    backgroundColor: "rgba(151, 12, 60, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "distance (km)",
                    data: [4, 3.5, 5, 4.8, 3, 6, 4.5],
                    borderColor: "#7FB3D5",
                    backgroundColor: "rgba(127, 179, 213, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "speed (km/h)",
                    data: [8, 8.4, 7.5, 8.2, 9, 7, 8.1],
                    borderColor: "#D4A59A",
                    backgroundColor: "rgba(212, 165, 154, 0.2)",
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

// Chart 2: Strength Training
let strengthChart;
function initStrengthChart() {
    const ctx = document.getElementById("strengthChart").getContext("2d");
    strengthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            datasets: [
                {
                    label: "weight used (kg)",
                    data: [100, 110, 105, 115, 120, 125, 130],
                    backgroundColor: "#970C3C"
                },
                {
                    label: "reps",
                    data: [30, 36, 32, 40, 38, 42, 45],
                    backgroundColor: "#7FB3D5"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 0
                    }
                }
            }
        }
    });

    // Update the dropdown to include all strength activities
    const strengthSelect = document.getElementById('strengthSelect');
    strengthSelect.innerHTML = `
        <option value="weightlifting">Weightlifting</option>
        <option value="deadlifts">Deadlifts</option>
        <option value="kettlebell swings">Kettlebell Swings</option>
        <option value="bicep curls">Bicep Curls</option>
        <option value="tricep dips">Tricep Dips</option>
        <option value="bench press">Bench Press</option>
        <option value="squat">Squat</option>
    `;
}

// Chart 3: Steps
let stepsChart;
function initStepsChart() {
    const ctx = document.getElementById("stepsChart").getContext("2d");
    stepsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            datasets: [{
                label: "steps",
                data: [6000, 7500, 8200, 7000, 8500, 9000, 10000],
                backgroundColor: "rgba(127, 179, 213, 0.2)",
                borderColor: "#7FB3D5",
                pointBackgroundColor: "#970C3C"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

// Chart 4: Bodyweight Exercises
let bodyweightChart;
function initBodyweightChart() {
    const ctx = document.getElementById("bodyweightChart").getContext("2d");
    bodyweightChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["push-ups", "squats", "plank (min)"],
            datasets: [{
                label: "bodyweight exercises (weekly total)",
                data: [150, 200, 60],
                backgroundColor: ["#970C3C", "#7FB3D5", "#D4A59A"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            }
        }
    });
}

// Update functions for each chart
function updateActivityDurationChart() {
    const cardioType = document.getElementById('cardioType').value;
    const filteredData = cardioType === 'all' 
        ? activityData.cardio 
        : activityData.cardio.filter(a => a.activityType === cardioType);

    const dates = [...new Set(filteredData.map(a => new Date(a.datetime).toLocaleDateString()))];
    const durationData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return dayActivities.reduce((sum, a) => sum + (a.duration.hours * 60 + a.duration.minutes), 0);
    });
    const distanceData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return dayActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
    });
    const speedData = dates.map((date, i) => {
        if (durationData[i] === 0) return 0;
        return (distanceData[i] / (durationData[i] / 60)).toFixed(1);
    });

    activityDurationChart.data.labels = dates;
    activityDurationChart.data.datasets[0].data = durationData;
    activityDurationChart.data.datasets[1].data = distanceData;
    activityDurationChart.data.datasets[2].data = speedData;
    activityDurationChart.update();
}

function updateStrengthChart() {
    const exercise = document.getElementById('strengthSelect').value;
    const filteredData = activityData.strength.filter(a => a.activityType === exercise);
    
    const dates = [...new Set(filteredData.map(a => new Date(a.datetime).toLocaleDateString()))];
    const weightData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return Math.max(...dayActivities.map(a => a.weight || 0));
    });
    const repsData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return dayActivities.reduce((sum, a) => sum + (a.reps || 0), 0);
    });

    strengthChart.data.labels = dates;
    strengthChart.data.datasets[0].data = weightData;
    strengthChart.data.datasets[1].data = repsData;
    strengthChart.update();
}

function updateStepsChart() {
    const view = document.getElementById('stepsView').value;
    const stepsData = activityData.steps;
    
    if (view === 'daily') {
        const dates = [...new Set(stepsData.map(a => new Date(a.datetime).toLocaleDateString()))];
        const dailySteps = dates.map(date => {
            const dayActivities = stepsData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
            return dayActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
        });

        stepsChart.data.labels = dates;
        stepsChart.data.datasets[0].data = dailySteps;
    } else {
        // Weekly average
        const weeks = [...new Set(stepsData.map(a => {
            const date = new Date(a.datetime);
            return `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
        }))];
        
        const weeklySteps = weeks.map(week => {
            const weekActivities = stepsData.filter(a => {
                const date = new Date(a.datetime);
                return `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}` === week;
            });
            const total = weekActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
            return Math.round(total / 7);
        });

        stepsChart.data.labels = weeks;
        stepsChart.data.datasets[0].data = weeklySteps;
    }
    stepsChart.update();
}

function updateBodyweightChart() {
    const view = document.getElementById('bodyweightView').value;
    const exercises = ['push-ups', 'squats', 'planks'];
    
    if (view === 'total') {
        const totals = exercises.map(exercise => {
            return activityData.bodyweight
                .filter(a => a.activityType === exercise)
                .reduce((sum, a) => sum + (a.reps || 0), 0);
        });

        bodyweightChart.data.labels = exercises;
        bodyweightChart.data.datasets[0].data = totals;
    } else {
        // Progression view - show last 7 days
        const dates = [...new Set(activityData.bodyweight.map(a => new Date(a.datetime).toLocaleDateString()))]
            .sort((a, b) => new Date(a) - new Date(b))
            .slice(-7);

        bodyweightChart.data.labels = dates;
        bodyweightChart.data.datasets = exercises.map(exercise => ({
            label: exercise,
            data: dates.map(date => {
                const dayActivities = activityData.bodyweight.filter(a => 
                    a.activityType === exercise && 
                    new Date(a.datetime).toLocaleDateString() === date
                );
                return dayActivities.reduce((sum, a) => sum + (a.reps || 0), 0);
            }),
            backgroundColor: exercise === 'push-ups' ? '#970C3C' : 
                           exercise === 'squats' ? '#7FB3D5' : '#D4A59A'
        }));
    }
    bodyweightChart.update();
}

// Initialize all charts
function initAllCharts() {
    initActivityDurationChart();
    initStrengthChart();
    initStepsChart();
    initBodyweightChart();
}

// Update all charts
function updateAllCharts() {
    updateActivityDurationChart();
    updateStrengthChart();
    updateStepsChart();
    updateBodyweightChart();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initAllCharts();
    fetchActivityData();

    // Time range change
    document.getElementById('timeRange').addEventListener('change', (e) => {
        fetchActivityData(e.target.value);
    });

    // Cardio type filter
    document.getElementById('cardioType').addEventListener('change', updateActivityDurationChart);

    // Strength exercise filter
    document.getElementById('strengthSelect').addEventListener('change', updateStrengthChart);

    // Steps view filter
    document.getElementById('stepsView').addEventListener('change', updateStepsChart);

    // Bodyweight view filter
    document.getElementById('bodyweightView').addEventListener('change', updateBodyweightChart);
});