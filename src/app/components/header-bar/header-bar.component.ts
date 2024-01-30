import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppNavOptions } from '@app/lib/constants/nav-bar-options.constants';
import { AppNavOption } from '@app/lib/models/navigation';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { User } from '@app/lib/models/user';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  sessionToken: string;
  navOptions: AppNavOption[] = [];
  subscriptions: Subscription[] = [];

  selectUser$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  redirectToHome() {
    if (this.sessionToken) this.appStore.dispatch(new ApplicationActions.NavigateToHome());
  }

  handleLogout() {
    this.appStore.dispatch(new ApplicationActions.ClearUser());
    this.appStore.dispatch(new ApplicationActions.LogOut());
  }
}
