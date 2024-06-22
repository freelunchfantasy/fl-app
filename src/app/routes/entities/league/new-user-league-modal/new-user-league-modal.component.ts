import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { StandingsService } from '@app/services/standings-service';
import { League, LeagueSource, Team } from '@app/lib/models/league';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';
import { LEAGUE_SOURCE } from '@app/lib/constants/league-sources.constants';

@Component({
  selector: 'new-user-league-modal',
  templateUrl: './new-user-league-modal.component.html',
  styleUrls: ['./new-user-league-modal.component.scss'],
})
export class NewUserLeagueModal implements OnInit, OnDestroy {
  @Input()
  modalTitle: string = '';

  @Input()
  modalSubtitle: string = '';

  @Input()
  showCloseIcon?: boolean = true;

  @Input()
  leagueSources: LeagueSource[] = [];

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  leagueId: string = '';

  leagueSourceDropdownItems: IDropdownItem[] = [];
  selectedLeagueSourceId: number;

  newUserLeagueData: League;
  foundLeague: boolean = false;
  couldNotFindLeagueMessage: string = 'Unable to find find league';
  foundLeagueMessage: string;
  userLeagueAlreadyExistsMessage: string = `You've already synced this league`;
  checkUserLeagueMessage: string = '';
  leagueName: string = '';
  teamDropdownItems: IDropdownItem[] = [];
  userTeamId: number;

  leagueSources$(): Observable<LeagueSource[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSources);
  }

  newUserLeagueData$(): Observable<League> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueData);
  }

  newUserLeagueDataIsLoading$(): Observable<boolean> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueDataIsLoading);
  }

  checkUserLeague$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectCheckUserLeagueResult);
  }

  checkUserLeagueIsLoading$(): Observable<boolean> {
    return this.leagueStore.select(fromLeagueRoot.selectCheckUserLeagueIsLoading);
  }

  constructor(private leagueStore: Store<fromLeagueRoot.State>, private standingsService: StandingsService) {}

  ngOnInit(): void {
    // League data sub
    const newUserLeagueDataSubscription = combineLatest([
      this.newUserLeagueData$(),
      this.newUserLeagueDataIsLoading$(),
    ]).subscribe(([leagueData, isLoading]) => {
      if (leagueData && !isLoading) {
        if (leagueData.foundLeague) {
          this.newUserLeagueData = leagueData;
          this.foundLeagueMessage = '';
          this.foundLeague = true;
          this.leagueName = leagueData.settings.name;
          this.teamDropdownItems = leagueData.teams.map(t => ({
            id: t.id.toString(),
            value: t.id,
            htmlMarkup: [t.teamName],
            selected: false,
          }));
        } else {
          this.foundLeagueMessage = this.couldNotFindLeagueMessage;
        }
      }
    });
    this.subscriptions.push(newUserLeagueDataSubscription);

    // League sources sub
    const leagueSourcesSubscription = this.leagueSources$().subscribe(leagueSources => {
      this.leagueSources = leagueSources;
      this.leagueSourceDropdownItems = this.processLeagueSources(leagueSources);
    });
    this.subscriptions.push(leagueSourcesSubscription);

    // Check user league sub
    const checkUserLeagueSubscription = combineLatest([
      this.checkUserLeague$(),
      this.checkUserLeagueIsLoading$(),
    ]).subscribe(([result, isLoading]) => {
      if (result && !isLoading) {
        if (result.foundExistingUserLeague) {
          this.checkUserLeagueMessage = this.userLeagueAlreadyExistsMessage;
        } else {
          this.checkUserLeagueMessage = '';
          this.leagueStore.dispatch(
            new LeagueActions.SaveNewUserLeague({
              externalLeagueId: parseInt(this.leagueId),
              leagueName: this.leagueName,
              userTeamId: this.userTeamId,
              userTeamName: this.newUserLeagueData.teams.find((t: Team) => t.id == this.userTeamId).teamName,
              userTeamRank: this.standingsService.determineTeamRank(this.newUserLeagueData.teams, this.userTeamId),
              totalTeams: this.newUserLeagueData.teams.length,
              leagueSourceId: this.selectedLeagueSourceId,
            })
          );
          this.handleModalClose();
        }
      }
    });
    this.subscriptions.push(checkUserLeagueSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processLeagueSources(leagueSources: LeagueSource[]): IDropdownItem[] {
    if (!(leagueSources || []).length) return [];
    this.selectedLeagueSourceId = leagueSources.find(source => source.name == LEAGUE_SOURCE.ESPN).id;
    return leagueSources.map(source => ({
      id: source.id.toString(),
      value: source.id,
      htmlMarkup: [source.name],
      selected: source.id == this.selectedLeagueSourceId,
    }));
  }

  getSaveUserLeagueButtonClasses() {
    return !this.selectedLeagueSourceId || !this.leagueName || !this.userTeamId
      ? 'btn save-user-league-btn invalid'
      : 'btn save-user-league-btn';
  }

  getUserLeagueData() {
    if (isNaN(parseInt(this.leagueId))) return;
    this.leagueStore.dispatch(new LeagueActions.GetNewUserLeagueData(parseInt(this.leagueId)));
  }

  onSelectLeagueSource(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.selectedLeagueSourceId = event.payload.dropdownItemValue;
    }
  }

  onLeagueIdChange() {
    this.foundLeague = false;
    this.leagueName = '';
    this.userTeamId = null;
    this.checkUserLeagueMessage = '';
    this.foundLeagueMessage = '';
  }

  onSelectTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.userTeamId = event.payload.dropdownItemValue;
    }
  }

  handleSaveNewUserLeague() {
    if (!this.selectedLeagueSourceId || !this.leagueName || !this.userTeamId) return;

    this.leagueStore.dispatch(
      new LeagueActions.CheckUserLeague({
        externalLeagueId: parseInt(this.leagueId),
        leagueSourceId: this.selectedLeagueSourceId,
      })
    );
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}
