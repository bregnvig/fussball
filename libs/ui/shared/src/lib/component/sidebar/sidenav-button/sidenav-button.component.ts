import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fuss-sidenav-button',
  template: `
    <button mat-list-item>
          <span fxLayout fxLayoutAlign="start center" fxLayoutGap="8px">
             <mat-icon [fontSet]="iconSet" [fontIcon]="icon" style="height: auto !important;"></mat-icon>  
             <ng-content></ng-content>
          </span>
    </button>`,
  styleUrls: ['./sidenav-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavButtonComponent {

  @Input() iconSet = 'fa';
  @Input() icon!: string;
  @Input() title?: string;

}
