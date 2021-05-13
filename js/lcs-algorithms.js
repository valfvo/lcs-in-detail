function* subsequences(a, b, k, x, out = '') {
    if (k == 0) {
        yield out;
    }

    for (let i = a; i < b; ++i) {
        yield* subsequences(i+1, b, k-1, x, out + x[i]);
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
        l = subsequences(0, x.length, k, x);
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
  let trace = []; 

  if (y.length < x.length) {
    const tmp = x;
    x = y;
    y = tmp;
  }

  let z = '';
  let k = x.length;
  let found = false;

  do {
    l = subsequences(0, x.length, k, x);
    trace.push(`Searching a commun ${k}-subsequence...<br>`);

    for (const s of l) {
      if (isSubsequence(s, y)) {
        z = s;

        if (z == '') {
          z = '&epsi;';
        }

        trace.push(`Found a commun ${k}-subsequence : ${z}<br>`);
        found = true;
        break;
      } 
    }

    if (!found) {
      trace.push(`No commun ${k}-subsequence<br>`);
      --k;
    }
    trace.push('<br>');
  } while (!found && k >= 0);

  return [z, trace];
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

// export { lcsNaive };

const visualizeButton = document.querySelector('.visualize-button');

visualizeButton.onclick = () => {
  const activeSlide = document.querySelector('.active-slide');

  const sequenceOne = document.querySelector('.s1').value;
  const sequenceTwo = document.querySelector('.s2').value;

  if (sequenceOne === '' || sequenceTwo === '') return;

  let algorithm;
  switch (activeSlide.dataset.algorithm) {
    case 'lcs-naive':
      algorithm = lcsNaiveWithTrace;
      break;
    case 'lcs-dynamic':
      algorithm = lcsDynamic;
      break;
    default:
      break;
  };

  const [result, trace] = algorithm(sequenceOne, sequenceTwo);

  const traceContent = activeSlide.querySelector('.slide-content');
  traceContent.innerHTML = trace.join('');

  const resultContent = activeSlide.querySelector('.js-result-content');
  resultContent.innerHTML = result;

};
