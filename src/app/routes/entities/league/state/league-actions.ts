import { League, LeagueSimulationResult } from '@app/lib/models/league';
import { SimulateLeaguePayload } from '@app/lib/models/payloads';
import { Action } from '@ngrx/store';

export const GET_LEAGUE_DATA = '[League] Getting league data';
export const GET_LEAGUE_DATA_SUCCESS = '[League] Successfully got league data';
export const GET_LEAGUE_DATA_FAILURE = '[League] Failed to get league data';
export const SIMULATE_LEAGUE = '[League] Simulating league';
export const SIMULATE_LEAGUE_SUCCESS = '[League] Successfully simulated league';
export const SIMULATE_LEAGUE_FAILURE = '[League] Failed to simulate league';

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

export type All =
  | GetLeagueData
  | GetLeagueDataSuccess
  | GetLeagueDataFailure
  | SimulateLeague
  | SimulateLeagueSuccess
  | SimulateLeagueFailure;
