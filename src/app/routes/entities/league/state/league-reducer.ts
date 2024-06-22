import { AsyncStatus } from '@app/lib/enums/async-status';
import * as LeagueActions from './league-actions';
import {
  League,
  LeagueSimulationResult,
  LeagueSource,
  NflTeam,
  Team,
  TradeSimulationResult,
  UserLeague,
} from '@app/lib/models/league';

export interface State {
  userLeagues: UserLeague[];
  userLeaguesStatus: AsyncStatus;
  nflTeams: NflTeam[];
  leagueSources: LeagueSource[];
  newUserLeagueData: League;
  newUserLeagueDataStatus: AsyncStatus;
  checkUserLeagueResult: any;
  checkUserLeagueStatus: AsyncStatus;
  saveNewUserLeagueStatus: AsyncStatus;
  selectedUserLeague: UserLeague;
  leagueData: League;
  leagueDataStatus: AsyncStatus;
  leagueSimulationResult: LeagueSimulationResult;
  leagueSimulationStatus: AsyncStatus;
  tradeSimulationResult: TradeSimulationResult;
  tradeSimulationStatus: AsyncStatus;
  shareTradeSimulationResultStatus: AsyncStatus;
  leagueStandings: Team[];
  leagueSchedule: number[][][];
  leagueStartingPositions: string[];
}

const initialState: State = {
  userLeagues: null,
  userLeaguesStatus: AsyncStatus.Idle,
  nflTeams: null,
  leagueSources: null,
  newUserLeagueData: null,
  newUserLeagueDataStatus: AsyncStatus.Idle,
  checkUserLeagueResult: null,
  checkUserLeagueStatus: AsyncStatus.Idle,
  saveNewUserLeagueStatus: AsyncStatus.Idle,
  selectedUserLeague: null,
  leagueData: null,
  leagueDataStatus: AsyncStatus.Idle,
  leagueSimulationResult: null,
  leagueSimulationStatus: AsyncStatus.Idle,
  tradeSimulationResult: null,
  tradeSimulationStatus: AsyncStatus.Idle,
  shareTradeSimulationResultStatus: AsyncStatus.Idle,
  leagueStandings: [],
  leagueSchedule: [],
  leagueStartingPositions: [],
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

    case LeagueActions.GET_NFL_TEAMS: {
      return {
        ...state,
        nflTeams: null,
      };
    }

    case LeagueActions.GET_NFL_TEAMS_SUCCESS: {
      return {
        ...state,
        nflTeams: action.payload,
      };
    }

    case LeagueActions.GET_NFL_TEAMS: {
      return {
        ...state,
        nflTeams: null,
      };
    }

    case LeagueActions.GET_LEAGUE_SOURCES: {
      return {
        ...state,
        leagueSources: null,
      };
    }

    case LeagueActions.GET_LEAGUE_SOURCES_SUCCESS: {
      return {
        ...state,
        leagueSources: action.payload,
      };
    }

    case LeagueActions.GET_LEAGUE_SOURCES_FAILURE: {
      return {
        ...state,
        leagueSources: null,
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

    case LeagueActions.CHECK_USER_LEAGUE: {
      return {
        ...state,
        checkUserLeagueResult: null,
        checkUserLeagueStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.CHECK_USER_LEAGUE_SUCCESS: {
      return {
        ...state,
        checkUserLeagueResult: action.payload,
        checkUserLeagueStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.CHECK_USER_LEAGUE_FAILURE: {
      return {
        ...state,
        checkUserLeagueResult: null,
        checkUserLeagueStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.SAVE_NEW_USER_LEAGUE: {
      return {
        ...state,
        saveNewUserLeagueStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.SAVE_NEW_USER_LEAGUE_SUCCESS: {
      return {
        ...state,
        saveNewUserLeagueStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.SAVE_NEW_USER_LEAGUE_FAILURE: {
      return {
        ...state,
        saveNewUserLeagueStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.DELETE_USER_LEAGUE: {
      return {
        ...state,
        userLeaguesStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.DELETE_USER_LEAGUE_SUCCESS: {
      return {
        ...state,
        userLeaguesStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.DELETE_USER_LEAGUE_FAILURE: {
      return {
        ...state,
        userLeaguesStatus: AsyncStatus.Failure,
      };
    }

    case LeagueActions.SET_USER_LEAGUES: {
      return {
        ...state,
        userLeagues: action.payload,
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

    case LeagueActions.CLEAR_LEAGUE_DATA: {
      return {
        ...state,
        leagueData: null,
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

    case LeagueActions.SHARE_TRADE_SIMULATION_RESULT: {
      return {
        ...state,
        shareTradeSimulationResultStatus: AsyncStatus.Processing,
      };
    }

    case LeagueActions.SHARE_TRADE_SIMULATION_RESULT_SUCCESS: {
      return {
        ...state,
        shareTradeSimulationResultStatus: AsyncStatus.Success,
      };
    }

    case LeagueActions.SHARE_TRADE_SIMULATION_RESULT_FAILURE: {
      return {
        ...state,
        shareTradeSimulationResultStatus: AsyncStatus.Failure,
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

    case LeagueActions.SET_LEAGUE_STARTING_POSITIONS: {
      return {
        ...state,
        leagueStartingPositions: action.payload,
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
