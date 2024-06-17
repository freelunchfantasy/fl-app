import * as fromLeague from './league-reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { AsyncStatus } from '@app/lib/enums/async-status';

export interface State {
  league: fromLeague.State;
}

export const reducers: ActionReducerMap<State, any> = {
  league: fromLeague.reducer,
};

export const getLeagueState = createFeatureSelector<State>('league');

export const selectUserLeagues = createSelector(getLeagueState, (state: State) => state.league.userLeagues);

export const selectUserLeaguesAreLoading = createSelector(
  getLeagueState,
  (state: State) => state.league.userLeaguesStatus == AsyncStatus.Processing
);

export const selectNflTeams = createSelector(getLeagueState, (state: State) => state.league.nflTeams);

export const selectNewUserLeagueData = createSelector(getLeagueState, (state: State) => state.league.newUserLeagueData);

export const selectNewUserLeagueDataIsLoading = createSelector(
  getLeagueState,
  (state: State) => state.league.newUserLeagueDataStatus == AsyncStatus.Processing
);

export const selectSelectedUserLeague = createSelector(
  getLeagueState,
  (state: State) => state.league.selectedUserLeague
);

export const selectLeagueData = createSelector(getLeagueState, (state: State) => state.league.leagueData);

export const selectLeagueDataIsLoading = createSelector(
  getLeagueState,
  (state: State) => state.league.leagueDataStatus == AsyncStatus.Processing
);

export const selectLeagueSimulationResult = createSelector(
  getLeagueState,
  (state: State) => state.league.leagueSimulationResult
);

export const selectLeagueSimulationIsLoading = createSelector(
  getLeagueState,
  (state: State) => state.league.leagueSimulationStatus == AsyncStatus.Processing
);

export const selectTradeSimulationResult = createSelector(
  getLeagueState,
  (state: State) => state.league.tradeSimulationResult
);

export const selectTradeSimulationIsLoading = createSelector(
  getLeagueState,
  (state: State) => state.league.tradeSimulationStatus == AsyncStatus.Processing
);

export const selectLeagueStandings = createSelector(getLeagueState, (state: State) => state.league.leagueStandings);

export const selectLeagueSchedule = createSelector(getLeagueState, (state: State) => state.league.leagueSchedule);

export const selectLeagueStartingPositions = createSelector(
  getLeagueState,
  (state: State) => state.league.leagueStartingPositions
);
