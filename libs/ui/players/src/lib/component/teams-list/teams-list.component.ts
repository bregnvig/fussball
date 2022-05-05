import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayersActions, PlayersFacade } from '@fussball/api';
import { Team } from '@fussball/data';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { TeamNameDialogComponent } from './../team-name-dialog/team-name-dialog.component';

@Component({
  selector: 'fuss-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsListComponent implements OnInit {

  teams$: Observable<Team[]>;

  constructor(private facade: PlayersFacade, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.facade.dispatch(PlayersActions.loadTeams());
    this.teams$ = this.facade.allTeams$;
  }

  renameTeam(team: Team) {
    this.dialog.open(TeamNameDialogComponent, {
      width: '250px',
      data: { team }
    }).afterClosed().pipe(
      switchMap(result => result),
      first()
    ).subscribe(name => this.snackBar.open(`Holdet hedder nu ${name} 🥳`, null, { duration: 3000 }));

  }

}
