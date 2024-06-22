import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { InputValidationService } from '@app/services/input-validation-service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { User, UserResult } from '@app/lib/models/user';
import { AsyncStatus } from '@app/lib/enums/async-status';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @Output()
  toggleLoginMode: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  passwordInputType: string = 'password';
  confirmPasswordInputType: string = 'password';

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';

  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';
  registerErrorMessage: string = '';
  registerStatus: AsyncStatus = AsyncStatus.Idle;

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  userIsLoading$(): Observable<boolean> {
    return this.appStore.select(fromApplicationRoot.selectUserIsLoading);
  }

  userResult$(): Observable<UserResult> {
    return this.appStore.select(fromApplicationRoot.selectUserResult);
  }

  registerStatus$(): Observable<AsyncStatus> {
    return this.appStore.select(fromApplicationRoot.selectRegisterStatus);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private inputValidationService: InputValidationService
  ) {}

  ngOnInit(): void {
    const registerStatusSubscription = combineLatest([this.registerStatus$(), this.userResult$()]).subscribe(
      ([status, userResult]) => {
        this.registerStatus = status;
        if (status == AsyncStatus.Success) {
          if (userResult?.error) this.registerErrorMessage = userResult.error;
        } else if (status == AsyncStatus.Failure) {
          this.registerErrorMessage = 'Unexpected error occurred while registering';
        }
      }
    );
    this.subscriptions.push(registerStatusSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onInputFocus(event: any) {
    const focusEmailLabel = () => {
      var element = document.getElementById('label__email');
      element.classList.add('focus');
    };

    const focusFirstNameLabel = () => {
      var element = document.getElementById('label__first-name');
      element.classList.add('focus');
    };

    const focusLastNameLabel = () => {
      var element = document.getElementById('label__last-name');
      element.classList.add('focus');
    };

    const focusPasswordLabel = () => {
      var element = document.getElementById('label__password');
      element.classList.add('focus');
    };

    const focusConfirmPasswordLabel = () => {
      var element = document.getElementById('label__confirm-password');
      element.classList.add('focus');
    };

    const name = event.target.name;
    if (name == 'email') focusEmailLabel();
    if (name == 'firstName') focusFirstNameLabel();
    if (name == 'lastName') focusLastNameLabel();
    if (name == 'password') focusPasswordLabel();
    if (name == 'confirmPassword') focusConfirmPasswordLabel();
  }

  onInputFocusOut(event: any) {
    const unfocusEmailLabel = () => {
      var element = document.getElementById('label__email');
      element.classList.remove('focus');
    };

    const unfocusFirstNameLabel = () => {
      var element = document.getElementById('label__first-name');
      element.classList.remove('focus');
    };

    const unfocusLastNameLabel = () => {
      var element = document.getElementById('label__last-name');
      element.classList.remove('focus');
    };

    const unfocusPasswordLabel = () => {
      var element = document.getElementById('label__password');
      element.classList.remove('focus');
    };

    const unfocusConfirmPasswordLabel = () => {
      var element = document.getElementById('label__confirm-password');
      element.classList.remove('focus');
    };

    const name = event.target.name;
    if (name == 'email') unfocusEmailLabel();
    if (name == 'firstName') unfocusFirstNameLabel();
    if (name == 'lastName') unfocusLastNameLabel();
    if (name == 'password') unfocusPasswordLabel();
    if (name == 'confirmPassword') unfocusConfirmPasswordLabel();
  }

  getTogglePasswordIcon() {
    return this.passwordInputType == 'password'
      ? 'fa fa-eye-slash toggle-password-visibility'
      : 'fa fa-eye toggle-password-visibility';
  }

  getToggleConfirmPasswordIcon() {
    return this.confirmPasswordInputType == 'password'
      ? 'fa fa-eye-slash toggle-password-visibility'
      : 'fa fa-eye toggle-password-visibility';
  }

  togglePasswordInputType() {
    this.passwordInputType = this.passwordInputType == 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordInputType() {
    this.confirmPasswordInputType = this.confirmPasswordInputType == 'password' ? 'text' : 'password';
  }

  onPasswordsChange() {
    this.confirmPasswordError = this.password == this.confirmPassword ? '' : 'Passwords do not match';
  }

  handleRegisterSubmit() {
    const validationResult = this.inputValidationService.validateRegisterInputs({
      e: this.email,
      p: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
    });
    const canSubmit =
      !Object.values(validationResult).find(message => message.length > 0) &&
      !(this.registerStatus == AsyncStatus.Processing);
    if (canSubmit) {
      this.appStore.dispatch(
        new ApplicationActions.Register({
          e: this.email,
          p: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
        })
      );
    }
    this.handleInputErrors(validationResult);
  }

  handleInputErrors(validationResult: any) {
    this.emailError = validationResult.email;
    this.passwordError = validationResult.password;
    this.confirmPasswordError = validationResult.confirmPassword;
    this.firstNameError = validationResult.firstName;
    this.lastNameError = validationResult.lastName;
  }

  switchToLogin() {
    this.toggleLoginMode.emit();
  }
}
