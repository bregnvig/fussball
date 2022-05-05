import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GamePlayer } from '@fussball/data';


export interface PlayerPositions extends GamePlayer { 
  positions: string[];
 };


@Component({
  selector: 'fuss-game-preparing-team',
  templateUrl: './game-preparing-team.component.html',
  styleUrls: ['./game-preparing-team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePreparingTeamComponent {

  @Input() teamName?: string;
  @Input() playerPositions: PlayerPositions[] = [];

}
