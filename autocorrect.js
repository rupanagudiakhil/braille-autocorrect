import { QWERTY_TO_DOT, BRAILLE_TO_CHAR } from './brailleMappings.js';
import { levenshteinDistance } from './levenshtein.js';
import fs from 'fs';

// Load dictionary once on import
const DICTIONARY = JSON.parse(fs.readFileSync('./sampleDict.json', 'utf-8'));

export class BrailleAutoCorrect {
  // Converts key combo like ['D', 'K'] → "1001.." 6-bit binary
  qwertyToBrailleBin(keysPressed) {
    const dots = Array(6).fill(0);
    for (const key of keysPressed) {
      const dotIndex = QWERTY_TO_DOT[key.toUpperCase()];
      if (dotIndex) dots[dotIndex - 1] = 1;
    }
    return dots.join('');
  }

  // Converts braille binary sequence to interpreted string
  brailleSeqToText(brailleSeq) {
    return brailleSeq
      .map((binary) => BRAILLE_TO_CHAR[binary] || '?')
      .join('');
  }

  // Suggests top K corrections from dictionary using Levenshtein distance
  suggestCorrections(brailleWords, topK = 3) {
    const interpretedWord = this.brailleSeqToText(brailleWords);

    const suggestions = DICTIONARY
      .map((word) => ({
        word,
        dist: levenshteinDistance(interpretedWord, word),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, topK)
      .map((entry) => entry.word);

    return { interpretedWord, suggestions };
  }
}

