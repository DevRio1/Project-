
let history = [];

function addColor(color) {
  history.push(color);
  updateDisplay();
}

function undo() {
  history.pop();
  updateDisplay();
}

function clearAll() {
  history = [];
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("history-display").textContent = history.join(" ");
  document.getElementById("prediction-box").textContent = getPrediction();
}

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
