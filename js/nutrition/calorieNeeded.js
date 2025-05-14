// Nutrition planner calculation

document.querySelector("#calculateBtn").addEventListener("click", function () {
    const age = parseInt(localStorage.getItem("age"));
    const weight = parseFloat(localStorage.getItem("weight"));
    const height = parseFloat(localStorage.getItem("height"));
    const gender = localStorage.getItem("gender");
    const goal = document.getElementById("goal").value;
    const caloriesBurnt = 2800; // Replace with dynamic value if needed

    if (!age || !height || !weight) return alert("Please fill in all fields");

    let bmr;

    if (gender === "male") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === "female") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
        return alert("Please select your gender");
    }

    let totalCalories;

    if (goal === "lose") {
        totalCalories = bmr - 500 + caloriesBurnt;
    } else if (goal === "gain") {
        totalCalories = bmr + 500 + caloriesBurnt;
    } else {
        totalCalories = bmr + caloriesBurnt;
    }

    document.getElementById("calorieResult").textContent =
        `You need approximately ${Math.round(totalCalories)} kcal/day to ${goal}.`;
});