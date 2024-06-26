import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Store } from '@ngrx/store';
import { User } from './lib/models/user';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserLeague } from './lib/models/league';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'freelunch-app';
  subscriptions: Subscription[] = [];
  user: User;
  selectedUserLeague: UserLeague;

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  selectedUserLeague$(): Observable<UserLeague> {
    return this.leagueStore.select(fromLeagueRoot.selectSelectedUserLeague);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private leagueStore: Store<fromLeagueRoot.State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userSubscription = this.user$().subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(userSubscription);

    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.selectedUserLeague = userLeague;
    });
    this.subscriptions.push(selectedUserLeagueSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get isLoginPage() {
    return this.router.url.includes('/login');
  }

  getRouterOutletClasses() {
    return this.selectedUserLeague ? 'router-with-side-bar' : '';
  }

  goToHome() {
    this.leagueStore.dispatch(new LeagueActions.ClearLeagueData());
    this.appStore.dispatch(new ApplicationActions.NavigateToHome());
  }

  goToLogin() {
    this.appStore.dispatch(new ApplicationActions.NavigateToLogin());
  }

  goToRegister() {
    this.appStore.dispatch(new ApplicationActions.NavigateToLogin(true));
  }
}
