import { AsyncStatus } from '@app/lib/enums/async-status';
import * as GameActions from './game-actions';
import { GameEndInfo, UserGuess } from '@app/lib/models/user-guess';

export interface State {
  todaysTargetWordId: number;
  todaysTargetWordIdStatus: AsyncStatus;
  userGuesses: UserGuess[];
  userGuessesStatus: AsyncStatus;
  submitGuessStatus: AsyncStatus;
  gameEndInfo: GameEndInfo;
  gameEndInfoStatus: AsyncStatus;
}

const initialState: State = {
  todaysTargetWordId: null,
  todaysTargetWordIdStatus: AsyncStatus.Idle,
  userGuesses: [],
  userGuessesStatus: AsyncStatus.Idle,
  submitGuessStatus: AsyncStatus.Idle,
  gameEndInfo: null,
  gameEndInfoStatus: AsyncStatus.Idle,
};

export function reducer(state = initialState, action: GameActions.All): State {
  switch (action.type) {
    case GameActions.CLEAR_GAME_STATE: {
      return {
        ...initialState,
      };
    }

    case GameActions.GET_TODAYS_TARGET_WORD_ID: {
      return {
        ...state,
        todaysTargetWordId: null,
        todaysTargetWordIdStatus: AsyncStatus.Processing,
      };
    }

    case GameActions.GET_TODAYS_TARGET_WORD_ID_SUCCESS: {
      return {
        ...state,
        todaysTargetWordId: action.payload,
        todaysTargetWordIdStatus: AsyncStatus.Success,
      };
    }

    case GameActions.GET_TODAYS_TARGET_WORD_ID_FAILURE: {
      return {
        ...state,
        todaysTargetWordId: null,
        todaysTargetWordIdStatus: AsyncStatus.Failure,
      };
    }

    case GameActions.GET_USER_GUESSES: {
      return {
        ...state,
        userGuessesStatus: AsyncStatus.Processing,
      };
    }

    case GameActions.GET_USER_GUESSES_SUCCESS: {
      return {
        ...state,
        userGuesses: action.payload,
        userGuessesStatus: AsyncStatus.Success,
      };
    }

    case GameActions.GET_USER_GUESSES_FAILURE: {
      return {
        ...state,
        userGuesses: [],
        userGuessesStatus: AsyncStatus.Failure,
      };
    }

    case GameActions.SUBMIT_GUESS: {
      return {
        ...state,
        submitGuessStatus: AsyncStatus.Processing,
      };
    }

    case GameActions.SUBMIT_GUESS_SUCCESS: {
      return {
        ...state,
        submitGuessStatus: AsyncStatus.Success,
      };
    }

    case GameActions.SUBMIT_GUESS_FAILURE: {
      return {
        ...state,
        submitGuessStatus: AsyncStatus.Failure,
      };
    }

    case GameActions.GET_GAME_END_INFO: {
      return {
        ...state,
        gameEndInfo: null,
        gameEndInfoStatus: AsyncStatus.Processing,
      };
    }

    case GameActions.GET_GAME_END_INFO_SUCCESS: {
      return {
        ...state,
        gameEndInfo: action.payload,
        gameEndInfoStatus: AsyncStatus.Success,
      };
    }

    case GameActions.GET_GAME_END_INFO_FAILURE: {
      return {
        ...state,
        gameEndInfo: null,
        gameEndInfoStatus: AsyncStatus.Failure,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
