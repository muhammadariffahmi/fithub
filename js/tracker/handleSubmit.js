function handleSubmit(event) {

    // Prevent page to reload
    event.preventDefault();

    // Look for image uploaded
    const file = document.getElementById("activityImage").files[0];
    if (!file) {
        alert("Please upload an image first!");
        return;
    }

    // Get all the elements for the IMAGE
    const title = document.getElementById('titleActivity').value || "My Fitness Session";
    const activityType = document.getElementById('activityType').value;
    const dateTimeInput = document.getElementById('datetime').value;

    // Change Date and Time format to be displayed
    const datetime = dateTimeInput
        ? new Date(dateTimeInput).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", " |")
        : new Date().toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", " |");

    // Get the elements to be STORED
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const duration = `${hours}h ${minutes}m ${seconds}s`;

    const notes = document.getElementById('notes').value;

    // Save to localStorage
    const activity = { title, activityType, dateTime: dateTimeInput, duration, notes };
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));

    // IMAGE EDIT
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById("resultCanvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillStyle = "white";
            ctx.font = "bold 40px sans-serif";
            ctx.fillText(title, 30, 50);
            ctx.font = "30px sans-serif";
            ctx.fillText(datetime, 30, 100);

            const logo = new Image();
            logo.src = "/images/logo-long-white.png";
            logo.onload = function () {
                const desiredWidth = 170;
                const aspectRatio = logo.height / logo.width;
                const logoWidth = desiredWidth;
                const logoHeight = desiredWidth * aspectRatio;

                const x = (canvas.width - logoWidth) / 2;
                const y = canvas.height - logoHeight - 20;
                ctx.drawImage(logo, x, y, logoWidth, logoHeight);

                document.getElementById("actionButtons").style.display = "block";

                // Download image button
                document.getElementById("downloadBtn").onclick = function () {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `${title.replace(/\s+/g, "_")}_FitHub.png`;
                    link.click();
                };

                const finalImg = new Image();
                finalImg.src = canvas.toDataURL("image/png");
                finalImg.style.width = "400px";
                finalImg.style.marginTop = "10px";
                finalImg.classList.add("img-thumbnail");

                document.getElementById("finalImageContainer").innerHTML = "";
                document.getElementById("finalImageContainer").appendChild(finalImg);
            };
        };
        img.src = event.target.result;
    };

    // ✅ This must be *outside* reader.onload
    reader.onloadend = function () {
        event.target.reset();
        loadActivities();
    };

    reader.readAsDataURL(file);


}

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    document.getElementById("activityForm").addEventListener("submit", handleSubmit);
});

