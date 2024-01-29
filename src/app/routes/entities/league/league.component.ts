import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League, LeagueSimulationResult, Player, Team, TeamSimulationResult } from '@app/lib/models/league';
import { RosterService } from '@app/services/roster-service';
import { SimulationPayloadService } from '@app/services/simulation-payload-service';
import { LeagueDataProcessingService } from '@app/services/league-data-processing-service';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  league: League;
  leagueStandings: Team[] = [];
  userTeam: Team;

  // TODO: REPLACE WITH ACTUAL LOGIN AND USER INFO
  leagueId: number = 49454731;
  userTeamId: number = 7;

  DEFAULT_ACTIVE_ROSTER: any = {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    FLEX: 1,
    OP: 0,
    'D/ST': 1,
    K: 1,
  };
  startingPositions: string[] = [];

  starters: Player[] = [];
  bench: Player[] = [];
  eligibleBenchReplacementsForSelectedStarter: Player[] = [];
  eligibleSlotsForSelectedBenchPlayer: boolean[] = [];
  leagueSchedule: number[][][];

  swappingStarter: boolean = false;
  swappingBench: boolean = false;
  currSwappingStarter: Player;
  currSwappingStarterIndex: number;
  currSwappingBenchPlayer: Player;

  simulationResult: LeagueSimulationResult;
  simulatedWinsByTeamId: any;
  simulatedLossesByTeamId: any;

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private cookieService: CookieService,
    private leagueStore: Store<fromLeagueRoot.State>,
    private leagueDataProcessingService: LeagueDataProcessingService,
    private rosterService: RosterService,
    private simulationPayloadService: SimulationPayloadService
  ) {}

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  leagueSimulationResult$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSimulationResult);
  }

  leagueSimulationIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSimulationIsLoading);
  }

  leagueStandings$(): Observable<Team[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueStandings);
  }

  leagueSchedule$(): Observable<number[][][]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSchedule);
  }

  ngOnInit() {
    const leagueDataSubscription = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          if (leagueData) {
            this.leagueDataProcessingService.processLeagueData(leagueData);

            // League data processing specific for this component
            this.league = leagueData;
            this.userTeam = leagueData.teams.find((team: Team) => team.id == this.userTeamId);
            this.starters = this.rosterService.constructStarters(this.userTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
            this.bench = this.userTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
            this.startingPositions = this.rosterService.constructStartingPositions(this.DEFAULT_ACTIVE_ROSTER);
            this.eligibleSlotsForSelectedBenchPlayer = this.startingPositions.map(p => false);
          } else {
            this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId));
          }
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);

    const leagueStandingsSubscription = this.leagueStandings$().subscribe(standings => {
      if ((standings || []).length) {
        this.leagueStandings = standings;
      }
    });
    this.subscriptions.push(leagueStandingsSubscription);

    const leagueScheduleSubscription = this.leagueSchedule$().subscribe(schedule => {
      if ((schedule || []).length) {
        this.leagueSchedule = schedule;
      }
    });
    this.subscriptions.push(leagueScheduleSubscription);

    const leagueSimulationSubscription = combineLatest([
      this.leagueSimulationResult$(),
      this.leagueSimulationIsLoading$(),
    ]).subscribe(([result, isLoading]) => {
      if (!isLoading && result) {
        this.processLeagueSimulationResult(result);
      }
    });
    this.subscriptions.push(leagueSimulationSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processLeagueSimulationResult(result: LeagueSimulationResult) {
    this.simulationResult = result;
    let wins: any = {};
    let losses: any = {};
    result.teamResults.forEach((tr: TeamSimulationResult) => {
      wins[tr.id] = tr.wins.toFixed(2);
      losses[tr.id] = tr.losses.toFixed(2);
    });
    this.simulatedWinsByTeamId = wins;
    this.simulatedLossesByTeamId = losses;
  }

  simulateSeason() {
    const simulationPayload = this.simulationPayloadService.constructSimulationPayload(
      this.leagueId,
      this.league.teams,
      this.leagueSchedule
    );
    this.leagueStore.dispatch(new LeagueActions.SimulateLeague(simulationPayload));
  }
}
