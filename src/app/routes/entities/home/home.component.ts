import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  goToLogin() {
    this.appStore.dispatch(new ApplicationActions.NavigateToLogin());
  }
}
