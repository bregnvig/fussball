import { Component, OnInit } from '@angular/core';
import { PlayerFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  player$: Observable<Player>;

  constructor(private facade: PlayerFacade) {
  }

  ngOnInit(): void {
    this.player$ = this.facade.player$;
  }

}
