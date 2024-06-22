import * as ApplicationActions from './application-actions';
import { AsyncStatus } from '@app/lib/enums/async-status';
import { User, UserResult } from '@app/lib/models/user';

export interface State {
  user: User;
  userResult: UserResult;
  userStatus: AsyncStatus;
  registerStatus: AsyncStatus;
  backendUrl: string;
  sessionToken: string;
}

export const initialState: State = {
  user: null,
  userResult: null,
  userStatus: AsyncStatus.Idle,
  registerStatus: AsyncStatus.Idle,
  backendUrl: null,
  sessionToken: null,
};

export function reducer(state = initialState, action: ApplicationActions.All): State {
  switch (action.type) {
    case ApplicationActions.LOGIN: {
      return {
        ...state,
        userResult: null,
        userStatus: AsyncStatus.Processing,
      };
    }

    case ApplicationActions.LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.payload.user,
        userResult: action.payload,
        userStatus: AsyncStatus.Success,
      };
    }

    case ApplicationActions.LOGIN_FAILURE: {
      return {
        ...state,
        user: null,
        userResult: null,
        userStatus: AsyncStatus.Failure,
      };
    }

    case ApplicationActions.REGISTER: {
      return {
        ...state,
        user: null,
        userStatus: AsyncStatus.Processing,
        registerStatus: AsyncStatus.Processing,
      };
    }

    case ApplicationActions.REGISTER_SUCCESS: {
      return {
        ...state,
        userResult: action.payload,
        userStatus: AsyncStatus.Success,
        registerStatus: AsyncStatus.Success,
      };
    }

    case ApplicationActions.REGISTER_FAILURE: {
      return {
        ...state,
        user: null,
        userStatus: AsyncStatus.Failure,
        registerStatus: AsyncStatus.Failure,
      };
    }

    case ApplicationActions.SET_USER: {
      return {
        ...state,
        user: action.payload,
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
        userResult: null,
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
