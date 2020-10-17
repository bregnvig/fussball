import { ChangeDetectorRef, Pipe } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'photoURL',
  pure: false,
})
export class PhotoURLPipe extends AbstractPlayerPipe {

  constructor(facade: PlayersFacade, ref: ChangeDetectorRef) {
    super(facade, ref);
  }
  getProperty(): PlayerProperty {
    return 'photoURL';
  }

}
