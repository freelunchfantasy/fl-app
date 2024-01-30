import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  handleLoginSubmit() {
    this.appStore.dispatch(new ApplicationActions.Login({ u: this.username, p: this.password }));
  }
}
