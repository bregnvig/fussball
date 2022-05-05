import { Pipe, PipeTransform } from '@angular/core';
import { Position } from '@fussball/data';

const names = new Map<Position, string>([
  ['redDefence', 'Forsvar'],
  ['redOffence', 'Angreb'],
  ['blueDefence', 'Forsvar'],
  ['blueOffence', 'Angreb'],
]);

@Pipe({
  name: 'position'
})
export class PositionPipe implements PipeTransform {

  transform(value: Position): string {
    return names.get(value);
  }

}
