
onmessage = function(e) {
  const history = e.data;
  const reds = history.filter(x => x === 'R').length;
  const blacks = history.filter(x => x === 'B').length;
  const greens = history.filter(x => x === 'G').length;

  const total = history.length;
  const entropy = total === 0 ? [0] : Array.from({ length: total }, (_, i) => {
    const slice = history.slice(0, i + 1);
    const counts = ['R', 'B', 'G'].map(c => slice.filter(x => x === c).length / slice.length);
    return -counts.reduce((sum, p) => sum + (p ? p * Math.log2(p) : 0), 0) / Math.log2(3);
  });

  const last = history[history.length - 1];
  let prediction = 'R';
  if (last === 'R') prediction = 'B';
  else if (last === 'B') prediction = 'G';
  else prediction = 'R';

  const confidence = Math.min(99, Math.round((reds + blacks + greens) / 3));

  postMessage({ prediction, confidence, entropy });
}
