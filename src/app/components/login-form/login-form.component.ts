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

  passwordInputType: string = 'password';

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

  onInputFocus(event: any) {
    const focusEmailLabel = () => {
      var element = document.getElementById('label__email');
      element.classList.add('focus');
    };

    const focusPasswordLabel = () => {
      var element = document.getElementById('label__password');
      element.classList.add('focus');
    };

    const name = event.target.name;
    if (name == 'email') focusEmailLabel();
    if (name == 'password') focusPasswordLabel();
  }

  onInputFocusOut(event: any) {
    const unfocusEmailLabel = () => {
      var element = document.getElementById('label__email');
      element.classList.remove('focus');
    };

    const unfocusPasswordLabel = () => {
      var element = document.getElementById('label__password');
      element.classList.remove('focus');
    };

    const name = event.target.name;
    if (name == 'email') unfocusEmailLabel();
    if (name == 'password') unfocusPasswordLabel();
  }

  getTogglePasswordIcon() {
    return this.passwordInputType == 'password'
      ? 'fa fa-eye-slash toggle-password-visibility'
      : 'fa fa-eye toggle-password-visibility';
  }

  togglePasswordInputType() {
    this.passwordInputType = this.passwordInputType == 'password' ? 'text' : 'password';
  }

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
