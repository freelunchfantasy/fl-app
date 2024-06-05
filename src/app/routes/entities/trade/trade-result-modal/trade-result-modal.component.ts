import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player, Team, TradeSimulationResult } from '@app/lib/models/league';
import { TradeBlock } from '../trade.constants';

@Component({
  selector: 'trade-result-modal',
  templateUrl: './trade-result-modal.component.html',
  styleUrls: ['./trade-result-modal.component.scss'],
})
export class TradeResultModalComponent implements OnInit {
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

  tradeBlockLeftTeam: Team;
  tradeBlockRightTeam: Team;

  constructor() {}

  ngOnInit(): void {
    this.processTradeBlock(this.tradeBlock);
  }

  processTradeBlock(tradeBlock: TradeBlock) {
    this.tradeBlockLeftTeam = this.leagueStandings.find((t: Team) =>
      t.roster.find((p: Player) => p.id == tradeBlock.left[0].id)
    );
    this.tradeBlockRightTeam = this.leagueStandings.find((t: Team) =>
      t.roster.find((p: Player) => p.id == tradeBlock.right[0].id)
    );
  }

  getPlayersString(players: Player[]): string {
    if (!players.length) return '';
    let playersString = `${players[0].name}`;
    let i = 1;
    while (i < players.length) {
      playersString = `${playersString}${players.length > 2 ? ',' : ''} ${i != players.length - 1 ? '' : 'and '}${
        players[i].name
      }`;
      i++;
    }
    return playersString;
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}
