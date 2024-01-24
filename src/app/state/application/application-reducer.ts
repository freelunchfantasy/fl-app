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

export function reducer(state = initialState, action: ApplicationActions.All): State {
  switch (action.type) {
    case ApplicationActions.SET_SESSION_COOKIE: {
      return {
        ...state,
        sessionCookie: action.payload,
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
