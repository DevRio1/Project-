
let history = [];

function addColor(color) {
  history.push(color);
  updateDisplay();
  postMessageToWorker();
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
  document.getElementById('history').innerText = history.join(' ');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  // Placeholder logic for image to color data
  alert("Image uploaded (placeholder). OCR logic runs here.");
}

function postMessageToWorker() {
  if (worker) worker.postMessage(history);
}

let worker = new Worker('worker.js');
worker.onmessage = function(e) {
  const { prediction, confidence, entropy } = e.data;
  document.getElementById('prediction').innerText = prediction;
  document.getElementById('confidence').innerText = confidence + "%";
  drawEntropyGraph(entropy);
}

function drawEntropyGraph(values) {
  const canvas = document.getElementById("entropyGraph");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  values.forEach((v, i) => {
    const y = canvas.height - v * canvas.height;
    if (i === 0) ctx.moveTo(i * 3, y);
    else ctx.lineTo(i * 3, y);
  });
  ctx.stroke();
}
