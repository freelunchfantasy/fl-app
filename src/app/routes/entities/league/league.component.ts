import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League, Player, Team } from '@app/lib/models/league';
import { Position } from '@app/lib/constants/position.constants';
import { RosterService } from '@app/services/roster-service';
import { StandingsService } from '@app/services/standings-service';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  league: League;
  standings: Team[] = [];
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

  swappingStarter: boolean = false;
  swappingBench: boolean = false;
  currSwappingStarter: Player;
  currSwappingStarterIndex: number;
  currSwappingBenchPlayer: Player;
  simulating: boolean = false;

  @HostListener('document:click', ['$event.target'])
  onClick(element: HTMLElement) {
    this.clickHandler(element);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private cookieService: CookieService,
    private leagueStore: Store<fromLeagueRoot.State>,
    private standingsService: StandingsService,
    private rosterService: RosterService
  ) {}

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  ngOnInit() {
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId));

    const leagueDataSubscriptions = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          this.processLeagueData(leagueData);
        }
      }
    );
    this.subscriptions.push(leagueDataSubscriptions);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processLeagueData(leagueData: League) {
    console.log(leagueData);
    this.league = leagueData;
    this.userTeam = leagueData.teams.find(team => team.id == this.userTeamId);
    this.starters = this.rosterService.constructStarters(this.userTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
    this.bench = this.userTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
    this.startingPositions = this.rosterService.constructStartingPositions(this.DEFAULT_ACTIVE_ROSTER);
    this.standings = this.standingsService.constructStandings(this.league.teams);
    this.eligibleSlotsForSelectedBenchPlayer = this.startingPositions.map(p => false);
  }

  getPlayerCssClasses(player: Player, i: number, isStarter: boolean) {
    let classes = 'player';
    switch (player.position) {
      case Position.Quarterback:
        classes = `${classes} quarterback`;
        break;
      case Position.RunningBack:
        classes = `${classes} runningback`;
        break;
      case Position.WideReceiver:
        classes = `${classes} widereceiver`;
        break;
      case Position.TightEnd:
        classes = `${classes} tightend`;
        break;
      case Position.Defense:
        classes = `${classes} defense`;
        break;
      case Position.Kicker:
        classes = `${classes} kicker`;
        break;
      default:
        break;
    }
    const addInvalidToStarter = (i: number) =>
      (this.swappingBench && !this.eligibleSlotsForSelectedBenchPlayer[i]) ||
      (this.swappingStarter && this.currSwappingStarterIndex != i);
    const addInvalidToBenchPlayer = (player: Player) =>
      (this.swappingStarter && !this.eligibleBenchReplacementsForSelectedStarter.find(p => p.id == player.id)) ||
      (this.swappingBench && player.id != this.currSwappingBenchPlayer.id);

    classes = `${classes} ${isStarter && addInvalidToStarter(i) ? 'invalid' : ''}`;
    classes = `${classes} ${!isStarter && addInvalidToBenchPlayer(player) ? 'invalid' : ''}`;
    return classes;
  }

  simulateSeason() {
    this.simulating = true;
    setTimeout(() => {
      this.simulating = false;
    }, 2000);
  }

  handlePlayerClick(player: Player, i: number) {
    const shouldExecuteSwapToBench = (player: Player) =>
      this.swappingStarter && this.eligibleBenchReplacementsForSelectedStarter.find(p => p.id == player.id);
    const shouldExecuteSwapToStarter = (i: number) => this.swappingBench && this.eligibleSlotsForSelectedBenchPlayer[i];

    if (shouldExecuteSwapToBench(player)) {
      return this.executeSwapToBench(player);
    }
    if (shouldExecuteSwapToStarter(i)) {
      return this.executeSwapToStarter(player, i);
    }
    const isStarter = this.starters.find(p => p.id == player.id);
    isStarter ? this.showBenchReplacements(i) : this.getEligibleSlots(player);
    if (isStarter) {
      this.currSwappingStarter = player;
      this.currSwappingStarterIndex = i;
    } else {
      this.currSwappingBenchPlayer = player;
    }
  }

  showBenchReplacements(i: number) {
    this.eligibleBenchReplacementsForSelectedStarter = this.rosterService.findEligibleBenchPlayers(
      this.bench,
      this.startingPositions[i]
    );
    this.swappingStarter = true;
    this.swappingBench = false;
  }

  getEligibleSlots(player: Player) {
    this.eligibleSlotsForSelectedBenchPlayer = this.rosterService.findEligibleSlots(player, this.startingPositions);
    this.swappingBench = true;
    this.swappingStarter = false;
  }

  clickHandler(target: HTMLElement) {
    if (!target.classList.value.includes('player')) {
      this.swappingBench = false;
      this.swappingStarter = false;
    }
  }

  executeSwapToBench(benchPlayer: Player) {
    const starterId = this.starters.findIndex(p => p.id == this.currSwappingStarter.id);
    const benchId = this.bench.findIndex(p => p.id == benchPlayer.id);
    this.starters[starterId] = benchPlayer;
    this.bench[benchId] = this.currSwappingStarter;
    this.swappingStarter = false;
  }

  executeSwapToStarter(starter: Player, i: number) {
    const benchId = this.bench.findIndex(p => p.id == this.currSwappingBenchPlayer.id);
    this.starters[i] = this.currSwappingBenchPlayer;
    this.bench[benchId] = starter;
    this.swappingBench = false;
  }
}
