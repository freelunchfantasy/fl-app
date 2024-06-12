import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { InputValidationService } from '@app/services/input-validation-service';
import { Observable } from 'rxjs';
import { User } from '@app/lib/models/user';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Input()
  loginError: string = '';

  @Output()
  toggleLoginMode: EventEmitter<any> = new EventEmitter<any>();

  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  userIsLoading$(): Observable<boolean> {
    return this.appStore.select(fromApplicationRoot.selectUserIsLoading);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private inputValidationService: InputValidationService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  handleLoginSubmit() {
    const validationResult = this.inputValidationService.validateLoginInputs({
      e: this.email,
      p: this.password,
    });
    const canSubmit = !Object.values(validationResult).find(message => message.length > 0);
    if (canSubmit) {
      this.appStore.dispatch(new ApplicationActions.Login({ e: this.email, p: this.password }));
      this.clearInputErrors();
    } else {
      this.handleInputErrors(validationResult);
    }
  }

  handleInputErrors(validationResult: any) {
    this.emailError = validationResult.email;
    this.passwordError = validationResult.password;
  }

  clearInputErrors() {
    this.emailError = '';
    this.passwordError = '';
  }

  switchToRegister() {
    this.toggleLoginMode.emit();
  }
}
