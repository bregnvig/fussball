import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'relativeToNow',
})
export class RelativeToNowPipe implements PipeTransform {

  transform(value: DateTime | null | undefined): string | null | undefined {
    return value instanceof DateTime ? value.toRelative({locale: 'da'}) : value;
  }
}

