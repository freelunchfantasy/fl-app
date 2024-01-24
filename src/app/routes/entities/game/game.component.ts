import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import * as fromApplicationRoot from '@app/state/reducers';
import * as fromGameRoot from '@app/routes/entities/game/state/reducer';
import * as GameActions from '@app/routes/entities/game/state/game-actions';
import { Store } from '@ngrx/store';
import { UserGuess, GameEndInfo } from '@app/lib/models/user-guess';
import * as moment from 'moment';
import { GameUser } from '@app/lib/models/user';
import { AsyncStatus } from '@app/lib/enums/async-status';
import { ComparisonClassService } from '@app/services/comparison-class-service';
import { GameOutcomes } from '@app/lib/constants/game-outcome.constants';
import { comparisonConstants } from '@app/lib/constants/comparison.constants';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  TOTAL_GAME_ROWS: number = 6;

  // Color scheme
  textColor: string = '#FFFFFF';
  greenColor: string = '#339933';
  redColor: string = '#C00600';
  blueColor: string = '#004080';

  completedFirstLoad: boolean = false;
  today: string = '';
  gameUser: GameUser;
  userGuesses: UserGuess[] = [];
  newGuess: string = '';
  todaysTargetWordId: number;
  totalRows: number[] = Array(this.TOTAL_GAME_ROWS).fill(1);
  rowToAnimate: number = 1; // start at 1 since the 0th row is the columns header
  submittingGuess: boolean = false;
  currentGuessNumber: number = 1;
  currentMatchingLetters: string = '';
  gameOver: boolean = false;
  gameWon: boolean = false;
  gameOutcome: string;
  gameEndInfo: GameEndInfo;
  showGameEndModal: boolean = false;
  gameEndModalTitle: string = '';
  gameEndModalSubtitle: string = '';

  gameUser$(): Observable<GameUser> {
    return this.appStore.select(fromApplicationRoot.selectGameUser);
  }

  todaysTargetWordId$(): Observable<number> {
    return this.gameStore.select(fromGameRoot.selectTodaysTargetWordId);
  }

  todaysTargetWordIdFinishedLoading$(): Observable<boolean> {
    return this.gameStore.select(
      fromGameRoot.selectTodaysTargetWordFinishedLoading
    );
  }

  userGuesses$(): Observable<UserGuess[]> {
    return this.gameStore.select(fromGameRoot.selectUserGuesses);
  }

  userGuessesFinishedLoading$(): Observable<boolean> {
    return this.gameStore.select(fromGameRoot.selectUserGuessesFinishedLoading);
  }

  submitGuessStatus$(): Observable<AsyncStatus> {
    return this.gameStore.select(fromGameRoot.selectSubmitGuessStatus);
  }

  gameEndInfo$(): Observable<GameEndInfo> {
    return this.gameStore.select(fromGameRoot.selectGameEndInfo);
  }

  gameEndInfoFinishedLoading$(): Observable<boolean> {
    return this.gameStore.select(fromGameRoot.selectGameEndInfoFinishedLoading);
  }

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    public gameStore: Store<fromGameRoot.State>,
    private comparisonClassService: ComparisonClassService // used in html
  ) {}

  ngOnInit(): void {
    this.today = moment.utc().format('MM/DD/YYYY');
    this.gameStore.dispatch(new GameActions.GetTodaysTargetWordId(this.today));

    // Game user and today target word id subscription
    const todaysTargetWordIdSubscription = combineLatest([
      this.gameUser$(),
      this.todaysTargetWordId$(),
      this.todaysTargetWordIdFinishedLoading$(),
    ]).subscribe(([gameUser, targetWordId, targetWordIdFinishedLoading]) => {
      if (gameUser && targetWordIdFinishedLoading) {
        this.todaysTargetWordId = targetWordId;
        this.gameUser = gameUser;
        this.getUserGuesses(gameUser.id);
      }
    });
    this.subscriptions.push(todaysTargetWordIdSubscription);

    // User guesses subscription
    const userGuessesSubscription = combineLatest([
      this.userGuesses$(),
      this.userGuessesFinishedLoading$(),
    ]).subscribe(([userGuesses, finishedLoading]) => {
      if (finishedLoading) {
        this.completedFirstLoad = true;
        this.userGuesses = userGuesses.map((guess) => ({
          ...guess,
          resultJson: JSON.parse(JSON.parse(guess.result)),
        }));
        this.animateGameRows(this.userGuesses);
        this.rowToAnimate = this.userGuesses.length + 1;
        this.currentGuessNumber = this.getCurrentGuessNumber(this.userGuesses);
        this.currentMatchingLetters = this.getCurrentMatchingLetters(
          this.userGuesses
        );
        this.gameOver = this.determineIfGameOver(this.userGuesses);
        if (this.gameOver) {
          this.gameStore.dispatch(
            new GameActions.GetGameEndInfo({
              userId: this.gameUser.id,
              targetWordId: this.todaysTargetWordId,
            })
          );
        } else {
          this.addNewGuessInput();
        }
      }
    });
    this.subscriptions.push(userGuessesSubscription);

    // Submit guess subscription
    const submitGuessStatusSubscription = this.submitGuessStatus$().subscribe(
      (status) => {
        if (status == AsyncStatus.Success && this.submittingGuess) {
          this.handleValidGuess();
        } else if (status == AsyncStatus.Failure && this.submittingGuess) {
          this.handleInvalidGuess();
        }
      }
    );
    this.subscriptions.push(submitGuessStatusSubscription);

    // Game end info subscription
    const gameEndInfoSubscription = combineLatest([
      this.gameEndInfo$(),
      this.gameEndInfoFinishedLoading$(),
    ]).subscribe(([gameEndInfo, finishedLoading]) => {
      if (finishedLoading) {
        this.gameEndInfo = gameEndInfo;
        this.handleGameEnd(this.gameWon);
      }
    });
    this.subscriptions.push(gameEndInfoSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getUserGuesses(userId: number) {
    this.gameStore.dispatch(
      new GameActions.GetUserGuesses({ userId, date: this.today })
    );
  }

  getCurrentGuessNumber(userGuesses: UserGuess[]) {
    return userGuesses.length + 1;
  }

  animateGameRows(guesses: UserGuess[]) {
    const guessRows = document.getElementsByClassName('guess');
    for (var i = this.rowToAnimate; i <= guesses.length; i++) {
      this.removeRowNewGuessInput(guessRows[i]);
      this.animateGameRow(guesses[i - 1], guessRows[i]);
    }
  }

  animateGameRow(guess: UserGuess, row: any) {
    // Word
    this.animateWordField(guess, row);
    // Matching Letters
    this.animateMatchingLettersField(guess, row);
    // Alphabetical
    this.animateAlphabeticalField(guess, row);
    // Letters
    this.animateLettersField(guess, row);
    // Syllables
    this.animateSyllablesField(guess, row);
    // First Used
    this.animateFirstUsedField(guess, row);
    // Definition Hint
    this.animateDefinitionHintField(guess, row);
  }

  handleValidGuess() {
    this.submittingGuess = false;
    this.getUserGuesses(this.gameUser.id);
  }

  handleInvalidGuess() {
    this.submittingGuess = false;
    Array.from(
      document.getElementsByClassName(
        'new-guess-input'
      ) as HTMLCollectionOf<HTMLElement>
    )[0].classList.add('invalid');
  }

  determineIfGameOver(userGuesses: UserGuess[]) {
    const gameWon =
      userGuesses.find((guess) => guess.resultJson.comparison.sameWord) != null;
    const gameLost = userGuesses.length >= this.TOTAL_GAME_ROWS;
    this.gameWon = gameWon;
    return gameWon || gameLost;
  }

  getCurrentMatchingLetters(userGuesses: UserGuess[]) {
    return (userGuesses || []).length > 0
      ? userGuesses
          .slice(userGuesses.length - 1)[0]
          .resultJson.comparison.correctLetters.replace(/\s/g, '')
      : '';
  }

  handleSubmitNewGuess() {
    // ADD VALIDATION
    if (!this.submittingGuess) {
      this.submittingGuess = true;
      this.gameStore.dispatch(
        new GameActions.SubmitGuess({
          word: this.newGuess,
          targetWordId: this.todaysTargetWordId,
          userId: this.gameUser.id,
          currentGuessNumber: this.currentGuessNumber,
          prevMatchingLetters: this.currentMatchingLetters,
        })
      );
      this.newGuess = '';
    }
  }

  handleGameEnd(gameWon: boolean) {
    if (gameWon) {
      this.handleGameWon();
    } else {
      this.handleGameLost();
    }
  }

  handleGameWon() {
    this.gameEndModalTitle = 'Got it!';
    this.gameOutcome = GameOutcomes.WON;
    this.showGameEndModal = true;
  }

  handleGameLost() {
    this.gameEndModalTitle = 'Rats!';
    this.gameEndModalSubtitle = 'Today was a tough one';
    this.gameOutcome = GameOutcomes.LOST;
    this.showGameEndModal = true;
  }

  closeGameEndModal() {
    this.showGameEndModal = false;
  }

  animateWordField(guess: UserGuess, row: any) {
    var el = row.querySelector('.word');
    if (guess.resultJson.comparison.sameWord) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.word;
    fieldValueEl.style.opacity = 1;
  }

  animateMatchingLettersField(guess: UserGuess, row: any) {
    var el = row.querySelector('.matching-letters');
    if (guess.resultJson.comparison.sameWord) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.comparison.correctLetters;
    fieldValueEl.style.opacity = 1;
  }

  animateAlphabeticalField(guess: UserGuess, row: any) {
    var el = row.querySelector('.alphabetical');
    if (
      guess.resultJson.comparison.alphabetically ==
      comparisonConstants.alphabetically.EARLIER
    ) {
      el.style.backgroundColor = this.redColor;
    } else if (
      guess.resultJson.comparison.alphabetically ==
      comparisonConstants.alphabetically.LATER
    ) {
      el.style.backgroundColor = this.blueColor;
    } else if (
      guess.resultJson.comparison.alphabetically ==
      comparisonConstants.alphabetically.SAME
    ) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.comparison.alphabetically;
    fieldValueEl.style.opacity = 1;
  }

  animateLettersField(guess: UserGuess, row: any) {
    var el = row.querySelector('.letters');
    if (
      guess.resultJson.comparison.numLetters ==
      comparisonConstants.numerically.FEWER
    ) {
      el.style.backgroundColor = this.redColor;
    } else if (
      guess.resultJson.comparison.numLetters ==
      comparisonConstants.numerically.MORE
    ) {
      el.style.backgroundColor = this.blueColor;
    } else if (
      guess.resultJson.comparison.numLetters ==
      comparisonConstants.numerically.SAME
    ) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.numLetters;
    fieldValueEl.style.opacity = 1;
  }

  animateSyllablesField(guess: UserGuess, row: any) {
    var el = row.querySelector('.syllables');
    if (
      guess.resultJson.comparison.numSyllables ==
      comparisonConstants.numerically.FEWER
    ) {
      el.style.backgroundColor = this.redColor;
    } else if (
      guess.resultJson.comparison.numSyllables ==
      comparisonConstants.numerically.MORE
    ) {
      el.style.backgroundColor = this.blueColor;
    } else if (
      guess.resultJson.comparison.numSyllables ==
      comparisonConstants.numerically.SAME
    ) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.numSyllables;
    fieldValueEl.style.opacity = 1;
  }

  animateFirstUsedField(guess: UserGuess, row: any) {
    var el = row.querySelector('.first-used');
    if (
      guess.resultJson.comparison.firstUsed ==
      comparisonConstants.chronologically.EARLIER
    ) {
      el.style.backgroundColor = this.redColor;
    } else if (
      guess.resultJson.comparison.firstUsed ==
      comparisonConstants.chronologically.LATER
    ) {
      el.style.backgroundColor = this.blueColor;
    } else if (
      guess.resultJson.comparison.firstUsed ==
      comparisonConstants.chronologically.SAME
    ) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.firstUsed;
    fieldValueEl.style.opacity = 1;
  }

  animateDefinitionHintField(guess: UserGuess, row: any) {
    var el = row.querySelector('.definition-hint');
    if (guess.resultJson.comparison.sameWord) {
      el.style.backgroundColor = this.greenColor;
    }
    var fieldValueEl = el.querySelector('.field-value');
    fieldValueEl.innerHTML = guess.resultJson.comparison.definitionPortion;
    fieldValueEl.style.opacity = 1;
  }

  addNewGuessInput() {
    var thisGuessInput = Array.from(
      document.getElementsByClassName(
        'new-guess-input'
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    thisGuessInput.style.opacity = '1';
  }

  removeRowNewGuessInput(row: any) {
    var wordField = row.querySelector('.word');
    var inputField = row.querySelector('.new-guess-input');
    wordField.removeChild(inputField);
  }
}
