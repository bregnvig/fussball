import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fuss-game-team-players',
  templateUrl: './game-team-players.component.html',
  styleUrls: ['./game-team-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTeamPlayersComponent {

  @Input() top: string;
  @Input() bottom: string;
  @Input() avatarClass: 'avatar' | 'gameAvatar' = 'gameAvatar';

}
