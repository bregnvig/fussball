import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Player } from '@fussball/data';
import { truthy } from '@fussball/utils';
import 'firebase/auth';
import { UserInfo } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { firstValueFrom, merge, Observable, ReplaySubject } from 'rxjs';
import { filter, first, map, mapTo, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerApiService {

  static readonly playersURL = 'players';

  readonly player$: Observable<Player | UserInfo | undefined>;
  private currentUser$ = new ReplaySubject<UserInfo | null>(1);

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private functions: AngularFireFunctions,
  ) {
    this.player$ = merge(
      this.currentUser$.pipe(map(user => user?.uid), truthy(), switchMap(uid => this.afs.doc<Player>(`${PlayerApiService.playersURL}/${uid}`).valueChanges())),
      this.currentUser$.pipe(truthy(), filter(user => !!user?.uid)));
    this.auth.getRedirectResult().then(result => {
      if (result && result.user) {
        firstValueFrom(this.updateBaseInformation(result.user as Player)).then(() => console.log('Base information updated'));
      }
    });
    this.auth.onAuthStateChanged(user => {
      this.currentUser$.next(user && { ...user });
      if (user) {
        firstValueFrom(this.updateBaseInformation(user as Player)).then(() => console.log('Base information updated'));
      }
      console.log(user);
    });
  }


  signInWithGoogle(): Promise<void> {
    return this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(_ => console.log('Signed in using google'));
  }

  signInWithFacebook(): Promise<void> {
    return this.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider()).then(_ => console.log('Signed in using facebook'));
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  updatePlayer(partialPlayer: Partial<Player>): Observable<Partial<Player>> {
    let payload: any = partialPlayer;
    if (partialPlayer.tokens) {
      payload = {
        ...partialPlayer,
        tokens: firebase.firestore.FieldValue.arrayUnion(...partialPlayer.tokens)
      };
    }
    return this.player$.pipe(
      truthy(),
      switchMap(player => this.afs.doc(`${PlayerApiService.playersURL}/${player.uid}`).update(payload)),
      mapTo(partialPlayer),
      first()
    );
  }

  joinWBC(): Observable<void> {
    return this.functions.httpsCallable('joinWBC')({});
  }

  undoWBC(): Observable<void> {
    return this.functions.httpsCallable('undoWBC')({});
  }

  private updateBaseInformation(player: Player): Observable<void> {
    const _player: Player = {
      uid: player.uid,
      displayName: player.displayName,
      email: player.email,
      photoURL: player.photoURL,
    };
    const doc = this.afs.doc(`${PlayerApiService.playersURL}/${player.uid}`);
    return doc.get().pipe(
      switchMap(snapshot => snapshot.exists ? doc.update(_player) : doc.set(_player)),
      first(),
    );
  }
}
