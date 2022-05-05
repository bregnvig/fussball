import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { PlayersActions, PlayersApiService, PlayersFacade } from '@fussball/api';
import { Player, Role } from '@fussball/data';
import { AbstractSuperComponent } from '@fussball/shared';
import { truthy } from '@fussball/utils';
import { Observable } from 'rxjs';
import { first, pluck, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent extends AbstractSuperComponent implements OnInit {

  player$: Observable<Player>;
  fg: FormGroup;

  constructor(
    private facade: PlayersFacade,
    private route: ActivatedRoute,
    private playerService: PlayersApiService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      roles: this.fb.group({
        player: [],
        admin: [],
        viewer: [],
      }),
    });
    this.player$ = this.facade.selectedPlayer$;
    this.route.params.pipe(
      pluck<Params, string>('id'),
      this.takeUntilDestroyed(),
    ).subscribe(uid => this.facade.dispatch(PlayersActions.selectPlayer({ uid })));
    this.player$.pipe(
      truthy(),
      first()
    ).subscribe(player => {
      this.fg.get('roles').patchValue({
        player: player.roles.includes('player'),
        admin: player.roles.includes('admin'),
      }, { emitEvent: false });
    });
  }

  updateRoles() {
    const value = Object.values(this.fg.get('roles').value);
    const roles: Role[] = (['player', 'admin', 'viewer'] as Role[]).filter((_, index) => value[index]);
    this.player$.pipe(
      first(),
      switchMap(player => this.playerService.updatePlayer(player.uid, { roles: roles.length ? roles : ['anonymous'] })),
    ).subscribe(() => this.snackBar.open('Roller opdateret', null, { duration: 2000 }));
  }
}
