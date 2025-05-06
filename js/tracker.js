// ACTIVITY OPTION: OTHER
const activitySelect = document.getElementById("activityType");
const otherActivityContainer = document.getElementById("otherActivityContainer");

activitySelect.addEventListener("change", function () {
    if (activitySelect.value === "other") {
        otherActivityContainer.style.display = "block";
    } else {
        otherActivityContainer.style.display = "none";
    }
});

// Optional: trigger on page load to handle default selected option
window.addEventListener("DOMContentLoaded", () => {
    if (activitySelect.value === "other") {
        otherActivityContainer.style.display = "block";
    }
});


// FORM FOR DIFFERENT ACTIVITY
const weightUsed = document.getElementById("weightUsed");
const speed = document.getElementById("speed");
const distance = document.getElementById("distance");

activitySelect.addEventListener("change", function(){
    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 4) {
        weightUsed.style.display = "none";
        speed.style.display = "block";
        distance.style.display = "block";
    }

    if (v >= 5 && v <= 9) {
        weightUsed.style.display = "block";
        speed.style.display = "none";
        distance.style.display = "none";
    }
    if (v >= 10 && v <= 19) {
        weightUsed.style.display = "none";
        speed.style.display = "none";
        distance.style.display = "none";
    }
});

window.addEventListener("DOMContentLoaded", () => {

    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 4) {
        weightUsed.style.display = "none";
        speed.style.display = "block";
        distance.style.display = "block";
    }

});