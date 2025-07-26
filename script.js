
// Phase 5.1 - Full styled UI with simple confidence prediction
let history = [];
const predictionDisplay = document.getElementById("nextPrediction");
const confidenceDisplay = document.getElementById("confidence");

function addColor(color) {
  history.push(color);
  updatePrediction();
}
function undo() {
  history.pop();
  updatePrediction();
}
function clearAll() {
  history = [];
  updatePrediction();
}
function updatePrediction() {
  let redCount = history.filter(x => x === 'R').length;
  let blackCount = history.filter(x => x === 'B').length;
  let total = history.length;

  if (total === 0) {
    predictionDisplay.textContent = '?';
    confidenceDisplay.textContent = '--%';
    return;
  }

  let prediction = redCount > blackCount ? 'R' : 'B';
  let confidence = Math.round(Math.abs(redCount - blackCount) / total * 100);
  predictionDisplay.textContent = prediction;
  confidenceDisplay.textContent = confidence + '%';

  drawEntropyChart();
}

// Dummy entropy chart filler
function drawEntropyChart() {
  const canvas = document.getElementById("entropyChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#66f";

  let bins = 10;
  let bucketSize = Math.max(1, Math.floor(history.length / bins));
  for (let i = 0; i < bins; i++) {
    let slice = history.slice(i * bucketSize, (i + 1) * bucketSize);
    let red = slice.filter(x => x === 'R').length;
    let black = slice.filter(x => x === 'B').length;
    let green = slice.filter(x => x === 'G').length;
    let entropy = 0;
    ['R', 'B', 'G'].forEach(c => {
      let p = slice.filter(x => x === c).length / (slice.length || 1);
      if (p > 0) entropy -= p * Math.log2(p);
    });
    let barHeight = entropy * 20;
    ctx.fillRect(i * 30 + 5, canvas.height - barHeight, 20, barHeight);
  }
}
