const historyContainer = document.getElementById("history-display");
let history = [];

function addToHistory(color) {
  history.push(color[0]); // R, B, or G
  updateHistoryUI();
}

function updateHistoryUI() {
  historyContainer.textContent = history.join(" ");
}

function undoLast() {
  history.pop();
  updateHistoryUI();
}

function clearAll() {
  history = [];
  updateHistoryUI();
}

document.querySelector(".green").addEventListener("click", () => addToHistory("Green"));
document.querySelector(".black").addEventListener("click", () => addToHistory("Black"));
document.querySelector(".red").addEventListener("click", () => addToHistory("Red"));
document.getElementById("undo-btn").addEventListener("click", undoLast);
document.getElementById("clear-btn").addEventListener("click", clearAll);

// Image upload and OCR logic
document.getElementById("image-input").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById("upload-status").textContent = "Processing image...";

  const reader = new FileReader();
  reader.onload = function() {
    Tesseract.recognize(reader.result, 'eng').then(({ data: { text } }) => {
      const extracted = text.match(/red|green|black/gi);
      if (extracted && extracted.length) {
        extracted.forEach(word => {
          if (word.toLowerCase() === "red") addToHistory("Red");
          if (word.toLowerCase() === "black") addToHistory("Black");
          if (word.toLowerCase() === "green") addToHistory("Green");
        });
        document.getElementById("upload-status").textContent = "Image processed successfully!";
      } else {
        document.getElementById("upload-status").textContent = "No colors detected. Try again or enter manually.";
      }
    }).catch(() => {
      document.getElementById("upload-status").textContent = "Failed to process image.";
    });
  };
  reader.readAsDataURL(file);
});
