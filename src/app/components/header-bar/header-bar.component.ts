import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { AppNavOptions } from '@app/lib/constants/nav-bar-options.constants';
import { AppNavOption } from '@app/lib/models/navigation';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { User } from '@app/lib/models/user';
import { UserLeague } from '@app/lib/models/league';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  sessionToken: string;
  leagueData: any;
  navOptions: AppNavOption[] = [];
  subscriptions: Subscription[] = [];

  LOGOUT_NAV_OPTION: AppNavOption = {
    title: 'Log Out',
    path: '',
  };
  LOGIN_NAV_OPTION: AppNavOption = {
    title: 'Log In',
    path: '/login',
  };
  CONTACT_US_NAV_OPTION: AppNavOption = {
    title: 'Contact Us',
    path: '',
  };

  selectUser$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  constructor(public appStore: Store<fromApplicationRoot.State>, public leagueStore: Store<fromLeagueRoot.State>) {}

  ngOnInit(): void {
    this.navOptions = AppNavOptions.navBarOptions;

    const userSubscription = this.selectUser$().subscribe(user => {
      if (user) {
        this.sessionToken = user.sessionToken;
      } else {
        this.sessionToken = null;
      }
    });
    this.subscriptions.push(userSubscription);
    const leagueDataSubscription = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          this.leagueData = leagueData;
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);
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

  handleClickContactUs() {
    this.appStore.dispatch(new ApplicationActions.NavigateToContactUs());
  }
}
