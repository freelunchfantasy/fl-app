import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League, LeagueSimulationResult, Player, Team, TeamSimulationResult, UserLeague } from '@app/lib/models/league';
import { RosterService } from '@app/services/roster-service';
import { SimulationPayloadService } from '@app/services/simulation-payload-service';
import { LeagueDataProcessingService } from '@app/services/league-data-processing-service';
import { User } from '@app/lib/models/user';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // User leagues
  user: User;
  userLeagues: UserLeague[];

  // Selected league
  userLeague: UserLeague;
  leagueId: number;
  userTeamId: number;
  league: League;
  leagueStandings: Team[] = [];
  userTeam: Team;
  didInitialLoad: boolean = false;
  leagueIsLoading: boolean = false;
  teamDropdownItems: IDropdownItem[] = [];

  showNewUserLeagueModal: boolean = false;

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

  simulationResult: TeamSimulationResult[];

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private leagueStore: Store<fromLeagueRoot.State>,
    private leagueDataProcessingService: LeagueDataProcessingService,
    private rosterService: RosterService,
    private simulationPayloadService: SimulationPayloadService
  ) {}

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  userLeagues$(): Observable<UserLeague[]> {
    return this.leagueStore.select(fromLeagueRoot.selectUserLeagues);
  }

  userLeaguesAreLoading$(): Observable<boolean> {
    return this.leagueStore.select(fromLeagueRoot.selectUserLeaguesAreLoading);
  }

  selectedUserLeague$(): Observable<UserLeague> {
    return this.leagueStore.select(fromLeagueRoot.selectSelectedUserLeague);
  }

  leagueData$(): Observable<League> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<boolean> {
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
    // User sub
    const userSubscription = this.user$().subscribe(user => {
      if (user) {
        this.user = user;
        this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
      }
    });
    this.subscriptions.push(userSubscription);

    // User leagues sub
    const userLeaguesSubscription = combineLatest([this.userLeagues$(), this.userLeaguesAreLoading$()]).subscribe(
      ([userLeagues, areLoading]) => {
        if (userLeagues && !areLoading) {
          this.userLeagues = userLeagues;
        }
      }
    );
    this.subscriptions.push(userLeaguesSubscription);

    // Selected user league sub
    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.userLeague = userLeague;
      this.leagueId = userLeague?.leagueId;
      this.userTeamId = userLeague?.userTeamId;
    });
    this.subscriptions.push(selectedUserLeagueSubscription);

    // Selected league data sub
    const leagueDataSubscription = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        this.leagueIsLoading = isLoading;
        if (leagueData && !isLoading && this.leagueId) {
          this.leagueDataProcessingService.processLeagueData(leagueData);

          // League data processing specific for this component
          this.league = leagueData;
          this.userTeam = leagueData.teams.find((team: Team) => team.id == this.userTeamId);
          this.starters = this.rosterService.constructStarters(this.userTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
          this.bench = this.userTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
          this.startingPositions = this.rosterService.constructStartingPositions(this.DEFAULT_ACTIVE_ROSTER);
          this.eligibleSlotsForSelectedBenchPlayer = this.startingPositions.map(p => false);
          this.teamDropdownItems = this.league.teams.map(t => ({
            id: t.id.toString(),
            value: t.id,
            htmlMarkup: [t.teamName],
            selected: t.id == this.userTeamId,
          }));
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
        this.simulationResult = result.teamResults;
      }
    });
    this.subscriptions.push(leagueSimulationSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectUserLeague(userLeague: UserLeague) {
    this.leagueId = userLeague.leagueId;
    this.userTeamId = userLeague.userTeamId;
    this.leagueStore.dispatch(new LeagueActions.SetSelectedUserLeague(userLeague));
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId));
  }

  simulateSeason() {
    const simulationPayload = this.simulationPayloadService.constructSimulationPayload(
      this.leagueId,
      this.league.teams,
      this.leagueSchedule
    );
    this.leagueStore.dispatch(new LeagueActions.SimulateLeague(simulationPayload));
  }

  onSelectTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      const selectedTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.starters = this.rosterService.constructStarters(selectedTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
      this.bench = selectedTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
      this.teamDropdownItems = this.league.teams.map(t => ({
        id: t.id.toString(),
        value: t.id,
        htmlMarkup: [t.teamName],
        selected: t.id == this.userTeamId,
      }));
    }
  }

  backToSelectLeague() {
    this.leagueStore.dispatch(new LeagueActions.ClearSelectedUserLeague());
  }

  openNewUserLeagueModal() {
    this.showNewUserLeagueModal = true;
  }

  closeNewUserLeagueModal() {
    this.showNewUserLeagueModal = false;
    this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
  }

  get shouldShowLeague() {
    return this.league && !this.leagueIsLoading;
  }
}
