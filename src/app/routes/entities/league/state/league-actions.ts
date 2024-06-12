import { League, UserLeague, LeagueSimulationResult, Team, TradeSimulationResult } from '@app/lib/models/league';
import { NewUserLeaguePayload, SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { Action } from '@ngrx/store';

export const GET_USER_LEAGUES = '[League] Getting user leagues';
export const GET_USER_LEAGUES_SUCCESS = '[League] Successfully got user leagues';
export const GET_USER_LEAGUES_FAILURE = '[League] Failed to get user leagues';
export const GET_NEW_USER_LEAGUE_DATA = '[League] Getting new user league data';
export const GET_NEW_USER_LEAGUE_DATA_SUCCESS = '[League] Successfully got new user league data';
export const GET_NEW_USER_LEAGUE_DATA_FAILURE = '[League] Failed to get new user league data';
export const SAVE_NEW_USER_LEAGUE = '[League] Saving new user league';
export const SAVE_NEW_USER_LEAGUE_SUCCESS = '[League] Successfully saved new user league';
export const SAVE_NEW_USER_LEAGUE_FAILURE = '[League] Failed to save new user league';
export const SET_SELECTED_USER_LEAGUE = '[League] Setting selected user league';
export const CLEAR_SELECTED_USER_LEAGUE = '[League] Clearing selected user league';
export const GET_LEAGUE_DATA = '[League] Getting league data';
export const GET_LEAGUE_DATA_SUCCESS = '[League] Successfully got league data';
export const GET_LEAGUE_DATA_FAILURE = '[League] Failed to get league data';
export const SIMULATE_LEAGUE = '[League] Simulating league';
export const SIMULATE_LEAGUE_SUCCESS = '[League] Successfully simulated league';
export const SIMULATE_LEAGUE_FAILURE = '[League] Failed to simulate league';
export const SIMULATE_TRADE = '[League] Simulating trade';
export const SIMULATE_TRADE_SUCCESS = '[League] Successfully simulated trade';
export const SIMULATE_TRADE_FAILURE = '[League] Failed to simulate trade';
export const SET_LEAGUE_STANDINGS = '[League] Setting league standings in league store';
export const SET_LEAGUE_SCHEDULE = '[League] Setting league schedule in league store';
export const RESET_LEAGUE_STATE = '[League] Resetting league state to initial';
export const RESET_TRADE_RESULT = '[League] Resetting trade result';

export class GetUserLeagues implements Action {
  readonly type = GET_USER_LEAGUES;
  constructor() {}
}

export class GetUserLeaguesSuccess implements Action {
  readonly type = GET_USER_LEAGUES_SUCCESS;

  constructor(public payload: UserLeague[]) {}
}

export class GetUserLeaguesFailure implements Action {
  readonly type = GET_USER_LEAGUES_FAILURE;
  constructor() {}
}

export class GetNewUserLeagueData implements Action {
  readonly type = GET_NEW_USER_LEAGUE_DATA;
  constructor(public payload: number) {}
}

export class GetNewUserLeagueDataSuccess implements Action {
  readonly type = GET_NEW_USER_LEAGUE_DATA_SUCCESS;
  constructor(public payload: League) {}
}

export class GetNewUserLeagueDataFailure implements Action {
  readonly type = GET_NEW_USER_LEAGUE_DATA_FAILURE;
  constructor() {}
}

export class SaveNewUserLeague implements Action {
  readonly type = SAVE_NEW_USER_LEAGUE;
  constructor(public payload: NewUserLeaguePayload) {}
}

export class SaveNewUserLeagueSuccess implements Action {
  readonly type = SAVE_NEW_USER_LEAGUE_SUCCESS;
  constructor(public payload: number) {}
}

export class SaveNewUserLeagueFailure implements Action {
  readonly type = SAVE_NEW_USER_LEAGUE_FAILURE;
  constructor() {}
}

export class SetSelectedUserLeague implements Action {
  readonly type = SET_SELECTED_USER_LEAGUE;
  constructor(public payload: UserLeague) {}
}

export class ClearSelectedUserLeague implements Action {
  readonly type = CLEAR_SELECTED_USER_LEAGUE;
  constructor() {}
}

export class GetLeagueData implements Action {
  readonly type = GET_LEAGUE_DATA;
  constructor(public payload: number) {}
}

export class GetLeagueDataSuccess implements Action {
  readonly type = GET_LEAGUE_DATA_SUCCESS;

  constructor(public payload: League) {}
}

export class GetLeagueDataFailure implements Action {
  readonly type = GET_LEAGUE_DATA_FAILURE;
  constructor() {}
}

export class SimulateLeague implements Action {
  readonly type = SIMULATE_LEAGUE;

  constructor(public payload: SimulateLeaguePayload) {}
}

export class SimulateLeagueSuccess implements Action {
  readonly type = SIMULATE_LEAGUE_SUCCESS;

  constructor(public payload: LeagueSimulationResult) {}
}

export class SimulateLeagueFailure implements Action {
  readonly type = SIMULATE_LEAGUE_FAILURE;

  constructor(public payload: any) {}
}

export class SimulateTrade implements Action {
  readonly type = SIMULATE_TRADE;

  constructor(public payload: SimulateLeaguePayload[]) {}
}

export class SimulateTradeSuccess implements Action {
  readonly type = SIMULATE_TRADE_SUCCESS;

  constructor(public payload: TradeSimulationResult) {}
}

export class SimulateTradeFailure implements Action {
  readonly type = SIMULATE_TRADE_FAILURE;

  constructor(public payload: any) {}
}

export class SetLeagueStandings implements Action {
  readonly type = SET_LEAGUE_STANDINGS;

  constructor(public standings: Team[]) {}
}

export class SetLeagueSchedule implements Action {
  readonly type = SET_LEAGUE_SCHEDULE;

  constructor(public schedule: number[][][]) {}
}

export class ResetLeagueState implements Action {
  readonly type = RESET_LEAGUE_STATE;

  constructor() {}
}

export class ResetTradeResult implements Action {
  readonly type = RESET_TRADE_RESULT;

  constructor() {}
}

export type All =
  | GetUserLeagues
  | GetUserLeaguesSuccess
  | GetUserLeaguesFailure
  | GetNewUserLeagueData
  | GetNewUserLeagueDataSuccess
  | GetNewUserLeagueDataFailure
  | SaveNewUserLeague
  | SaveNewUserLeagueSuccess
  | SaveNewUserLeagueFailure
  | SetSelectedUserLeague
  | ClearSelectedUserLeague
  | GetLeagueData
  | GetLeagueDataSuccess
  | GetLeagueDataFailure
  | SimulateLeague
  | SimulateLeagueSuccess
  | SimulateLeagueFailure
  | SimulateTrade
  | SimulateTradeSuccess
  | SimulateTradeFailure
  | SetLeagueStandings
  | SetLeagueSchedule
  | ResetLeagueState
  | ResetTradeResult;
