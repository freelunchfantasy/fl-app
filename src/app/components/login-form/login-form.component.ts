import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Output()
  toggleLoginMode: EventEmitter<any> = new EventEmitter<any>();

  email: string = '';
  password: string = '';

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  handleLoginSubmit() {
    this.appStore.dispatch(new ApplicationActions.Login({ e: this.email, p: this.password }));
  }

  switchToRegister() {
    this.toggleLoginMode.emit();
  }
}
