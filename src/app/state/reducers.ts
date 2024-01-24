import { AsyncStatus } from '@app/lib/enums/async-status';
import * as fromApplication from '@app/state/application/application-reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
  application: fromApplication.State;
}

export const reducers: ActionReducerMap<State, any> = {
  application: fromApplication.reducer,
};

export function selectBackendUrl(state: State) {
  return state.application.backendUrl;
}

export function selectSessionCookie(state: State) {
  return state.application.sessionCookie;
}

export function selectAuthUser(state: State) {
  return state.application.authUser;
}

export function selectAuthUserFinishedLoading(state: State) {
  return (
    state.application.authUserDataStatus == AsyncStatus.Success ||
    state.application.authUserDataStatus == AsyncStatus.Failure
  );
}

export function selectGameUser(state: State) {
  return state.application.gameUser;
}

export function selectGameUserDataFinishedLoading(state: State) {
  return state.application.gameUserDataStatus == AsyncStatus.Success;
}
