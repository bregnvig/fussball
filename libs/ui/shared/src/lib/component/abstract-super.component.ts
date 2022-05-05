import { Directive, OnDestroy } from '@angular/core';
import { Subscription, Subject, UnaryFunction, Observable, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export class AbstractSuperComponent implements OnDestroy {

  protected readonly subscriptions: Subscription[] = [];

  protected destroyed$: Subject<boolean>;

  constructor() {
    this.destroyed$ = new Subject<boolean>();
  }

  ngOnDestroy() {
    // TODO FIX THIS WHEN V9 BEHAVES!!
    const destroy = function () {
      this.destroyed$.next(true);
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };
    if (Array.isArray(this)) {
      this.filter(component => component instanceof AbstractSuperComponent)
        .forEach(component => destroy.bind(component)());
    } else {
      destroy.bind(this)();
    }
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil<T>(this.destroyed$));
  }
}
