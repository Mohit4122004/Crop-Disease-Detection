// --- Show preview image from localStorage ---
const imageData = localStorage.getItem("uploadedImage");

if (imageData) {
  document.getElementById("previewImage").src = imageData;
} else {
  alert("No image found. Redirecting...");
  window.location.href = "index.html";
}

// --- Detect button click ---
const detectBtn = document.getElementById("detectBtn");

detectBtn.addEventListener("click", async () => {
  const imageData = localStorage.getItem("uploadedImage");

  if (!imageData) {
    alert("No image found!");
    return;
  }

  try {
    // ✅ Clean base64 image (remove prefix safely)
    let base64Image = imageData.trim();
    if (base64Image.startsWith("data:image")) {
      base64Image = base64Image.split(",")[1];
    }

    console.log("📤 Sending image to backend...");

    // ✅ Add a manual timeout (e.g., 30 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text}`);
    }

    const result = await response.json();
    console.log("✅ Response:", result);

    if (result.error) {
      alert("⚠️ Backend Error: " + result.error);
    } else {
      // ✅ Save result in localStorage
      localStorage.setItem("detectedDisease", result.disease);
      localStorage.setItem("diseaseCure", result.cure);

      // ✅ Redirect to result page
      window.location.href = "result.html";
    }

  } catch (err) {
    if (err.name === "AbortError") {
      alert("❌ Request timed out! Backend took too long to respond.");
    } else {
      console.error("❌ Connection error:", err);
      alert("❌ Failed to connect to backend!\n\n" + err.message);
    }
  }
});
