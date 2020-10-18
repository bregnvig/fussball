import { ChangeDetectionStrategy, Component } from '@angular/core';

const random = (max: number): number => Math.floor(Math.random() * Math.floor(max));

const icons: string[] = [
  'soccer',
];

@Component({
  selector: 'sha-loading',
  template: `
    <div>
      <img [src]="icon" alt="loading">
    </div>
  `,
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  readonly icon: string;
  constructor() {
    this.icon = `assets/loading/${icons[random(icons.length)]}.svg`;
  }
}
