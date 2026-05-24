const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Save image data in localStorage
      localStorage.setItem("uploadedImage", e.target.result);
      // Go to preview page
      window.location.href = "preview.html";
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("reportBtn").addEventListener("click", () => {
  alert("Live Detection feature coming soon!");
});
