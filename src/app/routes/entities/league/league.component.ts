import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League, LeagueSource, NflTeam, Player, Team, TeamSimulationResult, UserLeague } from '@app/lib/models/league';
import { RosterService } from '@app/services/roster-service';
import { RouterService } from '@app/services/router-service';
import { StandingsService } from '@app/services/standings-service';
import { SimulationPayloadService } from '@app/services/simulation-payload-service';
import { LeagueDataProcessingService } from '@app/services/league-data-processing-service';
import { User } from '@app/lib/models/user';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { DEFAULT_STARTING_POSITIONS } from '@app/lib/constants/position.constants';
import { DEMO_LEAGUE, LEAGUE_SOURCE } from '@app/lib/constants/league-sources.constants';
import { MAX_IMPORTED_USER_LEAGUES } from '@app/lib/constants/max-values.constants';
import { AsyncStatus } from '@app/lib/enums/async-status';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  nflTeams: NflTeam[] = [];
  leagueSources: LeagueSource[] = [];

  // User leagues
  user: User;
  userLeagues: UserLeague[];
  userLeaguesAreLoading: boolean = false;
  maxUserLeagues: number = MAX_IMPORTED_USER_LEAGUES;
  saveNewUserLeagueStatus: AsyncStatus = AsyncStatus.Idle;

  userLeagueDropdownOptions: any = {
    DELETE: 'Delete',
    EDIT: 'Edit',
  };
  userLeagueDropdownItems: IDropdownItem[] = [
    {
      id: this.userLeagueDropdownOptions.EDIT,
      value: this.userLeagueDropdownOptions.EDIT,
      htmlMarkup: [this.userLeagueDropdownOptions.EDIT],
    },
    {
      id: this.userLeagueDropdownOptions.DELETE,
      value: this.userLeagueDropdownOptions.DELETE,
      htmlMarkup: [this.userLeagueDropdownOptions.DELETE],
    },
  ];

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
  showEditUserLeagueModal: boolean = false;
  editingUserLeague: UserLeague;

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
    private simulationPayloadService: SimulationPayloadService,
    private standingsService: StandingsService,
    private routerService: RouterService
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

  saveNewUserLeagueStatus$(): Observable<AsyncStatus> {
    return this.leagueStore.select(fromLeagueRoot.selectSaveNewUserLeagueStatus);
  }

  nflTeams$(): Observable<NflTeam[]> {
    return this.leagueStore.select(fromLeagueRoot.selectNflTeams);
  }

  leagueSources$(): Observable<LeagueSource[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSources);
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

  leagueStartingPositions$(): Observable<string[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueStartingPositions);
  }

  ngOnInit() {
    // User and user leagues sub
    const userAndUserLeaguesSubscription = combineLatest([
      this.user$(),
      this.userLeagues$(),
      this.userLeaguesAreLoading$(),
    ]).subscribe(([user, userLeagues, userLeaguesAreLoading]) => {
      this.userLeaguesAreLoading = userLeaguesAreLoading;
      if (user) {
        this.user = user;
      }
      if (userLeagues && !userLeaguesAreLoading) {
        this.userLeagues = userLeagues;
      }
      if (user && !userLeagues && !userLeaguesAreLoading) this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
    });
    this.subscriptions.push(userAndUserLeaguesSubscription);

    // NFL teams sub
    const nflTeamsSubscription = this.nflTeams$().subscribe(nflTeams => {
      this.nflTeams = nflTeams;
    });
    this.subscriptions.push(nflTeamsSubscription);

    // leagues ources sub
    const leagueSourcesSubscription = this.leagueSources$().subscribe(leagueSources => {
      this.leagueSources = leagueSources;
    });
    this.subscriptions.push(leagueSourcesSubscription);

    // save new user league sub
    const saveNewUserLeagueStatusSubscription = this.saveNewUserLeagueStatus$().subscribe(status => {
      if (status == AsyncStatus.Success) {
        this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
      }
      this.saveNewUserLeagueStatus = status;
    });
    this.subscriptions.push(saveNewUserLeagueStatusSubscription);

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
          this.syncUserLeague(this.league, this.userTeam);
          this.constructStartersAndBench();
          let sortedTeams = [...this.league.teams].sort(this.compareTwoTeams);
          this.teamDropdownItems = sortedTeams.map(t => ({
            id: t.id.toString(),
            value: t.id,
            htmlMarkup: [t.teamName],
            selected: t.id == this.userTeamId,
          }));
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);

    // league standings sub
    const leagueStandingsSubscription = this.leagueStandings$().subscribe(standings => {
      if ((standings || []).length) {
        this.leagueStandings = standings;
      }
    });
    this.subscriptions.push(leagueStandingsSubscription);

    // league schedule sub
    const leagueScheduleSubscription = this.leagueSchedule$().subscribe(schedule => {
      if ((schedule || []).length) {
        this.leagueSchedule = schedule;
      }
    });
    this.subscriptions.push(leagueScheduleSubscription);

    // league starting positions sub
    const leagueStartingPositionsSubscription = this.leagueStartingPositions$().subscribe(startingPositions => {
      if ((startingPositions || []).length) {
        this.startingPositions = startingPositions;
        this.constructStartersAndBench();
      }
    });
    this.subscriptions.push(leagueStartingPositionsSubscription);

    // league simulation sub
    const leagueSimulationSubscription = combineLatest([
      this.leagueSimulationResult$(),
      this.leagueSimulationIsLoading$(),
    ]).subscribe(([result, isLoading]) => {
      if (!isLoading) {
        this.simulationResult = result?.teamResults;
      }
    });
    this.subscriptions.push(leagueSimulationSubscription);

    this.getInitData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getInitData(): void {
    if (!(this.nflTeams || []).length) {
      this.leagueStore.dispatch(new LeagueActions.GetNflTeams());
    }
    if (!(this.leagueSources || []).length) {
      this.leagueStore.dispatch(new LeagueActions.GetLeagueSources());
    }
  }

  getUserLeagueDropdownItems(userLeague: UserLeague) {
    return userLeague.leagueSource == LEAGUE_SOURCE.DEMO
      ? this.userLeagueDropdownItems.filter(i => i.value != this.userLeagueDropdownOptions.EDIT)
      : this.userLeagueDropdownItems;
  }

  getUserLeagueSourceClasses(leagueSource: string) {
    return `user-league__body__league-source ${leagueSource}`;
  }

  constructStartersAndBench() {
    if ((this.startingPositions || []).length && this.league) {
      this.starters = this.rosterService.constructStarters(
        this.userTeam.roster,
        (this.rosterService.constructStartingPositions(this.league.settings.lineup) || []).length
          ? this.startingPositions
          : DEFAULT_STARTING_POSITIONS
      );
      this.bench = this.userTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
      this.eligibleSlotsForSelectedBenchPlayer = this.startingPositions.map(p => false);
    }
  }

  onSelectUserLeagueDropdownItem(userLeague: UserLeague, event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      const selectedItem = this.userLeagueDropdownItems.find(item => item.id == event.payload.dropdownItemValue);

      // Edit user league
      if (selectedItem.value == this.userLeagueDropdownOptions.EDIT) {
        this.editingUserLeague = userLeague;
        this.openEditUserLeagueModal();
      }

      // Delete user league
      if (selectedItem.value == this.userLeagueDropdownOptions.DELETE) {
        this.userLeagues = this.userLeagues.filter((ul: UserLeague) => ul.id != userLeague.id);
        this.leagueStore.dispatch(new LeagueActions.DeleteUserLeague(userLeague));
        this.leagueStore.dispatch(
          new LeagueActions.SetUserLeagues(this.userLeagues.filter((ul: UserLeague) => ul.id != userLeague.id))
        );
      }
    }
  }

  selectViewUserLeague(userLeague: UserLeague) {
    this.leagueId = userLeague.leagueId;
    this.userTeamId = userLeague.userTeamId;
    this.leagueStore.dispatch(new LeagueActions.SetSelectedUserLeague(userLeague));
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId, this.userTeamId));
  }

  selectTradeSimulatorButton(userLeague: UserLeague) {
    this.leagueId = userLeague.leagueId;
    this.userTeamId = userLeague.userTeamId;
    this.leagueStore.dispatch(new LeagueActions.SetSelectedUserLeague(userLeague));
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId, this.userTeamId));
    this.routerService.redirectTo('/trade');
  }

  simulateSeason() {
    const simulationPayload: SimulateLeaguePayload = {
      ...this.simulationPayloadService.constructSimulationPayload(
        this.leagueId,
        this.league.teams,
        this.leagueSchedule,
        this.nflTeams,
        (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS
      ),
      userId: this.user.id,
      userLeagueId: this.userLeague.id,
    };
    this.leagueStore.dispatch(new LeagueActions.SimulateLeague(simulationPayload));
  }

  onSelectTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      const selectedTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.starters = this.rosterService.constructStarters(
        selectedTeam.roster,
        (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS
      );
      this.bench = selectedTeam.roster.filter(player => !this.starters.map(p => p.id).includes(player.id));
    }
  }

  showRank(userLeague: UserLeague) {
    return userLeague.userTeamId && userLeague.userTeamId;
  }

  getUserTeamRankSuffix(userLeague: UserLeague) {
    return this.standingsService.getRankSuffix(userLeague.userTeamRank);
  }

  compareTwoTeams(a: Team, b: Team): number {
    if (a.wins > b.wins) return -1;
    else if (a.wins < b.wins) return 1;
    else {
      return a.pointsFor > b.pointsFor ? -1 : 1;
    }
  }

  syncUserLeague(league: League, userTeam: Team) {
    let thisUserLeague = { ...this.userLeagues.find(ul => ul.leagueId == league.leagueId) };
    const rankedTeams = this.standingsService.constructStandings(league.teams);
    thisUserLeague.userTeamName = userTeam.teamName;
    thisUserLeague.userTeamRank = rankedTeams.findIndex((t: Team) => t.id == userTeam.id) + 1;
    const thisUserLeagueIndex = this.userLeagues.findIndex(ul => ul.id == thisUserLeague.id);
    const syncedUserLeagues = [
      ...this.userLeagues.slice(0, thisUserLeagueIndex),
      thisUserLeague,
      ...this.userLeagues.slice(thisUserLeagueIndex + 1),
    ];
    this.leagueStore.dispatch(new LeagueActions.SetUserLeagues(syncedUserLeagues));
  }

  addDemoUserLeague() {
    this.leagueStore.dispatch(
      new LeagueActions.SaveNewUserLeague({
        externalLeagueId: DEMO_LEAGUE.id,
        leagueName: DEMO_LEAGUE.name,
        userTeamId: Math.floor(Math.random() * DEMO_LEAGUE.totalTeams + 1),
        totalTeams: DEMO_LEAGUE.totalTeams,
        leagueSourceId: DEMO_LEAGUE.leagueSourceId,
      })
    );
  }

  openNewUserLeagueModal() {
    this.showNewUserLeagueModal = true;
  }

  closeNewUserLeagueModal() {
    this.showNewUserLeagueModal = false;
    this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
  }

  openEditUserLeagueModal() {
    this.showEditUserLeagueModal = true;
  }

  closeEditUserLeagueModal() {
    this.showEditUserLeagueModal = false;
    this.leagueStore.dispatch(new LeagueActions.GetUserLeagues());
  }

  get userLeaguesLoading() {
    return this.userLeaguesAreLoading || this.saveNewUserLeagueStatus == AsyncStatus.Processing;
  }

  get shouldShowLeague() {
    return this.league && this.leagueId && !this.leagueIsLoading;
  }
}
