document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent actual form submission

    const activityId = parseInt(document.getElementById("activityType").value, 10);
    const caloriesResult = document.getElementById("caloriesResult");
    const howCalculateBurnt = document.getElementById("howCalculateBurnt");

    let duration = getDurationInMinutes();
    let weight = parseFloat(localStorage.getItem("weight")) || 70;
    let sets = parseInt(document.getElementById("sets")?.value || 0);
    let repsInputs = document.querySelectorAll("#repsSection input");
    let totalReps = Array.from(repsInputs).reduce((sum, input) => sum + parseInt(input.value || 0), 0);

    let calories = 0;

    // --- CARDIO ACTIVITIES ---
    if (activityId >= 1 && activityId <= 5) {
        const MET = 7; // Average MET for cardio like running, cycling etc.
        calories = (MET * 3.5 * weight / 200) * duration;
    }

    // --- STRENGTH TRAINING ---
    else if (activityId >= 6 && activityId <= 10) {
        calories = (sets * totalReps * 0.5); // ~0.5 cal per rep
    }

    // --- BODYWEIGHT EXERCISES ---
    else if (activityId >= 11 && activityId <= 20) {
        calories = (sets * totalReps * 0.4); // ~0.4 cal per rep
    }

    // Format result
    caloriesResult.textContent = `Estimated Calories Burned: ${calories.toFixed(1)} kcal`;
    caloriesResult.style.display = "block";
    howCalculateBurnt.style.display = "block";
});

function getDurationInMinutes() {
    const hr = parseInt(document.getElementById("hours").value) || 0;
    const min = parseInt(document.getElementById("minutes").value) || 0;
    const sec = parseInt(document.getElementById("seconds").value) || 0;
    return hr * 60 + min + sec / 60;
}





