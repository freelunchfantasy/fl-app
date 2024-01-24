import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { RouterService } from './router-service';
import * as fromRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { AuthUser, GameUser } from '@app/lib/models/user';

@Injectable()
export class AuthGuardService implements CanActivate {
  backendUrl$: Observable<string>;
  authUser$: Observable<AuthUser>;
  gameUser$: Observable<GameUser>;

  constructor(
    public cookieService: CookieService,
    public routerService: RouterService,
    public store: Store<fromRoot.State>,
    public router: Router
  ) {
    this.backendUrl$ = this.store.select(fromRoot.selectBackendUrl);
    this.authUser$ = this.store.select(fromRoot.selectAuthUser);
    this.gameUser$ = this.store.select(fromRoot.selectGameUser);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Get url route information
    const baseRoute = '/';
    const navUrl = (state.url || '').trim();

    const sessionCookie = this.getSessionCookie();
    sessionCookie &&
      this.store.dispatch(
        new ApplicationActions.SetSessionCookie(sessionCookie)
      );

    if (navUrl == '/login') {
      return true;
    }
    return this.forceNavigateToLogin();
  }

  getSessionCookie() {
    return this.cookieService.get('session');
  }

  forceNavigateToLogin() {
    this.router.navigate(['/login']);
    return false;
  }
}
