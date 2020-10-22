import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayersActions, PlayersFacade } from '@fussball/api';
import { Team } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'pla-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsListComponent implements OnInit {

  teams$: Observable<Team[]>;

  constructor(private facade: PlayersFacade) { }

  ngOnInit(): void {
    this.facade.dispatch(PlayersActions.loadTeams());
    this.teams$ = this.facade.allTeams$;
  }

  link;

}
