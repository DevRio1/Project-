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


function analyzeHistory() {
  if (history.length === 0) return;

  let stats = { R: 0, B: 0, G: 0 };
  let streakColor = history[history.length - 1];
  let streakCount = 1;

  // Count stats
  for (let i = history.length - 1; i >= 0; i--) {
    stats[history[i]] = (stats[history[i]] || 0) + 1;
    if (i < history.length - 1 && history[i] === streakColor) {
      streakCount++;
    } else if (i < history.length - 1) {
      break;
    }
  }

  // Determine prediction
  let prediction = "";
  let confidence = 50;
  if (streakCount >= 3) {
    prediction = (streakColor === "R") ? "B" : "R"; // Reversal after 3+
    confidence = 80;
  } else {
    let sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    prediction = sorted[0][0]; // Most frequent
    confidence = 60;
  }

  // Check overdue green
  if (stats["G"] <= 2) {
    prediction = "G";
    confidence = 70;
  }

  const predBox = document.getElementById("prediction-box");
  predBox.innerHTML = `🔮 Prediction: <strong>${prediction}</strong> (${confidence}% confidence)<br>
  🔴 R: ${stats["R"]} | ⚫ B: ${stats["B"]} | 🟢 G: ${stats["G"]}<br>
  Current Streak: ${streakColor} × ${streakCount}`;
}

function updateDisplay() {
  const display = document.getElementById("history-display");
  display.textContent = history.join(" ");
  analyzeHistory();
}
