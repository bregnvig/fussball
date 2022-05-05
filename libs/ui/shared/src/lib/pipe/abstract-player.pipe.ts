import { ChangeDetectorRef, Directive, PipeTransform } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/utils';
import { filter, first, map } from 'rxjs/operators';

export type PlayerProperty = keyof Pick<Player, 'displayName' | 'photoURL' | 'email'>;

@Directive()
export abstract class AbstractPlayerPipe implements PipeTransform {

  private value?: string;
  private previousUID?: string;

  constructor(private facade: PlayersFacade, private ref: ChangeDetectorRef) {
  }

  transform(uid: string): string | null {
    if (this.previousUID !== uid) {
      this.previousUID = uid;
      this.facade.allPlayers$.pipe(
        filter(players => !!(players && players.length)),
        map(players => players.find(p => p.uid === uid)),
        truthy(),
        first(),
      ).subscribe(player => {
        this.value = this.decorate(player[this.getProperty()]);
        setTimeout(() => this.ref.markForCheck());
      });
    }
    return this.value || null;
  }

  protected decorate(value: string): string {
    return value;
  }

  protected abstract getProperty(): PlayerProperty;

}
