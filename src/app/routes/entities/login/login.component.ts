import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { User } from '@app/lib/models/user';
import { LOGIN_MODE } from './login.constants';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  userDataLoading: boolean = true;

  loginMode: LOGIN_MODE = LOGIN_MODE.LOGIN;

  constructor(public appStore: Store<fromApplicationRoot.State>, private cookieService: CookieService) {}

  sessionToken(): string {
    return this.cookieService.get('session');
  }

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  userIsLoading$(): Observable<boolean> {
    return this.appStore.select(fromApplicationRoot.selectUserIsLoading);
  }

  ngOnInit() {
    // User subscription
    const userSubscription = combineLatest([this.user$(), this.userIsLoading$()]).subscribe(([user, isLoading]) => {
      if (!isLoading && user) {
        this.appStore.dispatch(new ApplicationActions.SetSessionToken(user.sessionToken));
        this.appStore.dispatch(new ApplicationActions.NavigateToLeague());
      }
    });
    this.subscriptions.push(userSubscription);

    if ((this.sessionToken() || '').length > 0) {
      this.appStore.dispatch(new ApplicationActions.Login({ sessionToken: this.sessionToken() }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleLoginMode() {
    this.loginMode = this.loginMode == LOGIN_MODE.LOGIN ? LOGIN_MODE.REGISTER : LOGIN_MODE.LOGIN;
  }

  get loggingIn() {
    return this.loginMode == LOGIN_MODE.LOGIN;
  }

  get registering() {
    return this.loginMode == LOGIN_MODE.REGISTER;
  }
}
