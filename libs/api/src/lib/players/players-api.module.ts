import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FirebaseModule } from '@fussball/firebase';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { PlayersEffects } from "./+state/players.effects";
import { PlayersFacade } from "./+state/players.facade";
import * as fromPlayers from "./+state/players.reducer";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromPlayers.PLAYERS_FEATURE_KEY,
      fromPlayers.reducer
    ),
    EffectsModule.forFeature([PlayersEffects]),
    FirebaseModule,
  ],
  providers: [PlayersFacade, PlayersEffects]
})
export class PlayersApiModule { }
