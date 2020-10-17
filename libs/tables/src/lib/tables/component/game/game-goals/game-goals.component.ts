import { Component, Input } from '@angular/core';
import { Game, Match } from '@fussball/data';

@Component({
  selector: 'fussball-game-goals',
  templateUrl: './game-goals.component.html',
  styleUrls: ['./game-goals.component.scss']
})
export class GameGoalsComponent {

  matches: Match[];

  @Input() set game(value: Game) {
    this.matches = [...value.matches].reverse();
  }

}
