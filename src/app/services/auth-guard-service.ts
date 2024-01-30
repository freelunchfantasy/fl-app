import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { RouterService } from './router-service';
import * as fromRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { User } from '@app/lib/models/user';

@Injectable()
export class AuthGuardService implements CanActivate {
  backendUrl$: Observable<string>;
  user$: Observable<User>;

  constructor(
    public cookieService: CookieService,
    public routerService: RouterService,
    public store: Store<fromRoot.State>,
    public router: Router
  ) {
    this.backendUrl$ = this.store.select(fromRoot.selectBackendUrl);
    this.user$ = this.store.select(fromRoot.selectUser);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // Get url route information
    const baseRoute = '/';
    const navUrl = (state.url || '').trim();
    if (baseRoute == navUrl) return true;

    const sessionCookie = this.getSessionTokenCookie();
    if (sessionCookie) {
      this.store.dispatch(new ApplicationActions.SetSessionToken(sessionCookie));
      return navUrl == '/login' ? true : this.forceNavigateToLogin();
    }

    if (navUrl == '/' || navUrl == '/login') {
      return true;
    }
    return this.forceNavigateToHome();
  }

  getSessionTokenCookie() {
    return this.cookieService.get('session');
  }

  forceNavigateToLogin() {
    this.router.navigate(['/login']);
    return false;
  }

  forceNavigateToHome() {
    this.router.navigate(['/']);
    return false;
  }
}
