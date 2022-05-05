import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerFacade } from '@fussball/api';
import { PlayerStat } from '@fussball/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fuss-player-stat',
  templateUrl: './player-stat.component.html',
  styleUrls: ['./player-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerStatComponent implements OnInit {

  stat$: Observable<PlayerStat>;
  icon$: Observable<string>;

  constructor(private facade: PlayerFacade) { }

  ngOnInit(): void {
    this.stat$ = this.facade.player$.pipe(
      map(player => player.stat)
    );
    this.icon$ = this.facade.player$.pipe(
      map(player => player.stat),
      map(stat => {
        return stat.won === stat.lost
          ? 'fa-thermometer-half'
          : stat.won > stat.lost ? 'fa-temperature-hot' : 'fa-temperature-frigid';
      })
    );
  }

}
