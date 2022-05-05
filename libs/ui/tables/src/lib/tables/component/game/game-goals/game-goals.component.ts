import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Game, Goal, Match, Team } from '@fussball/data';

@Component({
  selector: 'fuss-game-goals',
  templateUrl: './game-goals.component.html',
  styleUrls: ['./game-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGoalsComponent {

  @Input() team1: Team;
  @Input() team2: Team;
  
  @Input() set game(value: Game) {
    this.matches = [...value.matches].reverse();
  }

  matches: Match[];
  
  trackByDate = (index: number, match: Match) => match.createdAt.toMillis();

  winningTeam(match: Match): string | null {
    if (match.goals.length >= 8) {
      const team1GoalFn = (goal: Goal) => this.team1.players.some(uid => goal.uid === uid) || (this.team2.players.some(uid => goal.uid === uid) && goal.ownGoal);
      const team1Goals = match.goals.reduce((acc, goal) => acc + (team1GoalFn(goal) ? 1 : 0), 0);
      const team2Goals = match.goals.length - team1Goals;
      return team1Goals === 8 ? this.team1.name : (team2Goals === 8 ? this.team2.name : null);
    }
    return null;
  }


}
