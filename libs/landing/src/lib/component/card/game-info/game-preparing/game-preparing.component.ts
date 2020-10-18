import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { allPositions, Table } from '@fussball/data';
import { PlayerPositions } from '../game-preparing-team/game-preparing-team.component';

@Component({
  selector: 'fuss-game-preparing',
  templateUrl: './game-preparing.component.html',
  styleUrls: ['./game-preparing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePreparingComponent implements OnChanges {

  @Input() table: Table;
  @Input() showTableName = true;

  team1Players: PlayerPositions[];
  team2Players: PlayerPositions[];

  ngOnChanges(changes: SimpleChanges): void {
    const tableChanges = changes.table;
    if (tableChanges) {
      this.team1Players = this.getPlayerPositions('team1');
      this.team2Players = this.getPlayerPositions('team2');
    }
  }

  private getPlayerPositions(team: 'team1' | 'team2'): PlayerPositions[] {
    return this.table.game[team].map(uid => {
      const positions = allPositions.filter(p => this.table.game.latestPosition[p] === uid);
      const {displayName, photoURL } = this.table.game.players[uid];
      return { 
        positions: positions.map(p => p.replace('red', '').replace('blue', '')), 
        displayName: displayName.split(' ')[0], 
        photoURL
       };
    });
  }

}
