import { AsyncStatus } from '@app/lib/enums/async-status';
import * as LeagueActions from './league-actions';
import { League, LeagueSimulationResult } from '@app/lib/models/league';

export interface State {
  leagueData: League;
  leagueDataStatus: AsyncStatus;
  leagueSimulationResult: LeagueSimulationResult;
  leagueSimulationStatus: AsyncStatus;
}

const initialState: State = {
  leagueData: null,
  leagueDataStatus: AsyncStatus.Idle,
  leagueSimulationResult: null,
  leagueSimulationStatus: AsyncStatus.Idle,
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

    case LeagueActions.SIMULATE_LEAGUE: {
      return {
        ...state,
        leagueSimulationResult: null,
        leagueSimulationStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.SIMULATE_LEAGUE_SUCCESS: {
      return {
        ...state,
        leagueSimulationResult: action.payload,
        leagueSimulationStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.SIMULATE_LEAGUE_FAILURE: {
      return {
        ...state,
        leagueSimulationResult: null,
        leagueSimulationStatus: AsyncStatus.Failure,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
