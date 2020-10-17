import { PipeTransform } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/tools';
import { first, map } from 'rxjs/operators';

export type PlayerProperty = keyof Pick<Player, 'displayName' | 'photoURL' | 'email'>;

export abstract class AbstractPlayerPipe implements PipeTransform {

  private value: string;
  private previousUID: string;

  constructor(private facade: PlayersFacade) {
  }

  transform(uid: string): string | null {

    if (this.value) {
      return this.value;
    }
    if (this.previousUID !== uid) {
      this.previousUID = uid;
      this.facade.allPlayers$.pipe(
        first(),
        map(players => players.find(p => p.uid === uid)),
        truthy()
      ).subscribe(player => this.value = player[this.getProperty()]);
    }
    return null;
  }

  protected abstract getProperty(): PlayerProperty;

}
