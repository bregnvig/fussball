import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Game, Goal, Match, Position } from '@fussball/data';

@Component({
  selector: 'fussball-game-goals',
  templateUrl: './game-goals.component.html',
  styleUrls: ['./game-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGoalsComponent {

  trackByDate = (index: number, match: Match) => match.createdAt.toMillis();
  displayedColumns = ['player', 'team', 'position', 'time'];
  matches: Match[];
  trackByIndex = (index: number) => index;

  @Input() set game(value: Game) {
    this.matches = [...value.matches].reverse();
  }

  isRed(goal: Goal): boolean {
    return (['redDefence', 'redOffence'] as Position[]).some(p => p === goal.position);
  }

  isBlue(goal: Goal): boolean {
    return !this.isRed(goal);
  }



}
