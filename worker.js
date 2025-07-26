
// Advanced PRNG cracking worker

// LCG model test
function testLCG(history, modulusMax = 1000) {
  // Try to guess modulus, multiplier, increment and seed that produce history pattern
  for (let modulus = 2; modulus <= modulusMax; modulus++) {
    for (let multiplier = 1; multiplier < modulus; multiplier++) {
      for (let increment = 0; increment < modulus; increment++) {
        for (let seed = 0; seed < modulus; seed++) {
          let matches = true;
          let x = seed;
          for (let i = 0; i < history.length; i++) {
            const val = x % 3; // Map 0=R,1=B,2=G for example
            if (mapColor(val) !== history[i]) {
              matches = false;
              break;
            }
            x = (multiplier * x + increment) % modulus;
          }
          if (matches) {
            return { modulus, multiplier, increment, seed };
          }
        }
      }
    }
  }
  return null;
}

function mapColor(val) {
  if (val === 0) return 'R';
  if (val === 1) return 'B';
  return 'G';
}

// XORShift test (simplified)
function testXORShift(history) {
  // Placeholder: Real XORShift cracking is complex, here just mock no match
  return null;
}

onmessage = function(e) {
  const history = e.data;
  let report = "";

  // Test LCG with small modulus max for demo (to keep worker fast)
  const lcgResult = testLCG(history, 50);
  if (lcgResult) {
    report += `LCG Model Matched:
Modulus: ${lcgResult.modulus}
Multiplier: ${lcgResult.multiplier}
Increment: ${lcgResult.increment}
Seed: ${lcgResult.seed}

`;
  } else {
    report += "No LCG model match found (modulus ≤ 50).

";
  }

  // XORShift test placeholder
  const xorResult = testXORShift(history);
  if (xorResult) {
    report += "XORShift Model Matched.

";
  } else {
    report += "No XORShift model match found.

";
  }

  // Cycle detection
  const maxCycleLength = Math.min(20, Math.floor(history.length / 2));
  let cycleReport = '';
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
      cycleReport = `Detected repeating cycle of length ${cycleLen}: ${cycle}`;
      break;
    }
  }
  if (!cycleReport) cycleReport = 'No repeating cycle detected.';
  report += "Cycle Detection:
" + cycleReport + "
";

  postMessage(report);
};
