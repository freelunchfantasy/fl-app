import { Injectable } from '@angular/core';
import { comparisonConstants } from '@app/lib/constants/comparison.constants';

@Injectable()
export class ComparisonClassService {
  constructor() {}

  getCorrectGuessResultClass(sameWord: boolean) {
    return `guess-result-field${sameWord ? ' same-result' : ''}`;
  }

  getAlphabeticalResultClass(result: string) {
    var comparisonClass = '';
    switch (result) {
      case comparisonConstants.alphabetically.EARLIER: {
        comparisonClass = 'less-than-result';
        break;
      }
      case comparisonConstants.alphabetically.LATER: {
        comparisonClass = 'greater-than-result';
        break;
      }
      case comparisonConstants.alphabetically.SAME: {
        comparisonClass = 'same-result';
        break;
      }
      default: {
        comparisonClass = '';
      }
    }
    return `guess-result-field semi-wide ${comparisonClass}`;
  }

  getNumericalResultClass(result: string) {
    var comparisonClass = '';
    switch (result) {
      case comparisonConstants.numerically.FEWER: {
        comparisonClass = 'less-than-result';
        break;
      }
      case comparisonConstants.numerically.MORE: {
        comparisonClass = 'greater-than-result';
        break;
      }
      case comparisonConstants.numerically.SAME: {
        comparisonClass = 'same-result';
        break;
      }
      default: {
        comparisonClass = '';
      }
    }
    return `guess-result-field ${comparisonClass}`;
  }

  getChronologicalResultClass(result: string) {
    var comparisonClass = '';
    switch (result) {
      case comparisonConstants.chronologically.EARLIER: {
        comparisonClass = 'less-than-result';
        break;
      }
      case comparisonConstants.chronologically.LATER: {
        comparisonClass = 'greater-than-result';
        break;
      }
      case comparisonConstants.chronologically.SAME: {
        comparisonClass = 'same-result';
        break;
      }
      default: {
        comparisonClass = '';
      }
    }
    return `guess-result-field ${comparisonClass}`;
  }

  getCorrectLettersClass(sameWord: boolean) {
    return `guess-result-field semi-wide${sameWord ? ' same-result' : ''}`;
  }

  getDefinitionResultClass(sameWord: boolean) {
    return `guess-result-field wide${sameWord ? ' same-result' : ''}`;
  }
}
