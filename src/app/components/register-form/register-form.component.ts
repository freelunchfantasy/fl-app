import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { InputValidationService } from '@app/services/input-validation-service';
import { Observable } from 'rxjs';
import { User } from '@app/lib/models/user';

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

  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';

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

  handleRegisterSubmit() {
    const validationResult = this.inputValidationService.validateRegisterInputs({
      e: this.email,
      p: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
    });
    const canSubmit = !Object.values(validationResult).find(message => message.length > 0);
    if (canSubmit) {
      this.appStore.dispatch(
        new ApplicationActions.Register({
          e: this.email,
          p: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
        })
      );
    } else {
      this.handleInputErrors(validationResult);
    }
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
