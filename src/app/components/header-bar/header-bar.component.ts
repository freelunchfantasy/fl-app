import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent {
  sessionCookie$(): Observable<string> {
    return this.appStore.select(fromApplicationRoot.selectSessionCookie);
  }

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  handleLogout() {
    this.appStore.dispatch(new ApplicationActions.ClearUser());
    this.appStore.dispatch(new ApplicationActions.LogOut());
  }
}
