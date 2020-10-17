import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/tools';
import { filter, first, map } from 'rxjs/operators';

export type PlayerProperty = keyof Pick<Player, 'displayName' | 'photoURL' | 'email'>;

export abstract class AbstractPlayerPipe implements PipeTransform {

  private value: string;
  private previousUID: string;

  constructor(private facade: PlayersFacade, private ref: ChangeDetectorRef) {
  }

  transform(uid: string): string | null {

    if (this.value) {
      return this.value;
    }
    if (this.previousUID !== uid) {
      this.previousUID = uid;
      this.facade.allPlayers$.pipe(
        filter(players => !!(players && players.length)),
        map(players => players.find(p => p.uid === uid)),
        truthy(),
        first(),
      ).subscribe(player => {
        this.value = player[this.getProperty()];
        setTimeout(() => this.ref.markForCheck());
      });
    }
    return null;
  }

  protected abstract getProperty(): PlayerProperty;

}
