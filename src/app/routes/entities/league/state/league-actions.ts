import { League, LeagueSimulationResult, Team } from '@app/lib/models/league';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { Action } from '@ngrx/store';

export const GET_LEAGUE_DATA = '[League] Getting league data';
export const GET_LEAGUE_DATA_SUCCESS = '[League] Successfully got league data';
export const GET_LEAGUE_DATA_FAILURE = '[League] Failed to get league data';
export const SIMULATE_LEAGUE = '[League] Simulating league';
export const SIMULATE_LEAGUE_SUCCESS = '[League] Successfully simulated league';
export const SIMULATE_LEAGUE_FAILURE = '[League] Failed to simulate league';
export const SET_LEAGUE_STANDINGS = '[League] Setting league standings in league store';
export const SET_LEAGUE_SCHEDULE = '[League] Setting league schedule in league store';

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

export class SetLeagueStandings implements Action {
  readonly type = SET_LEAGUE_STANDINGS;

  constructor(public standings: Team[]) {}
}

export class SetLeagueSchedule implements Action {
  readonly type = SET_LEAGUE_SCHEDULE;

  constructor(public schedule: number[][][]) {}
}

export type All =
  | GetLeagueData
  | GetLeagueDataSuccess
  | GetLeagueDataFailure
  | SimulateLeague
  | SimulateLeagueSuccess
  | SimulateLeagueFailure
  | SetLeagueStandings
  | SetLeagueSchedule;
