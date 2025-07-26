
let history = [];

function addColor(color) {
  history.push(color);
  updateDisplay();
  runPRNGCracker();
}

function undo() {
  history.pop();
  updateDisplay();
  runPRNGCracker();
}

function clearAll() {
  history = [];
  updateDisplay();
  runPRNGCracker();
}

function updateDisplay() {
  document.getElementById("history-display").textContent = history.join(" ");
  document.getElementById("prediction-box").textContent = getPrediction();
}

// Simple prediction logic (reuse from Phase 3)
function getPrediction() {
  if (history.length === 0) return "No data yet.";

  const counts = { R: 0, B: 0, G: 0 };
  for (const c of history) {
    counts[c]++;
  }

  const total = history.length;
  const percentages = {
    R: (counts.R / total) * 100,
    B: (counts.B / total) * 100,
    G: (counts.G / total) * 100,
  };

  let streak = 1;
  for (let i = history.length - 2; i >= 0; i--) {
    if (history[i] === history[history.length - 1]) streak++;
    else break;
  }

  const likely = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0];
  const conf = percentages[likely].toFixed(1);

  return `🔮 Prediction: ${colorName(likely)} (${conf}% confidence)
🔴 R: ${counts.R} | ⚫ B: ${counts.B} | 🟢 G: ${counts.G}
Current Streak: ${history[history.length - 1]} × ${streak}`;
}

function colorName(code) {
  return code === "R" ? "RED" : code === "B" ? "BLACK" : "GREEN";
}

// Setup Web Worker
let worker = new Worker('worker.js');

worker.onmessage = function(e) {
  document.getElementById('prng-report').textContent = e.data;
};

function runPRNGCracker() {
  if (history.length < 10) {
    document.getElementById('prng-report').textContent = "Need at least 10 rounds to analyze...";
    return;
  }
  worker.postMessage(history);
}

// Image upload + OCR (reuse from previous phases)
document.getElementById("imageUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function() {
    import('https://cdn.jsdelivr.net/npm/tesseract.js@5.0.3/dist/tesseract.min.js').then(Tesseract => {
      Tesseract.recognize(reader.result, 'eng').then(({ data: { text } }) => {
        const extracted = text.match(/red|green|black/gi);
        if (extracted && extracted.length) {
          extracted.forEach(word => {
            if (word.toLowerCase() === "red") addColor("R");
            if (word.toLowerCase() === "black") addColor("B");
            if (word.toLowerCase() === "green") addColor("G");
          });
        } else {
          alert("No colors detected. Try again or enter manually.");
        }
      }).catch(() => alert("Failed to process image."));
    });
  };
  reader.readAsDataURL(file);
});
