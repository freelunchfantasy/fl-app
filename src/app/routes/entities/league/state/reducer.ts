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
