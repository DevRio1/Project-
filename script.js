const historyContainer = document.getElementById("history-display");
let history = [];

function addToHistory(color) {
  history.push(color[0]); // Only keep the first letter: 'R', 'B', or 'G'
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
