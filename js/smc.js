function* subsequences(a, b, k, x, out = '') {
    if (k == 0) {
        yield out;
    }

    for (let i = a; i < b; ++i) {   
        yield* subsequences(i+1, b, k-1, x, out + x[i]);
    }
}

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

function longestCommunSubsequence(x, y) {
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

function lcsAux(i, j, z, S) {
    if (i != 0 && j != 0 &&  S[i][j] == S[i - 1][j - 1] + 1) {
        lcsAux(i - 1, j - 1, x[i - 1] + z, S);
    }

    if (i != 0 && j != 0 && S[i][j] == S[i - 1][j]) {
        lcsAux(i - 1, j, z, S);
    }

    if (i != 0 && j != 0 && S[i][j] == S[i][j - 1]) {
        lcsAux(i, j - 1, z, S);
    }

    if (i == 0 || j == 0) {
        console.log(z);
        // yield z;
    }
}

function longestCommunSubsequences(x, y) {
    const m = x.length;
    const n = y.length;

    let S = lcsMatrix(x, y);
    lcsAux(m, n, '', S);
    // yield* lcsAux(m, n, '', S);
}

let x = 'AGCTGA';
let y = 'CAGATCAGAG';
// console.log(longestCommunSubsequence(x, y));
longestCommunSubsequences(x, y);
// console.log(Array.from(longestCommunSubsequences(x, y)));
