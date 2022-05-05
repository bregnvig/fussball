import { Directive, OnDestroy } from '@angular/core';
import { Observable, pipe, Subject, Subscription, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export class AbstractSuperComponent implements OnDestroy {

  protected readonly subscriptions: Subscription[] = [];

  protected destroyed$: Subject<boolean>;

  constructor() {
    this.destroyed$ = new Subject<boolean>();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil<T>(this.destroyed$));
  }
}
