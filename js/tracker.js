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
const steps = document.getElementById("steps");
const setsContainer = document.getElementById("setsContainer");

activitySelect.addEventListener("change", function () {
    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 5) {
        weightUsed.style.display = "none";
        speed.style.display = "block";
        distance.style.display = "block";
        steps.style.display = "none";
        setsContainer.style.display = "none";

        if (v >= 1 && v <= 3) {
            steps.style.display = "block";
        }

    }

    if (v >= 6 && v <= 10) {
        weightUsed.style.display = "block";
        speed.style.display = "none";
        distance.style.display = "none";
        steps.style.display = "none";
        setsContainer.style.display = "block";
    }
    if (v >= 11 && v <= 20) {
        weightUsed.style.display = "none";
        speed.style.display = "none";
        distance.style.display = "none";
        steps.style.display = "none";
        setsContainer.style.display = "block";
    }
});

window.addEventListener("DOMContentLoaded", () => {

    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 3) {
        weightUsed.style.display = "none";
        speed.style.display = "block";
        distance.style.display = "block";
        steps.style.display = "block";
        setsContainer.style.display = "none";

    }

});

// AUTOMATICALLY ADD REPS
document.getElementById("sets").addEventListener("change", function () {
    const sets = parseInt(this.value); // Get number of sets
    const repsSection = document.getElementById("repsSection");
    const currentRepsFields = repsSection.querySelectorAll("input[type='number']");

    // Remove existing rep fields
    currentRepsFields.forEach(field => field.parentElement.remove());

    // Add new rep fields
    for (let i = 1; i <= sets; i++) {
        const label = document.createElement("label");
        label.textContent = `Reps for Set ${i}`;
        label.classList.add("form-label", "text-secondary");

        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("form-control");
        input.placeholder = `e.g., ${i * 10}`;
        input.min = "1";
        input.required = true;

        const container = document.createElement("div");
        container.classList.add("container", "mt-3");

        container.appendChild(label);
        container.appendChild(input);

        repsSection.appendChild(container);
    }
});

// Optional: add button to add more sets manually
document.getElementById("addSetBtn").addEventListener("click", function () {
    const setsInput = document.getElementById("sets");
    setsInput.value = parseInt(setsInput.value) + 1; // Increase the sets count
    setsInput.dispatchEvent(new Event("change")); // Re-trigger the change event to add a rep field
});


// IMAGE PREVIEW
document.getElementById("activityImage").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById("imagePreview");

    // Clear previous image (if any)
    previewContainer.innerHTML = "";

    if (file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "200px"; // 🔹 Smaller preview
        img.style.borderRadius = "10px";
        img.style.marginTop = "10px";
        img.classList.add("img-thumbnail");

        previewContainer.appendChild(img);
    }
});

// IMAGE EDIT
// IMAGE EDIT
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent actual submission

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
        alert("Please upload an image first!");
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
            ctx.font = "bold 40px sans-serif";
            ctx.fillText(title, 30, 50);
            ctx.font = "30px sans-serif";
            ctx.fillText(datetime, 30, 100);

            // Add FitHub logo at bottom center
            const logo = new Image();
            logo.src = "/images/logo-long-white.png"; // Path to your logo
            logo.onload = function () {
                const desiredWidth = 150; // Adjust this size as needed
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
});

// Show the action buttons
// document.getElementById("actionButtons").style.display = "block";

// // Handle Download
// document.getElementById("downloadBtn").addEventListener("click", function () {
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = `${title.replace(/\s+/g, "_")}_FitHub.png`;
//     link.click();
// });

// Handle Share to Facebook
document.getElementById("shareFbBtn").addEventListener("click", function () {
    const dataUrl = canvas.toDataURL("image/png");

    // Convert image to blob to upload if needed, but Facebook doesn't support direct blob sharing.
    // So we recommend uploading the image to your server and then sharing that URL.

    alert("For Facebook sharing, please upload the image to your server first and share the link.");
});


