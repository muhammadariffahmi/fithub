document.getElementById("okBtn").addEventListener("click", function () {
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

    if (!file) return;

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
            ctx.font = "bold 90px sans-serif";
            ctx.fillText(title, 70, 120);
            ctx.font = "70px sans-serif";
            ctx.fillText(datetime, 70, 220);

            const logo = new Image();
            logo.src = "/images/logo-long-white.png";
            logo.onload = function () {
                const desiredWidth = 500;
                const aspectRatio = logo.height / logo.width;
                const logoWidth = desiredWidth;
                const logoHeight = desiredWidth * aspectRatio;
                const x = (canvas.width - logoWidth) / 2;
                const y = canvas.height - logoHeight - 40;

                ctx.drawImage(logo, x, y, logoWidth, logoHeight);

                document.getElementById("actionButtons").style.display = "block";

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

                const container = document.getElementById("finalImageContainer");
                container.innerHTML = "";
                container.appendChild(finalImg);

                // ✅ Enable submit button
                document.getElementById("submitBtn").disabled = false;

                // ✅ Calculate and show calories
                calculateCalories();
            };
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

function calculateCalories() {
    const activityId = parseInt(document.getElementById("activityType").value, 10);
    const caloriesResult = document.getElementById("caloriesResult");
    const howCalculateBurnt = document.getElementById("howCalculateBurnt");

    const duration = getDurationInMinutes();
    const weight = parseFloat(localStorage.getItem("weight")) || 70;
    const sets = parseInt(document.getElementById("sets")?.value || 0);
    const repsInputs = document.querySelectorAll("#repsSection input");
    const totalReps = Array.from(repsInputs).reduce((sum, input) => sum + parseInt(input.value || 0), 0);

    let calories = 0;

    if (activityId >= 1 && activityId <= 5) {
        const MET = 7;
        calories = (MET * 3.5 * weight / 200) * duration;
    } else if (activityId >= 6 && activityId <= 10) {
        calories = sets * totalReps * 0.5;
    } else if (activityId >= 11 && activityId <= 20) {
        calories = sets * totalReps * 0.4;
    }

    caloriesResult.textContent = `Estimated Calories Burned: ${calories.toFixed(1)} kcal`;
    caloriesResult.style.display = "block";
    howCalculateBurnt.style.display = "block";
}

function getDurationInMinutes() {
    const hr = parseInt(document.getElementById("hours").value) || 0;
    const min = parseInt(document.getElementById("minutes").value) || 0;
    const sec = parseInt(document.getElementById("seconds").value) || 0;
    return hr * 60 + min + sec / 60;
}
