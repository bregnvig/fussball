import { Component } from '@angular/core';

@Component({
  selector: 'sha-card-page',
  template: `
    <div class="max-width" fxLayout="row" fxLayoutAlign="center stretch">
      <div fxFlex="90" fxLayout="column" style="margin-top: 16px">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card-page.component.scss'],
})
export class CardPageComponent {

}
