import { AsyncStatus } from '@app/lib/enums/async-status';
import * as LeagueActions from './league-actions';
import { League, LeagueSimulationResult, Team, TradeSimulationResult, UserLeague } from '@app/lib/models/league';

export interface State {
  userLeagues: UserLeague[];
  userLeaguesStatus: AsyncStatus;
  newUserLeagueData: League;
  newUserLeagueDataStatus: AsyncStatus;
  selectedUserLeague: UserLeague;
  leagueData: League;
  leagueDataStatus: AsyncStatus;
  leagueSimulationResult: LeagueSimulationResult;
  leagueSimulationStatus: AsyncStatus;
  tradeSimulationResult: TradeSimulationResult;
  tradeSimulationStatus: AsyncStatus;
  leagueStandings: Team[];
  leagueSchedule: number[][][];
}

const initialState: State = {
  userLeagues: null,
  userLeaguesStatus: AsyncStatus.Idle,
  newUserLeagueData: null,
  newUserLeagueDataStatus: AsyncStatus.Idle,
  selectedUserLeague: null,
  leagueData: null,
  leagueDataStatus: AsyncStatus.Idle,
  leagueSimulationResult: null,
  leagueSimulationStatus: AsyncStatus.Idle,
  tradeSimulationResult: null,
  tradeSimulationStatus: AsyncStatus.Idle,
  leagueStandings: [],
  leagueSchedule: [],
};

export function reducer(state = initialState, action: LeagueActions.All): State {
  switch (action.type) {
    case LeagueActions.GET_USER_LEAGUES: {
      return {
        ...state,
        userLeagues: null,
        userLeaguesStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.GET_USER_LEAGUES_SUCCESS: {
      return {
        ...state,
        userLeagues: action.payload,
        userLeaguesStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.GET_USER_LEAGUES_FAILURE: {
      return {
        ...state,
        userLeagues: null,
        userLeaguesStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.GET_NEW_USER_LEAGUE_DATA: {
      return {
        ...state,
        newUserLeagueData: null,
        newUserLeagueDataStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.GET_NEW_USER_LEAGUE_DATA_SUCCESS: {
      return {
        ...state,
        newUserLeagueData: action.payload,
        newUserLeagueDataStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.GET_NEW_USER_LEAGUE_DATA_FAILURE: {
      return {
        ...state,
        newUserLeagueData: null,
        newUserLeagueDataStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.SET_SELECTED_USER_LEAGUE: {
      return {
        ...state,
        selectedUserLeague: action.payload,
      };
    }

    case LeagueActions.CLEAR_SELECTED_USER_LEAGUE: {
      return {
        ...state,
        selectedUserLeague: null,
      };
    }

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

    case LeagueActions.SIMULATE_TRADE: {
      return {
        ...state,
        tradeSimulationResult: null,
        tradeSimulationStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.SIMULATE_TRADE_SUCCESS: {
      return {
        ...state,
        tradeSimulationResult: action.payload,
        tradeSimulationStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.SIMULATE_TRADE_FAILURE: {
      return {
        ...state,
        tradeSimulationResult: null,
        tradeSimulationStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.SET_LEAGUE_STANDINGS: {
      return {
        ...state,
        leagueStandings: action.standings,
      };
    }

    case LeagueActions.SET_LEAGUE_SCHEDULE: {
      return {
        ...state,
        leagueSchedule: action.schedule,
      };
    }

    case LeagueActions.RESET_LEAGUE_STATE: {
      return {
        ...initialState,
      };
    }

    case LeagueActions.RESET_TRADE_RESULT: {
      return {
        ...state,
        tradeSimulationResult: initialState.tradeSimulationResult,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
