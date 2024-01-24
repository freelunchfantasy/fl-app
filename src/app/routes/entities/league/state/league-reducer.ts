import { AsyncStatus } from '@app/lib/enums/async-status';
import * as LeagueActions from './league-actions';

export interface State {
  leagueData: any;
  leagueDataStatus: AsyncStatus;
}

const initialState: State = {
  leagueData: null,
  leagueDataStatus: AsyncStatus.Idle,
};

export function reducer(state = initialState, action: LeagueActions.All): State {
  switch (action.type) {
    case LeagueActions.GET_LEAGUE_DATA: {
      return {
        ...state,
        leagueData: null,
        leagueDataStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.GET_LEAGUE_DATA_SUCCESS: {
      return {
        ...state,
        leagueData: action.payload,
        leagueDataStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.GET_LEAGUE_DATA_FAILURE: {
      return {
        ...state,
        leagueData: null,
        leagueDataStatus: AsyncStatus.Failure,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
