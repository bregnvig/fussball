import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerApiModule } from '@fussball/api';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LoginComponent } from './component';
import { CardPageComponent } from './component/card-page/card-page.component';
import { GamePlayersComponent } from './component/game-players/game-players.component';
import { GameScoreComponent } from './component/game-score/game-score.component';
import { GameTeamPlayersComponent } from './component/game-team-players/game-team-players.component';
import { LoadingComponent } from './component/loading/loading.component';
import { PageComponent } from './component/page/page.component';
import { QrScannerComponent } from './component/qr-scanner/qr-scanner.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { SidenavButtonComponent } from './component/sidebar/sidenav-button/sidenav-button.component';
import { HasRoleDirective } from "./directive";
import { DisplayNamePipe } from './pipe/display-name.pipe';
import { PhotoURLPipe } from './pipe/photo-url.pipe';
import { PositionPipe } from './pipe/position.pipe';
import { RelativeToNowPipe } from './pipe/relative-to-now.pipe';
import { TeamNamePipe } from './pipe/team-name.pipe';

const materialModules = [
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSlideToggleModule,
];

const exportComponents = [
  LoginComponent,
  LoadingComponent,
  PageComponent,
  CardPageComponent,
  SidebarComponent,
  QrScannerComponent,
  GamePlayersComponent,
  GameScoreComponent,
  GameTeamPlayersComponent,
];

const pipes = [
  RelativeToNowPipe,
  PhotoURLPipe,
  DisplayNamePipe,
  TeamNamePipe,
  PositionPipe,
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
    FlexLayoutModule,
    FontAwesomeModule,
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    PlayerApiModule,
    FlexLayoutModule,
    ZXingScannerModule,
    materialModules
  ],
})
export class SharedModule {
}

