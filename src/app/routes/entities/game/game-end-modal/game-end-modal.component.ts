import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { GameEndInfo } from '@app/lib/models/user-guess';
import { GameOutcomes } from '@app/lib/constants/game-outcome.constants';

@Component({
  selector: 'game-end-modal',
  templateUrl: './game-end-modal.component.html',
  styleUrls: ['./game-end-modal.component.scss'],
})
export class GameEndModal implements OnInit, OnDestroy {
  @Input()
  modalTitle: string = '';

  @Input()
  modalSubtitle: string = '';

  @Input()
  gameEndInfo: GameEndInfo;

  @Input()
  gameOutcome: string;

  @Input()
  showCloseIcon?: boolean = true;

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  gameWon: boolean = false;
  gameLost: boolean = false;
  GAME_WON_MESSAGES: string[] = ['Got it!', 'Booya!', 'Well done!'];
  GAME_LOST_MESSAGES: string[] = ['Dang!', 'Almost!', `Get 'em next time!`];
  outcomeMessage: string = '';

  constructor() {}

  ngOnInit(): void {
    this.gameWon = this.gameOutcome == GameOutcomes.WON;
    this.gameLost = this.gameOutcome == GameOutcomes.LOST;
    this.outcomeMessage = this.determineOutcomeMessage();
  }

  ngOnDestroy(): void {}

  handleModalClose() {
    this.dismissModal.emit();
  }

  determineOutcomeMessage() {
    var message = '';
    if (this.gameWon)
      message =
        this.GAME_WON_MESSAGES[
          Math.floor(Math.random() * this.GAME_WON_MESSAGES.length)
        ];
    else if (this.gameLost)
      message =
        this.GAME_LOST_MESSAGES[
          Math.floor(Math.random() * this.GAME_WON_MESSAGES.length)
        ];
    return message;
  }

  getOutcomeMessageClass() {
    var messageClass = '';
    if (this.gameWon) messageClass = 'won';
    if (this.gameLost) messageClass = 'lost';
    return messageClass;
  }

  getCurrentStreakValueClass() {
    var streakClass = '';
    if (this.gameWon) streakClass = 'won';
    if (this.gameLost) streakClass = 'lost';
    return streakClass;
  }

  getLongestStreakValueClass() {
    if (this.gameEndInfo.longestStreak == 0) return '';
    return this.gameEndInfo.currentStreak == this.gameEndInfo.longestStreak
      ? 'won'
      : '';
  }
}
