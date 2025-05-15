document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    const file = document.getElementById("activityImage").files[0];
    const title = document.getElementById("titleActivity").value || "My Workout";

    const datetimeInput = document.getElementById("datetime").value;
    const datetime = datetimeInput
        ? new Date(datetimeInput).toLocaleString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).replace(",", " |")
        : new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).replace(",", " |");

    if (!file) {
        // alert("Please upload an image first!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById("resultCanvas");
            const ctx = canvas.getContext("2d");

            // Set canvas to match image size
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image
            ctx.drawImage(img, 0, 0);

            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Overlay text
            ctx.fillStyle = "white";
            ctx.font = "bold 70px sans-serif";
            ctx.fillText(title, 70, 120);
            ctx.font = "60px sans-serif";
            ctx.fillText(datetime, 70, 220);

            // Add FitHub logo at bottom center
            const logo = new Image();
            logo.src = "/images/logo-long-white.png"; // Path to your logo
            logo.onload = function () {
                const desiredWidth = 450; // Adjust this size as needed
                const aspectRatio = logo.height / logo.width;
                const logoWidth = desiredWidth;
                const logoHeight = desiredWidth * aspectRatio;


                // Draw logo at the bottom center
                const x = (canvas.width - logoWidth) / 2;
                const y = canvas.height - logoHeight - 20; // 20px from the bottom

                ctx.drawImage(logo, x, y, logoWidth, logoHeight);

                // Make action buttons visible
                document.getElementById("actionButtons").style.display = "block";

                // Add click listener to download button
                document.getElementById("downloadBtn").onclick = function () {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `${title.replace(/\s+/g, "_")}_FitHub.png`;
                    link.click();
                };


                // Show canvas as image
                const finalImg = new Image();
                finalImg.src = canvas.toDataURL("image/png");
                finalImg.style.width = "400px"; // 🔹 Slightly bigger than upload preview
                finalImg.style.marginTop = "10px";
                finalImg.classList.add("img-thumbnail");

                document.getElementById("finalImageContainer").innerHTML = "";
                document.getElementById("finalImageContainer").appendChild(finalImg);
            };
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);

    // THIS
    const activityType = document.getElementById('activityType').value;
    const dateTime = document.getElementById('datetime').value;

    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const duration = `${hours}h ${minutes}m ${seconds}s`;

    const notes = document.getElementById('notes').value;

    const activity = {
        title,
        activityType,
        dateTime,
        duration,
        notes
    };

    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));

    loadActivities();
    event.target.reset(); // clear form


});


const activityTypes = {
    1: "Running",
    2: "Walking",
    3: "Hiking",
    4: "Swimming",
    5: "Cycling",
    6: "Weightlifting",
    7: "Deadlifts",
    8: "Kettlebell Swings",
    9: "Bicep Curls",
    10: "Tricep Dips",
    11: "Push-ups",
    12: "Pull-ups",
    13: "Squats",
    14: "Lunges",
    15: "Planks",
    16: "Sit-ups",
    17: "Mountain Climbers",
    18: "Burpees",
    19: "Leg Raises",
    20: "Glute Bridges",
    "other": "Other"
};


function loadActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="text-muted text-secondary">No activities yet.</p>';
        return;
    }

    activities.reverse().forEach((act, index) => {
        const card = document.createElement('div');
        card.className = 'card bg-secondary text-primary mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${act.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${new Date(act.dateTime).toLocaleString()}</h6>
                <p class="card-text">Activity: ${activityTypes[act.activityType] || "Unknown"}</p>
                <p class="card-text">Duration: ${act.duration}</p>
                <p class="card-text">Notes: ${act.notes}</p>
            </div>
        `;
        activityList.appendChild(card);
    });
}