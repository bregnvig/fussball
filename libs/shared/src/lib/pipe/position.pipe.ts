import { Pipe, PipeTransform } from '@angular/core';
import { Position } from '@fussball/data';

const names = new Map<Position, string>([
  ['redDefence', 'Rødt forsvar'],
  ['redOffence', 'Rødt angreb'],
  ['blueDefence', 'Blåt forsvar'],
  ['blueOffence', 'Blåt angreb'],
]);

@Pipe({
  name: 'position'
})
export class PositionPipe implements PipeTransform {

  transform(value: Position): string {
    return names.get(value);
  }

}
