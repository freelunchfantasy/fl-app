import { Team } from '@app/lib/models/league';

export class ScheduleService {
  constructLeagueSchedule(teams: Team[], numWeeks: number): number[][][] {
    let leagueSchedule: number[][][] = [];
    let i = 0;
    while (i < numWeeks) {
      let matchups: number[][] = [];
      teams.forEach(team => {
        const matchupIndex = this.findMatchupIndex(matchups, team.schedule[i]);
        if (matchupIndex == -1) {
          matchups.push([team.id]);
        } else {
          matchups[matchupIndex].push(team.id);
        }
      });
      leagueSchedule.push(matchups);
      i++;
    }
    return leagueSchedule;
  }

  findMatchupIndex(matchups: number[][], opponentTeamId: number): number {
    let index = -1;
    let i = 0;
    matchups.forEach(matchup => {
      if (matchup.includes(opponentTeamId)) index = i;
      i++;
    });
    return index;
  }
}
