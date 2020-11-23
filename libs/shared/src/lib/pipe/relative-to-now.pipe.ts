import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { interval, Subscription } from 'rxjs';

@Pipe({
  name: 'relativeToNow',
  pure: false
})
export class RelativeToNowPipe implements PipeTransform, OnDestroy {


  #subscription: Subscription;

  constructor(cd: ChangeDetectorRef) {
    this.#subscription = interval(1000).subscribe(() => cd.markForCheck());
  }

  ngOnDestroy() {
    this.#subscription?.unsubscribe();
  }
  transform(value: DateTime | null | undefined): string | null | undefined {
    return value instanceof DateTime ? value.toRelative({ locale: 'da' }) : value;
  }
}

