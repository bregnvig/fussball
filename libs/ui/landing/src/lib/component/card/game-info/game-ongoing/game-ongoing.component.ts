import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { allPositions, Match, Table } from '@fussball/data';

@Component({
  selector: 'fuss-game-ongoing',
  templateUrl: './game-ongoing.component.html',
  styleUrls: ['./game-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOngoingComponent implements OnChanges {
  
  @Input() table?: Table;
  @Input() severalTables = true;
  
  teamRedNames?: string;
  teamBlueNames?: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.teamRedNames = this.getNames('red');
    this.teamBlueNames = this.getNames('blue');
  }

  get matchNumber(): number {
    return this.table?.game?.matches?.length || 1 
  }

  get match(): Match | undefined {
    return this.table?.game?.matches?.[this.table.game.matches.length - 1];
  }

  private getNames(color: 'red' | 'blue'): string | undefined {
    if(this.table?.game?.players) {
      const colorPlayerUids = allPositions.filter(p => p.includes(color)).map(p => this.table!.game.latestPosition[p]).filter(x => !!x) as string[];

      return Array.from(new Set(colorPlayerUids)).map(uid => this.table!.game.players[uid].displayName.split(' ')[0]).join(' og ');
    }
    return undefined;
  }
}
