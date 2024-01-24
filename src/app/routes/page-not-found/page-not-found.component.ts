import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  readonly supportEmailLink: string = 'jredwine1@gmail.com';

  constructor(public store: Store<fromRoot.State>) {}

  ngOnInit() {
    console.log('page not found mate');
  }

  navigateToHome() {
    this.store.dispatch(new ApplicationActions.NavigateToHome());
  }
}
