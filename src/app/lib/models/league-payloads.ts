import { TradeBlock } from '@app/routes/entities/trade/trade.constants';
import { TradeSimulationResult } from './league';

export class SimulateLeaguePayload {
  userId: number;
  userLeagueId: number;
  id: number;
  teams: Team[];
  schedule: number[][][];
}

class Team {
  id: number;
  roster: Player[];
  startingLineups?: Player[];
}

class Player {}

export class CheckUserLeaguePayload {
  externalLeagueId: number;
  leagueSourceId: number;
}

export class NewUserLeaguePayload {
  externalLeagueId: number;
  leagueName: string;
  userTeamId: number;
  userTeamName?: string;
  userTeamRank?: number;
  totalTeams: number;
  leagueSourceId: number;
}

export class ShareTradeSimulationResultPayload {
  userId: number;
  userLeagueId: number;
  targetEmail: string;
  leagueStandings: Team[];
  tradeBlock: TradeBlock;
  tradeResult: TradeSimulationResult;
}
