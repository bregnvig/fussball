import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@fussball/shared';

const exported = [
];

const components = [

];

const pipes = [
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    SharedModule,
    FlexModule,
  ],
  declarations: [exported, components, pipes],
  exports: [exported, pipes],
})
export class ControlModule {
}
