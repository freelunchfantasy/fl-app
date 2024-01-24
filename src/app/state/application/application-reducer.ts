import * as ApplicationActions from './application-actions';
import { AsyncStatus } from '@app/lib/enums/async-status';
import { GameUser, AuthUser } from '@app/lib/models/user';

export interface State {
  sessionCookie: string;
  authUser: AuthUser;
  authUserDataStatus: AsyncStatus;
  gameUser: GameUser;
  gameUserDataStatus: AsyncStatus;
  backendUrl: string;
}

export const initialState: State = {
  sessionCookie: null,
  authUser: null,
  authUserDataStatus: AsyncStatus.Idle,
  gameUser: null,
  gameUserDataStatus: AsyncStatus.Idle,
  backendUrl: null,
};

export function reducer(
  state = initialState,
  action: ApplicationActions.All
): State {
  switch (action.type) {
    case ApplicationActions.CLEAR_USER: {
      return {
        ...state,
        authUser: null,
        gameUser: null,
        sessionCookie: null,
      };
    }

    case ApplicationActions.SET_SESSION_COOKIE: {
      return {
        ...state,
        sessionCookie: action.payload,
      };
    }

    case ApplicationActions.GET_AUTH_USER_DATA: {
      return {
        ...state,
        authUser: null,
        authUserDataStatus: AsyncStatus.Processing,
      };
    }

    case ApplicationActions.GET_AUTH_USER_DATA_SUCCESS: {
      return {
        ...state,
        authUser: action.payload,
        authUserDataStatus: AsyncStatus.Success,
      };
    }

    case ApplicationActions.GET_AUTH_USER_DATA_FAILURE: {
      return {
        ...state,
        authUser: { user_id: null, expires_in: 0, email: null },
        authUserDataStatus: AsyncStatus.Failure,
      };
    }
    case ApplicationActions.GET_GAME_USER_DATA: {
      return {
        ...state,
        gameUser: null,
        gameUserDataStatus: AsyncStatus.Processing,
      };
    }

    case ApplicationActions.GET_GAME_USER_DATA_SUCCESS: {
      return {
        ...state,
        gameUser: action.payload,
        gameUserDataStatus: AsyncStatus.Success,
      };
    }

    case ApplicationActions.GET_GAME_USER_DATA_FAILURE: {
      return {
        ...state,
        gameUser: null,
        gameUserDataStatus: AsyncStatus.Failure,
      };
    }

    case ApplicationActions.NAVIGATE_TO_HOME: {
      return {
        ...state,
      };
    }

    case ApplicationActions.NAVIGATE_TO_UNAVAILABLE: {
      return {
        ...state,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
