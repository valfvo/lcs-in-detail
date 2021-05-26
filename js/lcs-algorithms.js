function* subsequences(a, b, k, x, out = '') {
  if (k == 0) {
    yield out;
  } else {
    for (let i = a; i < b - k + 1; ++i) {
      yield* subsequences(i+1, b, k-1, x, out + x[i]);
    }
  }
}

function isSubsequenceAux(z, i, x, j) {
  if (i == z.length) return true;
  if (j == x.length) return false;

  if (z[i] == x[j]) {
    return isSubsequenceAux(z, i + 1, x, j + 1);
  }
  else {
    return isSubsequenceAux(z, i, x, j + 1);
  }
}

function isSubsequence(z, x) {
    return isSubsequenceAux(z, 0, x, 0);
}

function lcsNaive(x, y) {
  if (y.length < x.length) {
    const tmp = x;
    x = y;
    y = tmp;
  }

  let z = '';
  let k = x.length;

  do {
    const l = subsequences(0, x.length, k, x);
    for (const s of l) {
      if (isSubsequence(s, y)) {
        z = s;
        break;
      }
    }
    --k;
  } while (z == '' && k >= 0);

  return z;
}

function lcsNaiveWithTrace(x, y) {
  const startTime = performance.now();

  let trace = [];
  let traceMsg = '';

  if (y.length < x.length) {
    const tmp = x;
    x = y;
    y = tmp;
  }

  let z = '';
  let k = x.length;
  let found = false;

  do {
    const l = subsequences(0, x.length, k, x);

    traceMsg = `Searching a commun ${k}-subsequence...<br>`;
    trace.push(traceMsg);
    postMessage({type: 'trace', trace: traceMsg});

    for (const s of l) {
      if (isSubsequence(s, y)) {
        z = s;

        if (z == '') {
          z = '&epsi;';
        }

        traceMsg = `Found a commun ${k}-subsequence : ${z}<br>`;
        trace.push(traceMsg);
        postMessage({type: 'trace', trace: traceMsg});

        found = true;
        break;
      } 
    }

    if (!found) {
      traceMsg = `No commun ${k}-subsequence<br>`;
      trace.push(traceMsg);
      postMessage({type: 'trace', trace: traceMsg});

      --k;
    }

    traceMsg = '<br>';
    trace.push(traceMsg);
    postMessage({type: 'trace', trace: traceMsg});
  } while (!found && k >= 0);
  
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  return [z, elapsedTime, trace];
}

// let u = 'AGCTGA';
// let v = 'CAGATCAGAG';
// console.log(lcsNaive(u, v));

// const k = 2;
// const x = 'ACGT';
// const l = Array.from(subsequences(0, x.length, k, x));
// console.log(l);

function lcsMatrix(x, y) {
  const m = x.length;
  const n = y.length;
  let S = [];

  for (let i = 0; i <= m; ++i) {
    S[i] = [];
    S[i][0] = 0;
  }

  for (let j = 1; j <= n; ++j) {
    S[0][j] = 0;
    for (let i = 1; i <= m; ++i) {
      if (x[i - 1] == y[j - 1]) {
        S[i][j] = S[i - 1][j - 1] + 1;
      }
      else {
        S[i][j] = Math.max(S[i - 1][j], S[i][j - 1]);
      }
    }
  }

  return S;
}

function lcsLength(x, y) {
  const m = x.length;
  const n = y.length;

  return lcsMatrix(x, y)[m][n];
}

function lcsDynamic(x, y) {
  const m = x.length;
  const n = y.length;

  let S = lcsMatrix(x, y);
  console.log(S);
  let z = '';

  let i = m;
  let j = n;

  while (i != 0 && j != 0) {
    if (x[i - 1] == y[j - 1]) {
      z = x[i - 1] + z;
      --i;
      --j;
    } else if (S[i - 1][j] > S[i][j - 1]) {
      --i;
    } else {
      --j;
    }
  } 

  return z;
}

function lcsDynamicWithTrace(x, y) {
  const startTime = performance.now();

  let trace = [];

  const m = x.length;
  const n = y.length;

  let S = lcsMatrix(x, y);
  let z = '';

  let i = m;
  let j = n;

  let coloredCells = {};

  while (i != 0 && j != 0) {
    if (x[i - 1] == y[j - 1]) {
      z = x[i - 1] + z;
      coloredCells[i + '-' + j] = 1;
      --i;
      --j;
    } else if (S[i - 1][j] > S[i][j - 1]) {
      coloredCells[i + '-' + j] = 0;
      --i;
    } else {
      coloredCells[i + '-' + j] = 0;
      --j;
    }
  }
  coloredCells[i + '-' + j] = 0;

  trace.push('<table class="dynamic-table">');

  // y at the top of the table
  trace.push('<tr><th></th><th></th>'
    + y.split('').map(letter => '<th>' + letter + '</th>' ).join('')
    + '</tr>');

  trace.push(...S.map((row, iRow) => {
    let strRow = '<tr>';
    // x on the left of the table
    strRow += '<th>' + (iRow == 0 ? '' : x[iRow - 1]) + '</th>';

    strRow += row.map((e, iColumn) => {
      const color = coloredCells[iRow + '-' + iColumn];
      const isColored = color != undefined;

      return '<td ' + (isColored ? `class="colored-cell-${color}"` : '') + '>'
        + e.toString() + '</td>'
    }).join('');

    strRow += '</tr>';

    return strRow;
  }));
  
  trace.push('</table>');

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  if (z == '') {
    z = '&epsi;';
  }

  return [z, elapsedTime, trace];
}

// x, y : words
// i, j : indexes
// z : a longest commun subsequence
// S : matrix
// l : all longest commun subsequence
function lcsAux(x, i, y, j, z, S, l) {
  if (i == 0 || j == 0) {
    if (!l.includes(z)) {
      l.push(z);
    }
    return;
  }

  if (x[i - 1] == y[j - 1]) {
    lcsAux(x, i - 1, y, j - 1, x[i - 1] + z, S, l);
  }

  if (S[i][j] == S[i - 1][j]) {
    lcsAux(x, i - 1, y, j, z, S, l);
  }

  if (S[i][j] == S[i][j - 1]) {
    lcsAux(x, i, y, j - 1, z, S, l);
  }
}

function longestCommunSubsequences(x, y) {
  const m = x.length;
  const n = y.length;

  let l = [];

  let S = lcsMatrix(x, y);
  lcsAux(x, m, y, n, '', S, l);

  return l;
}

// let x = 'AGCTGA';
// let y = 'CAGATCAGAG';
// console.log(longestCommunSubsequences(x, y));
onmessage = (e) => {
  let algorithm;
  switch (e.data.algorithm) {
    case 'lcs-naive':
      algorithm = lcsNaiveWithTrace;
      break;
    case 'lcs-dynamic':
      algorithm = lcsDynamicWithTrace;
      break;
    default:
      break;
  }

  const [result, time, trace] = algorithm(e.data.sequenceOne, e.data.sequenceTwo);
  postMessage({
    algorithm: e.data.algorithm,
    result: result,
    time: time,
    trace: trace
  });
};
