import { ChangeDetectionStrategy, Component } from '@angular/core';

const random = (max: number): number => Math.floor(Math.random() * Math.floor(max));

const tyres: string[] = [
  'blue',
  'green',
  'red',
  'white',
  'yellow',
];

@Component({
  selector: 'sha-loading',
  template: `
    <div>
      <img [src]="tyre" alt="loading">
    </div>
  `,
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  readonly tyre: string;
  constructor() {
    this.tyre = `assets/loading/${tyres[random(5)]}.svg`;
  }
}
