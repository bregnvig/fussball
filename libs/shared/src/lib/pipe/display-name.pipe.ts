import { Pipe } from '@angular/core';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'displayName'
})
export class DisplayNamePipe extends AbstractPlayerPipe {

  getProperty(): PlayerProperty {
    return 'displayName';
  }
}
