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

  @Input() team1: [string?, string?];
  @Input() team2: [string?, string?];

  @Input() set game(value: Game) {
    this.matches = [...value.matches].reverse();
  }

  isRed(goal: Goal): boolean {
    return (['redDefence', 'redOffence'] as Position[]).some(p => p === goal.position);
  }

  isBlue(goal: Goal): boolean {
    return !this.isRed(goal);
  }

  winningTeam(match: Match): 'team1' | 'team2' | null {
    if (match.goals.length >= 8) {
      const team1GoalFn = (goal: Goal) => this.team1.some(uid => goal.uid === uid);
      const team1Goals = match.goals.reduce((acc, goal) => acc + (team1GoalFn(goal) ? 1 : 0), 0);
      const team2Goals = match.goals.length - team1Goals;
      return team1Goals === 8 ? 'team1' : (team2Goals === 8 ? 'team2' : null);
    }
    return null;
  }


}
