import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fuss-game-players',
  templateUrl: './game-players.component.html',
  styleUrls: ['./game-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePlayersComponent {

  @Input() left: [string, string];
  @Input() right: [string, string];

  @Input() avatarClass: 'avatar' | 'gameAvatar' = 'gameAvatar';
}
