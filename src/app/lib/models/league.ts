export class League {
  leagueId: number;
  settings: Settings;
  teams: Team[];
}

export class Settings {
  name: string;
  regSeasonGames: number;
  scoringType: string;
  scoringFormat: any[];
  lineup: string[];
}

export class NflTeam {
  id: number;
  city: string;
  team: string;
  abbreviation: string;
  byeWeek: number;
}

export class Team {
  id: number;
  teamName: string;
  roster: Player[];
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  schedule: number[];
  scores: string[];
  outcomes: string[];
}

export class Player {
  id: number;
  name: string;
  position: string;
  rank: number;
  proTeam: string;
  projectedAveragePoints: number;
  projectedTotalPoints: number;
  percentStarted: number;
  stats: any;
}

export class UserLeague {
  id: number;
  userId: number;
  leagueId: number;
  leagueName: string;
  userTeamId: number;
}

export class LeagueSimulationResult {
  id: number;
  teamResults: TeamSimulationResult[];
}

export class TeamSimulationResult {
  id: number;
  wins: number;
  losses: number;
}

export class TradeSimulationResult {
  before: TeamSimulationResult[];
  after: TeamSimulationResult[];
}
