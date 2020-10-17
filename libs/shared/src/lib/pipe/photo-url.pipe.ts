import { Pipe } from '@angular/core';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'photoURL',
  pure: false,
})
export class PhotoURLPipe extends AbstractPlayerPipe {

  getProperty(): PlayerProperty {
    return 'photoURL';
  }

}
