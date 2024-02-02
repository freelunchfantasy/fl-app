import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import { InputValidationService } from '@app/services/input-validation-service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@app/lib/models/user';

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
  firstName: string = '';
  lastName: string = '';
  message: string = '';
  messageError: string = '';

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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    this.messageError = validationResult.message;
  }
}
