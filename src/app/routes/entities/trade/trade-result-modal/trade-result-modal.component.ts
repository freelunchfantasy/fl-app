import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Player, Team, TeamSimulationResult, TradeSimulationResult, UserLeague } from '@app/lib/models/league';
import { TradeBlock } from '../trade.constants';
import { ShareTradeSimulationResultPayload } from '@app/lib/models/league-payloads';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'trade-result-modal',
  templateUrl: './trade-result-modal.component.html',
  styleUrls: ['./trade-result-modal.component.scss'],
})
export class TradeResultModalComponent implements OnInit, OnDestroy {
  @Input()
  modalTitle: string = '';

  @Input()
  modalSubtitle: string = '';

  @Input()
  showCloseIcon?: boolean = true;

  @Input()
  tradeResult: TradeSimulationResult;

  @Input()
  leagueStandings: Team[] = [];

  @Input()
  tradeBlock: TradeBlock;

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  userLeague: UserLeague;

  tradeBlockLeftTeam: Team;
  tradeBlockRightTeam: Team;
  leftWinDiff: number = 0;
  rightWinDiff: number = 0;

  shareResultsClicked: boolean = false;
  email: string = '';

  constructor(public leagueStore: Store<fromLeagueRoot.State>) {}

  selectedUserLeague$(): Observable<UserLeague> {
    return this.leagueStore.select(fromLeagueRoot.selectSelectedUserLeague);
  }

  ngOnInit(): void {
    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.userLeague = userLeague;
    });
    this.subscriptions.push(selectedUserLeagueSubscription);

    this.processTradeBlock(this.tradeBlock);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processTradeBlock(tradeBlock: TradeBlock) {
    this.tradeBlockLeftTeam = this.leagueStandings.find((t: Team) =>
      t.roster.find((p: Player) => p.id == tradeBlock.left[0].id)
    );
    this.tradeBlockRightTeam = this.leagueStandings.find((t: Team) =>
      t.roster.find((p: Player) => p.id == tradeBlock.right[0].id)
    );
    this.leftWinDiff =
      this.tradeResult.after.find((t: TeamSimulationResult) => t.id == this.tradeBlockLeftTeam.id).wins -
      this.tradeResult.before.find((t: TeamSimulationResult) => t.id == this.tradeBlockLeftTeam.id).wins;
    this.rightWinDiff =
      this.tradeResult.after.find((t: TeamSimulationResult) => t.id == this.tradeBlockRightTeam.id).wins -
      this.tradeResult.before.find((t: TeamSimulationResult) => t.id == this.tradeBlockRightTeam.id).wins;
  }

  getTeamTradeSummary(isLeftTeam: boolean) {
    const winDiff = isLeftTeam ? this.leftWinDiff : this.rightWinDiff;
    const verb = winDiff >= 0 ? 'gain' : 'lose';
    return `${verb} ${Math.abs(winDiff).toFixed(2)} wins.`;
  }

  winDiffClasses(isLeftTeam: boolean) {
    const winDiff = isLeftTeam ? this.leftWinDiff : this.rightWinDiff;
    return winDiff >= 0 ? 'important positive' : 'important negative';
  }

  handleShareResultsClicked() {
    this.shareResultsClicked = true;
  }

  shareTradeSimulationResults() {
    const payload: ShareTradeSimulationResultPayload = {
      userId: this.userLeague.userId,
      userLeagueId: this.userLeague.id,
      targetEmail: this.email,
      leagueStandings: this.leagueStandings.map((t: Team) => ({ ...t, gamesPlayed: t.wins + t.losses + t.ties })),
      tradeBlock: this.tradeBlock,
      tradeResult: this.tradeResult,
    };
    this.leagueStore.dispatch(new LeagueActions.ShareTradeSimulationResult(payload));
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}
