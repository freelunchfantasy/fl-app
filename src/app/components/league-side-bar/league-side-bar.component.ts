import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';

import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { RouterService } from '@app/services/router-service';
import { UserLeague } from '@app/lib/models/league';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'league-side-bar',
  templateUrl: './league-side-bar.component.html',
  styleUrls: ['./league-side-bar.component.scss'],
})
export class LeagueSideBarComponent implements OnInit, OnDestroy {
  leagueData: any;
  selectedUserLeague: UserLeague;
  subscriptions: Subscription[] = [];

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  selectedUserLeague$(): Observable<UserLeague> {
    return this.leagueStore.select(fromLeagueRoot.selectSelectedUserLeague);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    public leagueStore: Store<fromLeagueRoot.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    const leagueDataSubscription = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          this.leagueData = leagueData;
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);

    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.selectedUserLeague = userLeague;
    });
    this.subscriptions.push(selectedUserLeagueSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  redirectToHome() {
    this.appStore.dispatch(new ApplicationActions.NavigateToHome());
  }

  handleLogout() {
    this.appStore.dispatch(new ApplicationActions.ClearUser());
    this.appStore.dispatch(new ApplicationActions.LogOut());
    this.leagueStore.dispatch(new LeagueActions.ResetLeagueState());
  }

  handleLogin() {
    this.appStore.dispatch(new ApplicationActions.NavigateToLogin());
  }

  backToSelectLeague() {
    this.leagueStore.dispatch(new LeagueActions.ClearSelectedUserLeague());
    this.leagueStore.dispatch(new LeagueActions.ClearLeagueData());
    this.routerService.redirectTo('/league');
  }

  handleClickContactUs() {
    this.appStore.dispatch(new ApplicationActions.NavigateToContactUs());
  }

  handleLeagueNavigationClicked(path: string) {
    this.router.navigate([path], { relativeTo: this.activatedRoute });
  }
}
