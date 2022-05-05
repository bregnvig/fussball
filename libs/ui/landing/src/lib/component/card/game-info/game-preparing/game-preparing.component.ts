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

  @Input() table?: Table;
  @Input() showTableName = true;

  teamRedPlayers: PlayerPositions[] = [];
  teamBluePlayers: PlayerPositions[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const tableChanges = changes['table'];
    if (tableChanges) {
      this.teamRedPlayers = this.getPlayerPositions('red');
      this.teamBluePlayers = this.getPlayerPositions('blue');
    }
  }

  private getPlayerPositions(color: 'red' | 'blue'): PlayerPositions[] {
    if(this.table?.game?.players) {
      const colorPlayerUids = allPositions.filter(p => p.includes(color)).map(p => this.table!.game.latestPosition[p]).filter(uid => !!uid) as string[];

      return Array.from(new Set(colorPlayerUids)).map(uid => {
      const positions = allPositions.filter(p => this.table!.game.latestPosition[p] === uid);
        const {displayName, photoURL } = this.table!.game.players[uid];
        return { 
          positions: positions.map(p => p.replace('red', '').replace('blue', '')), 
          displayName: displayName.split(' ')[0], 
          photoURL
         };
      });
    }
    return [];
  }

}
