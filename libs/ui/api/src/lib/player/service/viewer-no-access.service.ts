import { Injectable } from "@angular/core";
import { CanActivate, CanLoad } from '@angular/router';
import { truthy } from '@fussball/tools';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlayerFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class ViewerNoAccessService implements CanLoad, CanActivate {

  guard$: Observable<boolean>;

  constructor(facade: PlayerFacade) {
    this.guard$ = facade.authorized$.pipe(
      truthy(),
      switchMap(() => facade.player$),
      map(player => !player.roles.includes('viewer'))
    );
  }
  canActivate(): Observable<boolean> {
    return this.guard$;
  }

  canLoad(): Observable<boolean> {
    return this.guard$;
  }

}