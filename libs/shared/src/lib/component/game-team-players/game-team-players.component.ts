import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sha-game-team-players',
  templateUrl: './game-team-players.component.html',
  styleUrls: ['./game-team-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTeamPlayersComponent {

  @Input() defence: string;
  @Input() offence: string;
  @Input() avatarClass: 'avatar' | 'gameAvatar' = 'gameAvatar';

}
