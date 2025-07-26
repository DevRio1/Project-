const historyList = document.getElementById("history-list");
let history = [];

function addToHistory(color) {
  history.push(color);
  updateHistoryUI();
}

function updateHistoryUI() {
  historyList.innerHTML = "";
  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `Round ${index + 1}: ${entry}`;
    historyList.appendChild(li);
  });
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
