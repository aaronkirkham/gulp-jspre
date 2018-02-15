// this is a regular comment

const log = (...args) => console.log.apply(console, args);

function add(a, b) {
  return a + b;
}

// @jspre "simple-subtract.js"

function multiply(a, b) {
  return a * b;
}

// @jspre "simple-divide.js"