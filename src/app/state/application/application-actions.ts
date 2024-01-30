import { Action } from '@ngrx/store';
import { User } from '@app/lib/models/user';
import { LoginPayload, RegisterPayload } from '@app/lib/models/auth-payloads';

export const LOGIN = '[Application] Attempting user login';
export const LOGIN_SUCCESS = '[Application] Successfully logged in user';
export const LOGIN_FAILURE = '[Application] Failed to log in user';
export const REGISTER = '[Application] Attempting to register user';
export const REGISTER_SUCCESS = '[Application] Successfully registered user';
export const REGISTER_FAILURE = '[Application] Failed to register user';
export const LOG_OUT = '[Application] Logging user out';
export const CLEAR_USER = '[Application] Clearing user from state';
export const SET_SESSION_TOKEN = '[Application] Setting session token cookie';
export const HANDLE_BACKEND_ERROR = '[Application] Backend error occurred';
export const NAVIGATE_TO_HOME = '[Application] Navigating to home page';
export const NAVIGATE_TO_LOGIN = '[Application] Navigating to login page';
export const NAVIGATE_TO_LEAGUE = '[Application] Navigating to league page';
export const NAVIGATE_TO_UNAVAILABLE = '[Application] Navigating to unavailable';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: LoginPayload) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: User) {}
}

export class LoginFailure implements Action {
  readonly type = LOGIN_FAILURE;

  constructor(public payload: any) {}
}

export class Register implements Action {
  readonly type = REGISTER;

  constructor(public payload: RegisterPayload) {}
}

export class RegisterSuccess implements Action {
  readonly type = REGISTER_SUCCESS;

  constructor(public payload: User) {}
}

export class RegisterFailure implements Action {
  readonly type = REGISTER_FAILURE;

  constructor(public payload: any) {}
}

export class LogOut implements Action {
  readonly type = LOG_OUT;
}

export class ClearUser implements Action {
  readonly type = CLEAR_USER;
}

export class SetSessionToken implements Action {
  readonly type = SET_SESSION_TOKEN;

  constructor(public payload: string) {}
}

export class HandleBackendError implements Action {
  readonly type = HANDLE_BACKEND_ERROR;

  constructor(public payload: any) {}
}

export class NavigateToHome implements Action {
  readonly type = NAVIGATE_TO_HOME;
}

export class NavigateToLogin implements Action {
  readonly type = NAVIGATE_TO_LOGIN;
}

export class NavigateToLeague implements Action {
  readonly type = NAVIGATE_TO_LEAGUE;
}

export class NavigateToUnavailable implements Action {
  readonly type = NAVIGATE_TO_UNAVAILABLE;
}

export type All =
  | Login
  | LoginSuccess
  | LoginFailure
  | Register
  | RegisterSuccess
  | RegisterFailure
  | LogOut
  | ClearUser
  | SetSessionToken
  | HandleBackendError
  | NavigateToHome
  | NavigateToUnavailable;
