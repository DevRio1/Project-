
// Worker to detect repeating cycles in the history
onmessage = function(e) {
  const history = e.data;
  const maxCycleLength = Math.min(20, Math.floor(history.length / 2));
  let report = '';

  for (let cycleLen = 1; cycleLen <= maxCycleLength; cycleLen++) {
    let isCycle = true;
    const cycle = history.slice(0, cycleLen).join('');

    for (let i = cycleLen; i + cycleLen <= history.length; i += cycleLen) {
      if (history.slice(i, i + cycleLen).join('') !== cycle) {
        isCycle = false;
        break;
      }
    }

    if (isCycle) {
      report = `Detected repeating cycle of length ${cycleLen}: ${cycle}`;
      break;
    }
  }

  if (!report) {
    report = 'No repeating cycle detected.';
  }

  postMessage(report);
};
