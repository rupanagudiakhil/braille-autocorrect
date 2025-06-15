import { BrailleAutoCorrect } from './autocorrect.js';

const system = new BrailleAutoCorrect();

function toBrailleInput(qwertyInput) {
  return qwertyInput.map(keys => system.qwertyToBrailleBin(keys));
}

describe('Braille Auto-Correct Tests', () => {
  test('Test Case 1 – Correct Input: cat', () => {
    const input = toBrailleInput([['D', 'K'], ['D', 'O'], ['Q', 'K']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(interpretedWord).toBe('cat');
    expect(suggestions).toContain('cat');
  });

  test('Test Case 2 – One typo: cac', () => {
    const input = toBrailleInput([['D', 'K'], ['D', 'O'], ['D', 'K']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(interpretedWord).toBe('cac');
    expect(suggestions).toEqual(expect.arrayContaining(['cat', 'cap', 'cab']));
  });

  test('Test Case 3 – Multiple typos: ccc', () => {
    const input = toBrailleInput([['D', 'K'], ['D', 'K'], ['D', 'K']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(interpretedWord).toBe('ccc');
    expect(suggestions).toEqual(expect.arrayContaining(['cat', 'cab']));
  });

  test('Test Case 4 – Unknown pattern: ?b', () => {
    const input = toBrailleInput([['Q', 'P'], ['D', 'W']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(interpretedWord).toMatch(/.b/);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  test('Test Case 5 – Short input: ac', () => {
    const input = toBrailleInput([['D', 'O'], ['D', 'K']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(interpretedWord).toBe('ac');
    expect(suggestions).toEqual(expect.arrayContaining(['cat', 'cab']));
  });

  test('Test Case 6 – Extra key: still cat', () => {
    const input = toBrailleInput([['D', 'W', 'K'], ['D', 'O'], ['Q', 'K']]);
    const { interpretedWord, suggestions } = system.suggestCorrections(input);
    expect(suggestions).toContain('cat');
  });
});
