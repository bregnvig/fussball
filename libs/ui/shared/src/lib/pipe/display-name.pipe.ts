import { ChangeDetectorRef, Pipe } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'displayName',
  pure: false,
})
export class DisplayNamePipe extends AbstractPlayerPipe {

  constructor(facade: PlayersFacade, ref: ChangeDetectorRef) {
    super(facade, ref);
  }

  getProperty(): PlayerProperty {
    return 'displayName';
  }
}
