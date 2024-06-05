import { Player, Team } from '@app/lib/models/league';
import { RosterService } from './roster-service';
import { Injectable } from '@angular/core';

@Injectable()
export class SimulationPayloadService {
  constructor(private rosterService: RosterService) {}

  constructSimulationPayload(leagueId: number, teams: Team[], schedule: number[][][], tradeBlock?: any) {
    if (tradeBlock) {
      teams = this.teamsAfterTradeExecution(teams, tradeBlock.left, tradeBlock.right);
    }
    return {
      id: leagueId,
      teams: teams.map(t => ({
        id: t.id,
        // BREAK ROSTER BETWEEN STARTERS AND BENCH? starters: this.rosterService.constructStarters(),
        roster: t.roster.map(p => ({
          id: p.id,
          name: p.name,
          scoreProjections: [p.projectedAveragePoints],
        })),
      })),
      schedule,
    };
  }

  teamsAfterTradeExecution(teams: Team[], leftBlock: Player[], rightBlock: Player[]): Team[] {
    let leftTeam: Team = teams.filter((team: Team) => team.roster.find(player => leftBlock[0].id == player.id))[0];
    let rightTeam: Team = teams.filter((team: Team) => team.roster.find(player => rightBlock[0].id == player.id))[0];
    let leftRoster: Player[] = [...leftTeam.roster];
    let rightRoster: Player[] = [...rightTeam.roster];

    // Remove players on left block from left roster and add players from right block
    leftRoster = leftRoster.filter((player: Player) => !leftBlock.map((p: Player) => p.id).includes(player.id));
    leftRoster = [...leftRoster, ...rightBlock];

    // Remove players on right block from right roster and add players from left block
    rightRoster = rightRoster.filter((player: Player) => !rightBlock.map((p: Player) => p.id).includes(player.id));
    rightRoster = [...rightRoster, ...leftBlock];

    // Reassign new roster back to league teams
    leftTeam = {
      ...leftTeam,
      roster: leftRoster,
    };
    rightTeam = {
      ...rightTeam,
      roster: rightRoster,
    };
    teams = teams.filter((team: Team) => ![leftTeam.id, rightTeam.id].includes(team.id));
    teams.push(leftTeam);
    teams.push(rightTeam);
    return teams;
  }
}
