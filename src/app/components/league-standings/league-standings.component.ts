import { Component, Input, OnInit } from '@angular/core';
import { Team, TeamSimulationResult } from '@app/lib/models/league';
import { StandingsService } from '@app/services/standings-service';

@Component({
  selector: 'league-standings',
  templateUrl: './league-standings.component.html',
  styleUrls: ['./league-standings.component.scss'],
})
export class LeagueStandingsComponent implements OnInit {
  @Input()
  leagueStandings: Team[] = [];

  @Input()
  userTeamId?: number;

  @Input()
  tradeTeamIds?: number[] = [];

  @Input()
  leagueSimulation: TeamSimulationResult[];

  @Input()
  leagueSimulationAfterTrade: TeamSimulationResult[];

  leagueStandingsAfterSimulation: Team[];
  leagueStandingsAfterTrade: Team[];

  constructor(private standingsService: StandingsService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.leagueSimulation) {
      this.leagueStandingsAfterSimulation = this.standingsService.constructStandings(
        this.leagueSimulation.map(t => ({
          id: t.id,
          teamName: '',
          wins: t.wins,
          roster: [],
          losses: t.losses,
          ties: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          schedule: [],
          scores: [],
          outcomes: [],
        }))
      );
    }
    if (this.leagueSimulationAfterTrade) {
      this.leagueStandingsAfterTrade = this.standingsService.constructStandings(
        this.leagueSimulationAfterTrade.map(t => ({
          id: t.id,
          teamName: '',
          wins: t.wins,
          roster: [],
          losses: t.losses,
          ties: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          schedule: [],
          scores: [],
          outcomes: [],
        }))
      );
    }
  }

  getSimulatedRecord(team: Team) {
    const before = this.leagueSimulation.find(t => t.id == team.id);
    return `${before.wins.toFixed(2)} - ${before.losses.toFixed(2)}`;
  }

  getRankChangeAfterSimulation(team: Team) {
    const rank = this.leagueStandingsAfterSimulation.findIndex(t => t.id == team.id) + 1;
    let suffix;
    switch (rank) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
    return `(${rank}${suffix})`;
  }

  getRankChangeAfterTrade(team: Team) {
    const rank = this.leagueStandingsAfterTrade.findIndex(t => t.id == team.id) + 1;
    let suffix;
    switch (rank) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
    return `(${rank}${suffix})`;
  }

  getRankChangeClasses(team: Team) {
    const before = this.leagueStandings.findIndex(t => t.id == team.id) + 1;
    const after = this.leagueStandingsAfterSimulation.findIndex(t => t.id == team.id) + 1;
    if (before - after == 0) return '';
    // before - after because lower indexes are a higher rank
    return before - after > 0 ? 'positive' : 'negative';
  }

  getRankChangeAfterTradeClasses(team: Team) {
    const before = this.leagueStandingsAfterSimulation.findIndex(t => t.id == team.id) + 1;
    const after = this.leagueStandingsAfterTrade.findIndex(t => t.id == team.id) + 1;
    if (before - after == 0) return '';
    // before - after because lower indexes are a higher rank
    return before - after > 0 ? 'positive' : 'negative';
  }

  getSimulatedRecordAfterTrade(team: Team) {
    const before = this.leagueSimulation.find(t => t.id == team.id);
    const after = this.leagueSimulationAfterTrade.find(t => t.id == team.id);
    return `${after.wins.toFixed(2)} - ${after.losses.toFixed(2)}`;
  }

  getSimulatedRecordDiffAfterTrade(team: Team) {
    const differential = (before: number, after: number) => {
      const difference = after - before;
      return `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}`;
    };

    const before = this.leagueSimulation.find(t => t.id == team.id);
    const after = this.leagueSimulationAfterTrade.find(t => t.id == team.id);
    return `(${differential(before.wins, after.wins)})`;
  }

  getTeamClasses(team: Team, i: number) {
    let classes = i % 2 ? 'team-row even' : 'team-row odd';
    classes = `${classes} ${this.leagueSimulationAfterTrade ? 'smaller' : ''}`;
    return `${classes} ${team.id == this.userTeamId || this.tradeTeamIds.includes(team.id) ? 'user-team' : ''}`;
  }

  getWinDifferenceClasses(team: Team): string {
    const difference =
      this.leagueSimulationAfterTrade.find(t => t.id == team.id).wins -
      this.leagueSimulation.find(t => t.id == team.id).wins;
    if (difference == 0) return '';
    return difference > 0 ? 'positive' : 'negative';
  }
}
