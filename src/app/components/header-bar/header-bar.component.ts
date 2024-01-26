import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppNavOptions } from '@app/lib/constants/nav-bar-options.constants';
import { AppNavOption } from '@app/lib/models/navigation';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
  navOptions: AppNavOption[] = [];

  sessionCookie$(): Observable<string> {
    return this.appStore.select(fromApplicationRoot.selectSessionCookie);
  }

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit(): void {
    this.navOptions = AppNavOptions.navBarOptions;
  }

  redirectToHome() {
    this.appStore.dispatch(new ApplicationActions.NavigateToHome());
  }

  handleLogout() {
    this.appStore.dispatch(new ApplicationActions.ClearUser());
    this.appStore.dispatch(new ApplicationActions.LogOut());
  }
}
