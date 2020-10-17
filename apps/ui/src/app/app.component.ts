import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { PlayerFacade, PlayersActions, PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { GoogleMessaging } from '@fussball/firebase';
import { truthy } from '@fussball/tools';
import * as equal from 'fast-deep-equal/es6';
import { filter, first, map, pairwise, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fuss-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(GoogleMessaging) private messaging: firebase.messaging.Messaging,
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
      startWith(<Player>null),
      pairwise(),
      filter(([previous, current]) => !equal(previous, current)),
      map(([_, current]) => current)
    ).subscribe(player => {
      if (player.roles && player.roles.includes('player')) {
        if (this.router.url === '/info/roles') {
          this.router.navigate(['/']);
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
    this.messaging.onMessage(message => this.snackBar.open(message.notification.body, null, { duration: 2000 }));
  }
}
