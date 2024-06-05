import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { User, UserResult } from '@app/lib/models/user';
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
  loginError: string = '';

  constructor(public appStore: Store<fromApplicationRoot.State>, private cookieService: CookieService) {}

  sessionToken(): string {
    return this.cookieService.get('session');
  }

  userResult$(): Observable<UserResult> {
    return this.appStore.select(fromApplicationRoot.selectUserResult);
  }

  userIsLoading$(): Observable<boolean> {
    return this.appStore.select(fromApplicationRoot.selectUserIsLoading);
  }

  ngOnInit() {
    // User subscription
    const userSubscription = combineLatest([this.userResult$(), this.userIsLoading$()]).subscribe(
      ([result, isLoading]) => {
        if (!isLoading && result) {
          if (result.success) {
            const user = result.user;
            this.appStore.dispatch(new ApplicationActions.SetUser(user));
            this.appStore.dispatch(new ApplicationActions.SetSessionToken(user.sessionToken));
            this.appStore.dispatch(new ApplicationActions.NavigateToLeague());
          } else {
            this.loginError = result.error;
          }
        }
      }
    );
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
