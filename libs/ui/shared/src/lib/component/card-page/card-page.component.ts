import { Component, Input } from '@angular/core';

@Component({
  selector: 'fuss-card-page',
  template: `
    <div [ngClass]="widthClass" fxLayout="row" fxLayoutAlign="center stretch">
      <div fxFlex="90" fxLayout="column" style="margin-top: 16px">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card-page.component.scss'],
})
export class CardPageComponent {
  @Input() widthClass = 'max-width';

}
