import { League } from '@app/lib/models/league';
import { Action } from '@ngrx/store';

export const GET_LEAGUE_DATA = '[League] Getting league data';
export const GET_LEAGUE_DATA_SUCCESS = '[League] Successfully got league data';
export const GET_LEAGUE_DATA_FAILURE = '[League] Failed to get league data';

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

export type All = GetLeagueData | GetLeagueDataSuccess | GetLeagueDataFailure;
