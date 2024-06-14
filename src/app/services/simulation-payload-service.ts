import { NflTeam, Player, Team } from '@app/lib/models/league';
import { RosterService } from './roster-service';
import { Injectable } from '@angular/core';

@Injectable()
export class SimulationPayloadService {
  constructor(private rosterService: RosterService) {}

  POSITIONAL_REPLACEMENT_PROJECTIONS: any = {
    QB: 16,
    RB: 8,
    WR: 8,
    TE: 5.5,
    FLEX: 8,
    OP: 11,
    'D/ST': 5,
    K: 7,
  };

  constructSimulationPayload(
    leagueId: number,
    teams: Team[],
    schedule: number[][][],
    nflTeams: NflTeam[],
    activeRosterSettings: any,
    tradeBlock?: any
  ) {
    if (tradeBlock) {
      teams = this.teamsAfterTradeExecution(teams, tradeBlock.left, tradeBlock.right);
    }
    return {
      id: leagueId,
      teams: teams.map(t => ({
        id: t.id,
        roster: t.roster.map(p => ({
          id: p.id,
          name: p.name,
          scoreProjections: [p.projectedAveragePoints],
        })),
        startingLineups: this.determineStartingLineups(t, nflTeams, schedule, activeRosterSettings),
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

  determineStartingLineups(
    team: Team,
    nflTeams: NflTeam[],
    schedule: number[][][],
    activeRosterSettings: any
  ): any[][] {
    let week = 1;
    let startingLineups: any[][] = [];
    schedule.forEach(() => {
      startingLineups.push(
        this.rosterService
          .constructStarters(
            team.roster.map((player: Player) => ({
              ...player,
              projectedAveragePoints: nflTeams
                .filter(t => t.byeWeek == week)
                .map(t => t.abbreviation)
                .includes(player.proTeam)
                ? 0
                : player.projectedAveragePoints,
            })),
            activeRosterSettings
          )
          .map((p: Player) => ({
            pos: p.position,
            proj:
              p.projectedAveragePoints > 0
                ? p.projectedAveragePoints
                : this.POSITIONAL_REPLACEMENT_PROJECTIONS[p.position], // If 0 in lineup, assume fill with replacement level player
          }))
      );
      week++;
    });
    return startingLineups;
  }
}
