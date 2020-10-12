import { OnDestroy, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable, pipe, Subject, Subscription, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractControlComponent implements OnDestroy, ControlValueAccessor {


  protected subscriptions: Subscription[] = [];
  protected destroyed$ = new Subject<boolean>();

  private queue: any[] = [];
  private _propagateChange: (_: any) => any;
  private _propagateTouched: (_?: any) => any;
  private readonly _uniqueId: string;

  protected constructor() {
  }

  ngOnDestroy() {
    // TODO FIX THIS WHEN V9 BEHAVES!!
    const destroy = function() {
      this.destroyed$.next(true);
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };
    if (Array.isArray(this)) {
      this.filter(component  => component instanceof AbstractControlComponent)
        .forEach(component => destroy.bind(component)());
    } else {
      destroy.bind(this)();
    }
  }

  onBlur() {
    if (this.propagateTouched) {
      this.propagateTouched();
    }
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil<T>(this.destroyed$));
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
    if (this.queue.length) {
      let value;
      while (value = this.queue.shift()) {
        this.propagateChange(value);
      }
    }
  }

  registerOnTouched(fn: any): void {
    this._propagateTouched = fn;
  }

  protected propagateChange(_: any): void {
    if (this._propagateChange) {
      this._propagateChange(_);
    } else {
      this.queue.push(_);
    }
  }

  protected propagateTouched(): void {
    if (this._propagateTouched) {
      this._propagateTouched();
    }
  }

  abstract writeValue(value: any): void;

  abstract markAllTouched(): void;

}
