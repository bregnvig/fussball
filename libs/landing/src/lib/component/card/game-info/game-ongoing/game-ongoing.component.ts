import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Match, Table } from '@fussball/data';

@Component({
  selector: 'fuss-game-ongoing',
  templateUrl: './game-ongoing.component.html',
  styleUrls: ['./game-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameOngoingComponent {

  @Input() table: Table;
  @Input() severalTables = true;

  get match(): Match {
    return this.table.game.matches[this.table.game.matches.length - 1];
  }
}
