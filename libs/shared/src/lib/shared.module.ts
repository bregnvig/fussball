import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PlayerApiModule } from '@fussball/api';
import { LoginComponent } from './component';
import { CardPageComponent } from './component/card-page/card-page.component';
import { HasRoleDirective } from './component/has-role.directive';
import { LoadingComponent } from './component/loading/loading.component';
import { PageComponent } from './component/page/page.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { SidenavButtonComponent } from './component/sidebar/sidenav-button/sidenav-button.component';
import { RelativeToNowPipe } from './pipe/relative-to-now.pipe';

const materialModules = [
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSlideToggleModule
];

const exportComponents = [
  LoginComponent,
  LoadingComponent,
  PageComponent,
  CardPageComponent,
  SidebarComponent,
];

const pipes = [
  RelativeToNowPipe,
];

@NgModule({
  declarations: [
    exportComponents,
    pipes,
    SidenavButtonComponent,
    HasRoleDirective,
  ],
  exports: [
    exportComponents,
    pipes,
    HasRoleDirective,
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    PlayerApiModule,
    materialModules
  ],
})
export class SharedModule {
}

