import { Action } from '@ngrx/store';
import {
  GameUser,
  AuthUser,
  GetGameUserDataPayload,
} from '@app/lib/models/user';

export const LOG_OUT = '[Application] Logging user out';
export const CLEAR_USER =
  '[Application] Clearing auth and game user from state';
export const SET_SESSION_COOKIE = '[Application] Setting session cookie';
export const GET_AUTH_USER_DATA =
  '[Application] Get auth data for logged in user';
export const GET_AUTH_USER_DATA_SUCCESS =
  '[Application] Successfully got auth user data';
export const GET_AUTH_USER_DATA_FAILURE =
  '[Application] Failed to get auth user data';
export const GET_GAME_USER_DATA = '[Application] Get user data';
export const GET_GAME_USER_DATA_SUCCESS =
  '[Application] Successfully got user data';
export const GET_GAME_USER_DATA_FAILURE =
  '[Application] Failed to get user data';
export const HANDLE_BACKEND_ERROR = '[Application] Backend error occurred';
export const NAVIGATE_TO_HOME = '[Application] Navigating to home page';
export const NAVIGATE_TO_UNAVAILABLE =
  '[Application] Navigating to unavailable';

export class LogOut implements Action {
  readonly type = LOG_OUT;
}

export class ClearUser implements Action {
  readonly type = CLEAR_USER;
}

export class SetSessionCookie implements Action {
  readonly type = SET_SESSION_COOKIE;

  constructor(public payload: string) {}
}

export class GetAuthUserData implements Action {
  readonly type = GET_AUTH_USER_DATA;

  constructor() {}
}

export class GetAuthUserDataSuccess implements Action {
  readonly type = GET_AUTH_USER_DATA_SUCCESS;

  constructor(public payload: AuthUser) {}
}

export class GetAuthUserDataFailure implements Action {
  readonly type = GET_AUTH_USER_DATA_FAILURE;

  constructor(public payload?: any) {}
}

export class GetGameUserData implements Action {
  readonly type = GET_GAME_USER_DATA;

  constructor(public payload: GetGameUserDataPayload) {}
}

export class GetGameUserDataSuccess implements Action {
  readonly type = GET_GAME_USER_DATA_SUCCESS;

  constructor(public payload: GameUser) {}
}

export class GetGameUserDataFailure implements Action {
  readonly type = GET_GAME_USER_DATA_FAILURE;

  constructor(public payload?: any) {}
}

export class HandleBackendError implements Action {
  readonly type = HANDLE_BACKEND_ERROR;

  constructor(public payload: any) {}
}

export class NavigateToHome implements Action {
  readonly type = NAVIGATE_TO_HOME;
}

export class NavigateToUnavailable implements Action {
  readonly type = NAVIGATE_TO_UNAVAILABLE;
}

export type All =
  | LogOut
  | ClearUser
  | SetSessionCookie
  | GetAuthUserData
  | GetAuthUserDataSuccess
  | GetAuthUserDataFailure
  | GetGameUserData
  | GetGameUserDataSuccess
  | GetGameUserDataFailure
  | HandleBackendError
  | NavigateToHome
  | NavigateToUnavailable;
