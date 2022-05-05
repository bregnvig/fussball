import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { PlayersFacade } from '@fussball/api';
import { AbstractPlayerPipe, PlayerProperty } from './abstract-player.pipe';

@Pipe({
  name: 'photoURL',
  pure: false,
})
export class PhotoURLPipe extends AbstractPlayerPipe implements PipeTransform {

  constructor(facade: PlayersFacade, ref: ChangeDetectorRef) {
    super(facade, ref);
  }

  protected getProperty(): PlayerProperty {
    return 'photoURL';
  }

  protected override decorate(url: string): string {
    if (url.includes('facebook')) {
      return url + '?width=320';
    }
    return url.replace('=s96', '=s320');
  }

}
