import { QWERTY_TO_DOT, BRAILLE_TO_CHAR } from './brailleMappings.js';
import { levenshteinDistance } from './levenshtein.js';

async function loadDictionary() {
  const res = await fetch('./sampleDict.json');
  return res.json();
}

function qwertyToBrailleBin(keysPressed) {
  const dots = Array(6).fill(0);
  keysPressed.forEach((key) => {
    const pos = QWERTY_TO_DOT[key.toUpperCase()];
    if (pos) dots[pos - 1] = 1;
  });
  return dots.join('');
}

function brailleSeqToText(brailleSeq) {
  return brailleSeq.map((bin) => {
    const char = BRAILLE_TO_CHAR[bin];
 if (!char) console.warn("Unknown Braille binary: " + bin);
    return char || '?';
  }).join('');
}
function suggestCorrections(word, dictionary, topK = 3) {
  return dictionary
    .map((dictWord) => ({
      word: dictWord,
      dist: levenshteinDistance(word, dictWord),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, topK)
    .map((entry) => entry.word);
}

window.processBraille = async function () {
  const inputField = document.getElementById('input');
  const outputDiv = document.getElementById('output');
  const validationDiv = document.getElementById('validationMsg');
  const input = inputField.value.trim();

  // Clear previous messages
  validationDiv.textContent = '';
  validationDiv.style.display = 'none';
  outputDiv.innerHTML = '';

  // Validation
  if (!input) {
    validationDiv.textContent = "Please enter Braille key combinations before clicking Convert.";
    validationDiv.style.display = "block";
    return;
  } else {
    validationDiv.style.display = "none";
  }

  const tokens = input.split(/\s+/);
  const validKeys = new Set(['D', 'W', 'Q', 'K', 'O', 'P']);

  // Check each combo for valid keys
  const allValid = tokens.every(combo =>
    combo.split('+').every(key => validKeys.has(key.toUpperCase()))
  );

  if (!allValid) {
    validationDiv.textContent = "Invalid data entered. Only combinations of D, W, Q, K, O, P are allowed (e.g., D+W, Q+K).";
    validationDiv.style.display = 'block';
    return;
  }

  // Continue processing
  const dotOutput = tokens.map(combo => {
    const keys = combo.split('+');
    const dots = getActiveDots(keys);
    return  combo + ':' + (dots.length ? dots.join(', ') : 'Invalid keys');
  }).join(' | ');

  const brailleSeq = tokens.map((combo) => qwertyToBrailleBin(combo.split('+')));
  const interpreted = brailleSeqToText(brailleSeq);
  const dict = await loadDictionary();
  const suggestions = suggestCorrections(interpreted, dict);

  outputDiv.innerHTML =
    "<strong>Dot Representation:</strong> " + dotOutput + "<br/>" +
    "<strong>Interpreted Word:</strong> " + interpreted + "<br/>" +
    "<strong>Suggestions:</strong> " + (suggestions.join(', ') || 'No suggestions found');
};

function getActiveDots(keysPressed) {
  return keysPressed
    .map(key => QWERTY_TO_DOT[key.toUpperCase()])
    .filter(dot => dot)
    .sort((a, b) => a - b); // sorted for better readability
}

