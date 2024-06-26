import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { InputValidationService } from '@app/services/input-validation-service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@app/lib/models/user';
import { AsyncStatus } from '@app/lib/enums/async-status';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit, OnDestroy {
  @Output()
  toggleLoginMode: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  user: User;
  email: string = '';
  emailError: string = '';
  firstName: string = '';
  lastName: string = '';
  message: string = '';
  messageError: string = '';
  maxMessageLength: number = 512;

  isLoading: boolean = false;
  alreadySubmitted: boolean = false;

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  contactEmailStatus$(): Observable<AsyncStatus> {
    return this.appStore.select(fromApplicationRoot.selectContactEmailStatus);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private inputValidationService: InputValidationService
  ) {}

  ngOnInit(): void {
    const userSusbcription = this.user$().subscribe(user => {
      if (user) {
        this.user = user;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
      }
    });
    this.subscriptions.push(userSusbcription);

    const contactEmailStatusSubscription = this.contactEmailStatus$().subscribe(status => {
      this.isLoading = status == AsyncStatus.Processing;
      if (status == AsyncStatus.Success) {
        this.alreadySubmitted = true;
      }
    });
    this.subscriptions.push(contactEmailStatusSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.appStore.dispatch(new ApplicationActions.ClearContactEmailStatus());
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

    const focusMessageLabel = () => {
      var element = document.getElementById('label__message');
      element.classList.add('focus');
    };

    const name = event.target.name;
    if (name == 'email') focusEmailLabel();
    if (name == 'first-name') focusFirstNameLabel();
    if (name == 'last-name') focusLastNameLabel();
    if (name == 'message') focusMessageLabel();
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

    const unfocusMessageLabel = () => {
      var element = document.getElementById('label__message');
      element.classList.remove('focus');
    };

    const name = event.target.name;
    if (name == 'email') unfocusEmailLabel();
    if (name == 'first-name') unfocusFirstNameLabel();
    if (name == 'last-name') unfocusLastNameLabel();
    if (name == 'message') unfocusMessageLabel();
  }

  handleContactFormSubmit() {
    const validationResult = this.inputValidationService.validateContactInputs({
      e: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      message: this.message,
    });
    const canSubmit = !Object.values(validationResult).find(message => message.length > 0);
    if (canSubmit) {
      this.appStore.dispatch(
        new ApplicationActions.SendContactEmail({
          e: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          message: this.message,
        })
      );
    } else {
      this.handleInputErrors(validationResult);
    }
  }

  handleInputErrors(validationResult: any) {
    this.emailError = validationResult.email;
    this.messageError = validationResult.message;
  }

  navigateToHome() {
    this.appStore.dispatch(new ApplicationActions.NavigateToHome());
  }

  navigateToLogin() {
    this.appStore.dispatch(new ApplicationActions.NavigateToLogin());
  }
}
