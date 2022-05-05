import { Component } from '@angular/core';
import { PlayerFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  player$: Observable<Player | undefined> = this.facade.player$;

  constructor(private facade: PlayerFacade) {
  }

}
