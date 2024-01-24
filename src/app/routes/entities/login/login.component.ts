import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { AuthUser, GameUser } from '@app/lib/models/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  userDataLoading: boolean = true;

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private cookieService: CookieService
  ) {}

  sessionCookie$(): Observable<string> {
    return this.appStore.select(fromApplicationRoot.selectSessionCookie);
  }

  authUser$(): Observable<AuthUser> {
    return this.appStore.select(fromApplicationRoot.selectAuthUser);
  }

  authUserFinishedLoading$(): Observable<boolean> {
    return this.appStore.select(
      fromApplicationRoot.selectAuthUserFinishedLoading
    );
  }

  gameUser$(): Observable<GameUser> {
    return this.appStore.select(fromApplicationRoot.selectGameUser);
  }

  gameUserFinishedLoading$(): Observable<boolean> {
    return this.appStore.select(
      fromApplicationRoot.selectGameUserDataFinishedLoading
    );
  }

  ngOnInit() {
    this.initGoogleAuth();

    // Session cookie subscription
    const sessionCookieSubscription = this.sessionCookie$().subscribe(
      (cookie) => {
        if (cookie) {
          this.appStore.dispatch(new ApplicationActions.GetAuthUserData());
        } else {
          this.userDataLoading = false;
        }
      }
    );
    this.subscriptions.push(sessionCookieSubscription);

    // Auth user subscription
    const authUserSubscription = combineLatest([
      this.authUser$(),
      this.authUserFinishedLoading$(),
    ]).subscribe(([authUser, finishedLoading]) => {
      if (finishedLoading && authUser) {
        if (authUser.expires_in > 0) {
          this.appStore.dispatch(
            new ApplicationActions.GetGameUserData({
              authUserId: authUser.user_id,
              email: authUser.email,
            })
          );
        } else {
          this.userDataLoading = false;
        }
      }
    });
    this.subscriptions.push(authUserSubscription);

    // Game user subscription
    const gameUserSubscription = combineLatest([
      this.gameUser$(),
      this.gameUserFinishedLoading$(),
    ]).subscribe(([gameUser, finishedLoading]) => {
      if (finishedLoading) {
        gameUser
          ? this.appStore.dispatch(new ApplicationActions.NavigateToHome())
          : this.appStore.dispatch(
              new ApplicationActions.NavigateToUnavailable()
            );
      }
    });
    this.subscriptions.push(gameUserSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initGoogleAuth() {
    // Clear g_state cookie (sometimes prevents login popup)
    this.cookieService.delete('g_state');

    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        '47343889643-eu1s99cf9tlshcjgo8a75mh8m18hmou8.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }

  async handleCredentialResponse(response: any) {
    this.userDataLoading = true;
    this.appStore.dispatch(
      new ApplicationActions.SetSessionCookie(response.credential)
    );
    this.appStore.dispatch(new ApplicationActions.GetAuthUserData());
  }

  handleLogin() {
    // @ts-ignore
    google.accounts.id.prompt(
      // @ts-ignore
      (notification: PromptMomentNotification) => {}
    );
  }
}
