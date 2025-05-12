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
                const desiredWidth = 170; // Adjust this size as needed
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