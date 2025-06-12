document.addEventListener("DOMContentLoaded", () => {
    const activityItems = document.querySelectorAll(".activity-item");

    activityItems.forEach(item => {
        item.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById('activityDetailModal'));
            document.getElementById("modalTitle").textContent = item.dataset.title;
            document.getElementById("modalDatetime").textContent = item.dataset.datetime;
            document.getElementById("modalDuration").textContent = item.dataset.duration;
            document.getElementById("modalDistance").textContent = item.dataset.distance;
            document.getElementById("modalRate").textContent = item.dataset.rate;
            document.getElementById("modalNotes").textContent = item.dataset.notes;
            document.getElementById("modalActivityType").textContent = item.dataset.activityType;
            document.getElementById("modalSpeed").textContent = item.dataset.speed;
            document.getElementById("modalWeight").textContent = item.dataset.weightUsed || "—";
            document.getElementById("modalSteps").textContent = item.dataset.steps;
            document.getElementById("modalSets").textContent = item.dataset.sets;
            document.getElementById("modalReps").textContent = item.dataset.reps;
            document.getElementById("modalNotes").textContent = item.dataset.notes;
            document.getElementById("modalCalories").textContent = item.dataset.caloriesBurned;
            modal.show();
        });
    });
});
