import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @Output()
  toggleLoginMode: EventEmitter<any> = new EventEmitter<any>();

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(public appStore: Store<fromApplicationRoot.State>) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  handleRegisterSubmit() {
    this.appStore.dispatch(
      new ApplicationActions.Register({
        e: this.email,
        p: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })
    );
  }

  switchToLogin() {
    this.toggleLoginMode.emit();
  }
}
