import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Table } from '@fussball/data';

@Component({
  selector: 'fuss-game-completed',
  templateUrl: './game-completed.component.html',
  styleUrls: ['./game-completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCompletedComponent {

  team1 = 0;
  team2 = 0;

  team1Players!: [string, string];
  team2Players!: [string, string];

  private _table!: Table;

  @Input() set table(value: Table) {
    this.team1 = value.game.matches.reduce((acc, match) => acc + (match.team1 === 8 ? 1 : 0), 0);
    this.team2 = value.game.matches.reduce((acc, match) => acc + (match.team2 === 8 ? 1 : 0), 0);
    this.team1Players = value.game.team1.players as [string, string];
    this.team2Players = value.game.team2.players as [string, string];
    this._table = value;
  }

  get table(): Table {
    return this._table;
  }

}
