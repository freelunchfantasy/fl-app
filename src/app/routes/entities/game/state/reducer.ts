import * as fromGame from '../state/game-reducer';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { AsyncStatus } from '@app/lib/enums/async-status';

export interface State {
  game: fromGame.State;
}

export const reducers: ActionReducerMap<State, any> = {
  game: fromGame.reducer,
};

export const getGameState = createFeatureSelector<State>('game');

export const selectTodaysTargetWordId = createSelector(
  getGameState,
  (state: State) => state.game.todaysTargetWordId
);

export const selectTodaysTargetWordFinishedLoading = createSelector(
  getGameState,
  (state: State) => state.game.todaysTargetWordIdStatus == AsyncStatus.Success
);

export const selectUserGuesses = createSelector(
  getGameState,
  (state: State) => state.game.userGuesses
);

export const selectUserGuessesFinishedLoading = createSelector(
  getGameState,
  (state: State) => state.game.userGuessesStatus == AsyncStatus.Success
);

export const selectSubmitGuessStatus = createSelector(
  getGameState,
  (state: State) => state.game.submitGuessStatus
);

export const selectGameEndInfo = createSelector(
  getGameState,
  (state: State) => state.game.gameEndInfo
);

export const selectGameEndInfoFinishedLoading = createSelector(
  getGameState,
  (state: State) => state.game.gameEndInfoStatus == AsyncStatus.Success
);
