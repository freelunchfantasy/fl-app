import { Action } from '@ngrx/store';
import {
  GameEndInfo,
  GameEndInfoPayload,
  NewGuessPayload,
  UserGuess,
  UserGuessesPayload,
} from '@app/lib/models/user-guess';

export const CLEAR_GAME_STATE = '[Game] Clearing game state';
export const GET_TODAYS_TARGET_WORD_ID =
  "[Game] Getting today's target word id";
export const GET_TODAYS_TARGET_WORD_ID_SUCCESS =
  "[Game] Successfully got today's target word id";
export const GET_TODAYS_TARGET_WORD_ID_FAILURE =
  "[Game] Failed to get today's target word id";
export const GET_USER_GUESSES = '[Game] Getting user guesses';
export const GET_USER_GUESSES_SUCCESS = '[Game] Successfully got user guesses';
export const GET_USER_GUESSES_FAILURE = '[Game] Failed to get user guesses';
export const SUBMIT_GUESS = '[Game] Submitting guesses';
export const SUBMIT_GUESS_SUCCESS = '[Game] Successfully submitted guess';
export const SUBMIT_GUESS_FAILURE = '[Game] Failed to submit guess';
export const GET_GAME_END_INFO = '[Game] Getting game end info';
export const GET_GAME_END_INFO_SUCCESS =
  '[Game] Successfully got game end info';
export const GET_GAME_END_INFO_FAILURE = '[Game] Failed to get game end info';

export class ClearGameState implements Action {
  readonly type = CLEAR_GAME_STATE;

  constructor() {}
}

export class GetTodaysTargetWordId implements Action {
  readonly type = GET_TODAYS_TARGET_WORD_ID;

  constructor(public payload: string) {}
}

export class GetTodaysTargetWordIdSuccess implements Action {
  readonly type = GET_TODAYS_TARGET_WORD_ID_SUCCESS;

  constructor(public payload: number) {}
}

export class GetTodaysTargetWordIdFailure implements Action {
  readonly type = GET_TODAYS_TARGET_WORD_ID_FAILURE;

  constructor() {}
}

export class GetUserGuesses implements Action {
  readonly type = GET_USER_GUESSES;

  constructor(public payload: UserGuessesPayload) {}
}

export class GetUserGuessesSuccess implements Action {
  readonly type = GET_USER_GUESSES_SUCCESS;

  constructor(public payload: UserGuess[]) {}
}

export class GetUserGuessesFailure implements Action {
  readonly type = GET_USER_GUESSES_FAILURE;

  constructor(public payload: any) {}
}

export class SubmitGuess implements Action {
  readonly type = SUBMIT_GUESS;

  constructor(public payload: NewGuessPayload) {}
}

export class SubmitGuessSuccess implements Action {
  readonly type = SUBMIT_GUESS_SUCCESS;

  constructor(public payload: string) {}
}

export class SubmitGuessFailure implements Action {
  readonly type = SUBMIT_GUESS_FAILURE;

  constructor(public payload: string) {}
}

export class GetGameEndInfo implements Action {
  readonly type = GET_GAME_END_INFO;
  constructor(public payload: GameEndInfoPayload) {}
}

export class GetGameEndInfoSuccess implements Action {
  readonly type = GET_GAME_END_INFO_SUCCESS;
  constructor(public payload: GameEndInfo) {}
}

export class GetGameEndInfoFailure implements Action {
  readonly type = GET_GAME_END_INFO_FAILURE;
  constructor(public payload: any) {}
}

export type All =
  | ClearGameState
  | GetTodaysTargetWordId
  | GetTodaysTargetWordIdSuccess
  | GetTodaysTargetWordIdFailure
  | GetUserGuesses
  | GetUserGuessesSuccess
  | GetUserGuessesFailure
  | SubmitGuess
  | SubmitGuessSuccess
  | SubmitGuessFailure
  | GetGameEndInfo
  | GetGameEndInfoSuccess
  | GetGameEndInfoFailure;
