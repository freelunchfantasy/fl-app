export class SimulateLeaguePayload {
  id: number;
  teams: Team[];
  schedule: number[][][];
}

class Team {
  id: number;
  roster: Player[];
}

class Player {}
