function generateMatrixInput() {
  const size = parseInt(document.getElementById("matrixSize").value);
  const container = document.getElementById("matrixInput");
  container.innerHTML = "";

  for (let i = 0; i < size; i++) {
    const row = document.createElement("div");
    row.className = "matrix-row";
    for (let j = 0; j < size; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.className = "matrix-element";
      input.id = `a-${i}-${j}`;
      input.value = 0;
      row.appendChild(input);
    }
    container.appendChild(row);
  }
}

function lduFactorization() {
  const n = parseInt(document.getElementById("matrixSize").value);
  const A = [];

  for (let i = 0; i < n; i++) {
    A[i] = [];
    for (let j = 0; j < n; j++) {
      A[i][j] = parseFloat(document.getElementById(`a-${i}-${j}`).value);
    }
  }

  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const U = Array.from({ length: n }, () => Array(n).fill(0));
  const D = Array.from({ length: n }, () => Array(n).fill(0));

  // LU Decomposition (Doolittle)
  for (let i = 0; i < n; i++) {
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
      U[i][k] = A[i][k] - sum;
    }

    for (let k = i; k < n; k++) {
      if (i === k) {
        L[i][i] = 1;
      } else {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
        L[k][i] = (A[k][i] - sum) / U[i][i];
      }
    }
  }

  // Extract D and normalize U
  for (let i = 0; i < n; i++) {
    D[i][i] = U[i][i];
    for (let j = i; j < n; j++) {
      U[i][j] /= D[i][i];
    }
  }

  const results = document.getElementById("results");
  results.innerHTML = "";

  displayMatrix("L Matrix", L);
  displayMatrix("D Matrix", D);
  displayMatrix("U Matrix", U);

  verifyLDU(L, D, U, A);
}

function multiplyMatrices(A, B) {
  const n = A.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function verifyLDU(L, D, U, A) {
  const LD = multiplyMatrices(L, D);
  const LDU = multiplyMatrices(LD, U);

  displayMatrix("Reconstructed Matrix (L × D × U)", LDU);

  let valid = true;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (Math.abs(A[i][j] - LDU[i][j]) > 0.01) {
        valid = false;
        break;
      }
    }
  }

  const msg = document.createElement("h3");
  msg.style.color = valid ? "green" : "red";
  msg.innerText = valid
    ? "✔ Verification Successful: A = L × D × U"
    : "✖ Verification Failed";

  document.getElementById("results").appendChild(msg);
}

function displayMatrix(titleText, matrix) {
  const results = document.getElementById("results");
  const block = document.createElement("div");
  block.className = "matrix-result";

  const title = document.createElement("h3");
  title.innerText = titleText;
  block.appendChild(title);

  matrix.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "matrix-row";
    row.forEach(val => {
      const cell = document.createElement("div");
      cell.className = "matrix-element";
      cell.innerText = val.toFixed(2);
      rowDiv.appendChild(cell);
    });
    block.appendChild(rowDiv);
  });

  results.appendChild(block);
}
