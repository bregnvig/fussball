import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Game, Goal, Match, Position, Team } from '@fussball/data';

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

  @Input() team1: Team;
  @Input() team2: Team;

  @Input() set game(value: Game) {
    this.matches = [...value.matches].reverse();
  }

  isRed(goal: Goal): boolean {
    return (['redDefence', 'redOffence'] as Position[]).some(p => p === goal.position) && !goal.ownGoal;
  }

  isBlue(goal: Goal): boolean {
    return !this.isRed(goal) && !goal.ownGoal;
  }

  winningTeam(match: Match): string | null {
    if (match.goals.length >= 8) {
      const team1GoalFn = (goal: Goal) => this.team1.players.some(uid => goal.uid === uid);
      const team1Goals = match.goals.reduce((acc, goal) => acc + (team1GoalFn(goal) ? 1 : 0), 0);
      const team2Goals = match.goals.length - team1Goals;
      return team1Goals === 8 ? this.team1.name : (team2Goals === 8 ? this.team2.name : null);
    }
    return null;
  }


}
