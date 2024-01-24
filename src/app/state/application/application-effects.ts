import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { State } from '@app/state/reducers';
import { RouterService } from '@app/services/router-service';
import { BackendService } from '@app/services/backend-service';
import * as ApplicationActions from './application-actions';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ApplicationEffects {
  setSessionCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.SET_SESSION_COOKIE),
        map((action: ApplicationActions.SetSessionCookie) => {
          this.cookieService.set('session', action.payload);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.LOG_OUT),
        map((action: ApplicationActions.LogOut) => {
          this.cookieService.delete('session');
          this.routerService.redirectTo('/login');
        })
      ),
    { dispatch: false }
  );

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.NAVIGATE_TO_HOME),
        withLatestFrom(this.store$),
        map(([action, state]) => {
          const homeRoute = '/league';
          this.routerService.redirectTo(homeRoute);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private backendService: BackendService,
    private store$: Store<State>,
    private routerService: RouterService,
    private cookieService: CookieService
  ) {}
}
