import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { PlayerFacade } from '@fussball/api';
import { PlayerStat } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fuss-player-stat',
  templateUrl: './player-stat.component.html',
  styleUrls: ['./player-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerStatComponent {

  stat$: Observable<PlayerStat | undefined> = this.facade.player$.pipe(truthy(), map(({ stat }) => stat));
  icon$: Observable<IconProp> = this.facade.player$.pipe(truthy(), map(({ stat }) => stat?.won === stat?.lost ? 'thermometer-half' : (stat?.won ?? 0) > (stat?.lost ?? 0) ? 'temperature-hot' : 'temperature-frigid'), map(icon => (['far', icon])));

  constructor(private facade: PlayerFacade) { }

}
