import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from "@angular/router";
import { ControlModule } from '@fussball/control';
import { SharedModule } from '@fussball/shared';
import { WhatElseComponent } from './component/card/what-else/what-else.component';
import { LandingComponent } from './component/landing/landing.component';

const MatModules = [
  MatCardModule,
  MatButtonModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MatModules,
    ControlModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingComponent
      }
    ]),
  ],
  declarations: [
    LandingComponent,
    WhatElseComponent
  ],
})
export class LandingModule { }
