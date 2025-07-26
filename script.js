
// Phase 5 - Advanced Cracking Logic
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
  // Simple fake prediction logic with confidence (placeholder)
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
  // TODO: Connect to worker.js for real PRNG analysis and entropy chart
}
