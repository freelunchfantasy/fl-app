import * as ApplicationActions from './application-actions';
import { AsyncStatus } from '@app/lib/enums/async-status';
import { User } from '@app/lib/models/user';

export interface State {
  user: User;
  userStatus: AsyncStatus;
  backendUrl: string;
  sessionToken: string;
}

export const initialState: State = {
  user: null,
  userStatus: AsyncStatus.Idle,
  backendUrl: null,
  sessionToken: null,
};

export function reducer(state = initialState, action: ApplicationActions.All): State {
  switch (action.type) {
    case ApplicationActions.LOGIN: {
      return {
        ...state,
        user: null,
        userStatus: AsyncStatus.Processing,
      };
    }

    case ApplicationActions.LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        userStatus: AsyncStatus.Success,
      };
    }

    case ApplicationActions.LOGIN_FAILURE: {
      return {
        ...state,
        user: null,
        userStatus: AsyncStatus.Failure,
      };
    }

    case ApplicationActions.SET_SESSION_TOKEN: {
      return {
        ...state,
        sessionToken: action.payload,
      };
    }

    case ApplicationActions.CLEAR_USER: {
      return {
        ...state,
        sessionToken: null,
        user: null,
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
