import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamName'
})
export class TeamNamePipe implements PipeTransform {

  transform(value: 'team1' | 'team2'): string {
    return value === 'team1' ? 'Hold 1' : 'Hold 2';
  }

}
