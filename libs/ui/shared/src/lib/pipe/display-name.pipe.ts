import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'displayName',
  pure: false,
})
export class DisplayNamePipe extends AbstractPlayerPipe implements PipeTransform {

  constructor(facade: PlayersFacade, ref: ChangeDetectorRef) {
    super(facade, ref);
  }

  getProperty(): PlayerProperty {
    return 'displayName';
  }
}
