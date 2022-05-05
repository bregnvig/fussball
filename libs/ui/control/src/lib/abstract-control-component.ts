/* eslint-disable */
import { ChangeDetectorRef, Directive, EventEmitter, Input, isDevMode, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject, merge, Observable, pipe, ReplaySubject, Subject, Subscription, UnaryFunction } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractControlComponent<WV = any> implements OnDestroy, ControlValueAccessor {

  @Input() id?: string;
  @Output() blur = new EventEmitter<void>();

  protected readonly subscriptions: Subscription[] = [];

  protected destroyed$: Subject<boolean>  = new Subject<boolean>();

  private queue: any[] = [];
  private _propagateChange?: (_: any) => any;
  private _propagateTouched?: (_?: any) => any;
  private _written$ = new ReplaySubject<WV>(1);
  private _disabledState$ = new BehaviorSubject<boolean>(false);
  private _markAllTouched$ = new ReplaySubject<void>(1);
  private readonly _uniqueId: string;

  protected constructor(protected cd?: ChangeDetectorRef) {
    this.destroyed$ = new Subject<boolean>();
    if (this.cd) {
      merge(this.writeValue$, this.disabledState$, this.markAllTouched$).pipe(
        debounceTime(50), // So that we are sure that we have all three when we want to mark for check
        this.takeUntilDestroyed()
      ).subscribe(() => this.cd!.markForCheck());
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil<T>(this.destroyed$));
  }

  protected get writeValue$(): Observable<WV> {
    isDevMode() && !this.cd && console.error('It seems like OnPush is being used for', this, ' Change detector ref not  provided!');
    return this._written$;
  }

  protected get disabledState$(): Observable<boolean> {
    return this._disabledState$;
  }

  protected get markAllTouched$(): Observable<void> {
    return this._markAllTouched$;
  }

  get isDisabled(): boolean {
    return this._disabledState$.value;
  }

  onBlur() {
    if (this.propagateTouched) {
      this.propagateTouched();
    }
    this.blur.emit();
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

  writeValue(value: WV) {
    this._written$.next(value);
  }

  registerOnTouched(fn: any): void {
    this._propagateTouched = fn;
  }

  protected propagateChange(_: any): void {
    if (this._propagateChange) {
      this._propagateChange(_);
      this.cd && this.cd.markForCheck();
    } else {
      this.queue.push(_);
    }
  }

  protected propagateTouched(): void {
    if (this._propagateTouched) {
      this._propagateTouched();
    }
  }

  uniqueId(postfix: string | number = ''): string {
    return this._uniqueId + postfix.toString();
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabledState$.next(isDisabled);
  }

  markAllTouched(): void {
    this._markAllTouched$.next();
  }

}
