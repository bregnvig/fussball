import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Match, Table } from '@fussball/data';

@Component({
  selector: 'fuss-game-ongoing',
  templateUrl: './game-ongoing.component.html',
  styleUrls: ['./game-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOngoingComponent implements OnChanges {
  
  @Input() table: Table;
  @Input() severalTables = true;
  
  team1Names: string;
  team2Names: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.team1Names = this.getTeamNames('team1');
    this.team2Names = this.getTeamNames('team2');
  }

  get matchNumber(): number {
    return this.table.game.matches?.length || 1 
  }

  get match(): Match {
    return this.table.game.matches[this.table.game.matches.length - 1];
  }

  private getTeamNames(team: 'team1' | 'team2'): string {
    if(this.table.game.players) {
      return this.table.game[team].map(uid => this.table.game.players[uid].displayName.split(' ')[0]).join(' og ');
    }
  }
}
