export class SimulateLeaguePayload {
  userId?: number;
  id: number;
  teams: Team[];
  schedule: number[][][];
}

class Team {
  id: number;
  roster: Player[];
}

class Player {}

export class NewUserLeaguePayload {
  externalLeagueId: number;
  leagueName: string;
  userTeamId: number;
}
