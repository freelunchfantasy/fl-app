import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNavOption } from '@app/lib/models/navigation';

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {}

  navOptionClicked(option: AppNavOption) {
    this.router.navigate([option.path], { relativeTo: this.activatedRoute });
  }
}
