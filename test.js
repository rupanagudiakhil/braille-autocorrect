import { BrailleAutoCorrect } from './autocorrect.js';

// Simulated input (D+K, D+O, D+K) intended to be "cat"
const inputQwerty = [
  ['D', 'K'], // c
  ['D', 'O'], // a
  ['D', 'K']  // typo, should be Q+K for 't'
];

const system = new BrailleAutoCorrect();

const brailleInput = inputQwerty.map(keys => system.qwertyToBrailleBin(keys));
const { interpretedWord, suggestions } = system.suggestCorrections(brailleInput);

console.log(`Braille interpreted as: ${interpretedWord}`);
console.log('Suggestions:', suggestions);
