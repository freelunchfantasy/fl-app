import * as EmailValidator from 'email-validator';
import { LoginPayload, RegisterPayload } from '@app/lib/models/auth-payloads';
import { InputLimits } from '@app/lib/constants/input-limits.constants';

export class InputValidationService {
  validateRegisterInputs(payload: RegisterPayload) {
    return {
      email: this.validateEmailForRegister(payload.e),
      password: this.validatePasswordForRegister(payload.p),
      confirmPassword: this.validateConfirmPasswordForRegister(payload.p, payload.confirmPassword),
      firstName: this.validateFirstNameForRegister(payload.firstName),
      lastName: this.validateLastNameForRegister(payload.lastName),
    };
  }

  validateLoginInputs(payload: LoginPayload) {
    return {
      email: this.validateEmailForLogin(payload.e),
      password: this.validatePasswordForLogin(payload.p),
    };
  }

  validateEmailForRegister(email: string): string {
    if (email.length < InputLimits.email.minLength.value) return InputLimits.email.minLength.message;
    if (email.length > InputLimits.email.maxLength.value) return InputLimits.email.maxLength.message;
    if (!EmailValidator.validate(email)) return InputLimits.email.notValidEmail.message;
    return '';
  }

  validatePasswordForRegister(password: string): string {
    if (password.length < InputLimits.password.minLength.value) return InputLimits.password.minLength.message;
    if (password.length > InputLimits.password.maxLength.value) return InputLimits.password.maxLength.message;
    return '';
  }

  validateConfirmPasswordForRegister(password: string, confirmPassword: string): string {
    if (password != confirmPassword) return 'Passwords do not match';
    return '';
  }

  validateFirstNameForRegister(firstName: string): string {
    if ((firstName || '').length == 0) return '';
    if (firstName.length > InputLimits.firstName.maxLength.value) return InputLimits.firstName.maxLength.message;
    if (!InputLimits.firstName.validChars.value.test(firstName)) return InputLimits.firstName.validChars.message;
    return '';
  }

  validateLastNameForRegister(lastName: string): string {
    if ((lastName || '').length == 0) return '';
    if (lastName.length > InputLimits.lastName.maxLength.value) return InputLimits.lastName.maxLength.message;
    if (!InputLimits.firstName.validChars.value.test(lastName)) return InputLimits.firstName.validChars.message;
    return '';
  }

  validateEmailForLogin(email: string): string {
    return email.length ? '' : 'Email address is required';
  }

  validatePasswordForLogin(password: string): string {
    return password.length ? '' : 'Password is required';
  }
}
