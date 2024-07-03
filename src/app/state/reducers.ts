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

export function selectUser(state: State) {
  return state.application.user;
}

export function selectUserResult(state: State) {
  return state.application.userResult;
}

export function selectUserIsLoading(state: State) {
  return state.application.userStatus == AsyncStatus.Processing;
}

export function selectRegisterStatus(state: State) {
  return state.application.registerStatus;
}

export function selectContactEmailStatus(state: State) {
  return state.application.contactEmailStatus;
}
