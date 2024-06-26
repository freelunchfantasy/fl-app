import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNavOption } from '@app/lib/models/navigation';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nav-option',
  templateUrl: './nav-option.component.html',
  styleUrls: ['./nav-option.component.scss'],
})
export class NavOptionComponent implements OnInit, OnDestroy {
  @Input()
  navOption: AppNavOption;

  @Input()
  bypassNav: boolean = false;

  navOptions: AppNavOption[] = [];

  constructor(
    private leagueStore: Store<fromLeagueRoot.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  navOptionClicked(option: AppNavOption) {
    // FOOTBALL clicked
    if (option.title == 'FOOTBALL') {
      this.leagueStore.dispatch(new LeagueActions.ClearLeagueData());
    }

    this.router.navigate([option.path], { relativeTo: this.activatedRoute });
  }
}
