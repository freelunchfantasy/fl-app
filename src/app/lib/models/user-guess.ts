export class UserGuess {
  id: number;
  userId: number;
  word: string;
  result: string;
  resultJson?: ComparisonResult;
}

class ComparisonResult {
  sameWord: boolean;
  alphabetically: string;
  numCorrectLeadingLetters: number;
  correctLeadingLetters: string;
  numLetters: number;
  numSyllables: number;
  firstUsed: string;
  definitionPortion: string;
  comparison: any;
}

export class GameEndInfo {
  word: string;
  definition: string;
  currentStreak: number;
  longestStreak: number;
}

// PAYLOADS

export class UserGuessesPayload {
  userId: number;
  date: string;
}

export class NewGuessPayload {
  word: string;
  targetWordId: number;
  userId: number;
  currentGuessNumber: number;
  prevMatchingLetters: string;
}

export class GameEndInfoPayload {
  userId: number;
  targetWordId: number;
}
