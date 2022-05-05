import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  icon$: Observable<string> = this.facade.player$.pipe(truthy(), map(({ stat }) => stat?.won === stat?.lost ? 'fa-thermometer-half' : (stat?.won ?? 0) > (stat?.lost ?? 0) ? 'fa-temperature-hot' : 'fa-temperature-frigid'));

  constructor(private facade: PlayerFacade) { }

}
