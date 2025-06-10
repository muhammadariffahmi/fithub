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
            modal.show();
        });
    });
});
