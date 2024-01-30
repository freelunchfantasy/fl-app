import { Component, Input, OnInit } from '@angular/core';
import { Team } from '@app/lib/models/league';

@Component({
  selector: 'league-standings',
  templateUrl: './league-standings.component.html',
  styleUrls: ['./league-standings.component.scss'],
})
export class LeagueStandingsComponent implements OnInit {
  @Input()
  leagueStandings: Team[] = [];

  constructor() {}

  ngOnInit() {}
}
