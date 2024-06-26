import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit, OnDestroy {
  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onClickAbout() {}

  onClickContactUs() {
    this.appStore.dispatch(new ApplicationActions.NavigateToContactUs());
  }
}
