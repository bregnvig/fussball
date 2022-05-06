import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { PlayerFacade, PlayersActions, PlayersFacade } from '@fussball/api';
import { Role } from '@fussball/data';
import { truthy } from '@fussball/utils';
import * as equal from 'fast-deep-equal/es6';
import { filter, first, map, pairwise, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fuss-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private messaging: AngularFireMessaging,
    private playerFacade: PlayerFacade,
    private playersFacade: PlayersFacade,
    private updates: SwUpdate,
    private snackBar: MatSnackBar,
    private router: Router) {

  }

  ngOnInit() {
    this.playerFacade.unauthorized$.pipe(
      truthy(),
    ).subscribe(() => this.router.navigate(['login']));
    this.playerFacade.authorized$.pipe(
      filter(authorized => authorized),
      switchMap(() => this.playerFacade.player$),
      startWith(null),
      pairwise(),
      filter(([previous, current]) => !equal(previous, current)),
      map(([, current]) => current),
      truthy(),
    ).subscribe(player => {
      if (player.roles && (['player', 'viewer'] as Role[]).some(role => player.roles?.includes(role))) {
        if (this.router.url === '/info/roles') {
          this.router.navigate(['/']);
        }
        if (player.roles.includes('viewer')) {
          this.router.navigate(['tables', player.table, 'game']);
        }
        this.playersFacade.dispatch(PlayersActions.loadPlayers());
        // if (Notification.permission === "granted") {
        //   this.playerFacade.dispatch(PlayerActions.loadMessagingToken());
        // } else if (Notification.permission === 'denied') {
        //   console.log('Messaging denied');
        // } else {
        //   setTimeout(() => {
        //     this.snackBar.open('Hvis du vil modtage påmindelse, løbsresultater etc, så skal du godkende at vi må sende notifikationer til dig 👍', 'OK').onAction()
        //       .subscribe(() => this.playerFacade.dispatch(PlayerActions.loadMessagingToken()));
        //   });
        // }
      } else {
        this.router.navigate(['info', 'roles']);
      }
    });
    this.updates.available.pipe(
      switchMap(() => this.snackBar.open('🤩 Ny version klar', 'OPDATER', { duration: 10000 }).onAction()),
      switchMap(() => this.updates.activateUpdate()),
      first(),
    ).subscribe(() => location.reload());
    this.messaging.onMessage(message => this.snackBar.open(message.notification.body, undefined, { duration: 2000 }));
  }
}
