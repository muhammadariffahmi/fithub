// chart 1: cardio metrics (excluding steps)
new Chart(document.getElementById("activityDurationChart"), {
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
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// chart 2: strength training with dropdown
const strengthCtx = document.getElementById("strengthChart").getContext("2d");

const strengthData = {
    bench: {
        label: "bench press",
        weight: [100, 110, 105, 115, 120, 125, 130],
        reps: [30, 36, 32, 40, 38, 42, 45]
    },
    deadlift: {
        label: "deadlift",
        weight: [140, 150, 145, 155, 160, 170, 165],
        reps: [25, 30, 28, 35, 36, 38, 40]
    },
    squat: {
        label: "squat",
        weight: [120, 130, 125, 135, 140, 145, 150],
        reps: [28, 32, 30, 36, 38, 40, 42]
    }
};

let currentExercise = "bench";

let strengthChart = new Chart(strengthCtx, {
    type: 'bar',
    data: {
        labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        datasets: [
            {
                label: "weight used (kg)",
                data: strengthData[currentExercise].weight,
                backgroundColor: "#970C3C"
            },
            {
                label: "reps",
                data: strengthData[currentExercise].reps,
                backgroundColor: "#7FB3D5"
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

document.getElementById("strengthSelect").addEventListener("change", function () {
    const selected = this.value;
    strengthChart.data.datasets[0].data = strengthData[selected].weight;
    strengthChart.data.datasets[1].data = strengthData[selected].reps;
    strengthChart.update();
});

// chart 3: steps (polar area, if any suggestion of better chart do suggest)
new Chart(document.getElementById("stepsChart"), {
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
        plugins: {
            legend: { display: true }
        },
        scales: {
            r: {
                beginAtZero: true
            }
        }
    }
});

// chart 4: bodyweight pie (smaller)
new Chart(document.getElementById("bodyweightChart"), {
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
        plugins: {
            legend: { display: true }
        }
    }
});