import { Component, Input, OnInit } from '@angular/core';
import { Team, TeamSimulationResult } from '@app/lib/models/league';

@Component({
  selector: 'league-standings',
  templateUrl: './league-standings.component.html',
  styleUrls: ['./league-standings.component.scss'],
})
export class LeagueStandingsComponent implements OnInit {
  @Input()
  leagueStandings: Team[] = [];

  @Input()
  userTeamId: number;

  @Input()
  leagueSimulation: TeamSimulationResult[];

  @Input()
  leagueSimulationAfterTrade: TeamSimulationResult[];

  constructor() {}

  ngOnInit() {}

  getSimulatedRecord(team: Team) {
    const before = this.leagueSimulation.find(t => t.id == team.id);
    return `${before.wins.toFixed(2)} - ${before.losses.toFixed(2)}`;
  }

  getSimulatedRecordAfterTrade(team: Team) {
    const differential = (before: number, after: number) => {
      const difference = after - before;
      return `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}`;
    };

    const before = this.leagueSimulation.find(t => t.id == team.id);
    const after = this.leagueSimulationAfterTrade.find(t => t.id == team.id);
    return `${after.wins.toFixed(2)} - ${after.losses.toFixed(2)} (${differential(before.wins, after.wins)})`;
  }

  getSimulatedLossesAfterTrade(team: Team) {
    return this.leagueSimulationAfterTrade.find(t => t.id == team.id).losses.toFixed(2);
  }

  getTeamClasses(team: Team, i: number) {
    let classes = i % 2 ? 'team-row even' : 'team-row odd';
    return `${classes} ${team.id == this.userTeamId ? 'user-team' : ''}`;
  }

  getWinDifferenceClasses(team: Team): string {
    const difference =
      this.leagueSimulationAfterTrade.find(t => t.id == team.id).wins -
      this.leagueSimulation.find(t => t.id == team.id).wins;
    if (difference == 0) return '';
    return difference > 0 ? 'positive' : 'negative';
  }
}
