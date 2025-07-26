
let history = [];
let datasets = JSON.parse(localStorage.getItem('datasets') || '[]');

function addColor(color) {
  history.push(color);
  updateDisplay();
  runPRNGCracker();
  updateEntropyGraph();
}

function undo() {
  history.pop();
  updateDisplay();
  runPRNGCracker();
  updateEntropyGraph();
}

function clearAll() {
  history = [];
  updateDisplay();
  runPRNGCracker();
  updateEntropyGraph();
}

function updateDisplay() {
  document.getElementById("history-display").textContent = history.join(" ");
  document.getElementById("prediction-box").textContent = getPrediction();
  updateDatasetList();
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

// Save / Load Datasets
function saveDataset() {
  if (history.length === 0) {
    alert("No data to save.");
    return;
  }
  const name = prompt("Enter dataset name:");
  if (!name) return;
  datasets.push({ name, data: [...history] });
  localStorage.setItem('datasets', JSON.stringify(datasets));
  updateDatasetList();
}

function loadDataset() {
  if (datasets.length === 0) {
    alert("No saved datasets.");
    return;
  }
  const name = prompt("Enter dataset name to load:");
  const ds = datasets.find(d => d.name === name);
  if (!ds) {
    alert("Dataset not found.");
    return;
  }
  history = [...ds.data];
  updateDisplay();
  runPRNGCracker();
  updateEntropyGraph();
}

function updateDatasetList() {
  const list = document.getElementById("dataset-list");
  if (datasets.length === 0) {
    list.textContent = "No saved datasets.";
    return;
  }
  list.innerHTML = "";
  datasets.forEach(ds => {
    const div = document.createElement("div");
    div.textContent = ds.name + " (" + ds.data.length + " rounds)";
    list.appendChild(div);
  });
}

// Entropy calculation and graph with Chart.js
function calculateEntropy(arr) {
  const counts = {};
  arr.forEach(x => counts[x] = (counts[x] || 0) + 1);
  const total = arr.length;
  let entropy = 0;
  Object.values(counts).forEach(count => {
    const p = count / total;
    entropy -= p * Math.log2(p);
  });
  return entropy;
}

let entropyChart;

function updateEntropyGraph() {
  if (!entropyChart) {
    const ctx = document.getElementById('entropyChart').getContext('2d');
    entropyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Entropy',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
          tension: 0.1,
          pointRadius: 0
        }]
      },
      options: {
        animation: false,
        scales: {
          x: { display: true, title: { display: true, text: 'Round' } },
          y: { min: 0, max: 1.6, display: true, title: { display: true, text: 'Entropy' } }
        }
      }
    });
  }

  // Calculate entropy over last N rounds progressively
  const entropies = [];
  for (let i = 1; i <= history.length; i++) {
    entropies.push(calculateEntropy(history.slice(0, i)) / Math.log2(3)); // Normalize max entropy
  }

  entropyChart.data.labels = entropies.map((_, i) => i + 1);
  entropyChart.data.datasets[0].data = entropies;
  entropyChart.update();
}

// PRNG cracking worker with advanced models
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
