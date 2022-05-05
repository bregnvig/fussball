import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Goal, Match, Position, Team } from '@fussball/data';

@Component({
  selector: 'fuss-match-goals',
  templateUrl: './match-goals.component.html',
  styleUrls: ['./match-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchGoalsComponent {

  @Input() team1: Team;
  @Input() team2: Team;
  @Input() set match(value: Match) {
    this.goals = [...(value?.goals || [])].reverse();
  };
  goals: Goal[];
  displayedColumns = ['player', 'team', 'position'];

  trackByDate = (index: number, goal: Goal) => goal.time.toMillis();

  isRed(goal: Goal): boolean {
    return (['redDefence', 'redOffence'] as Position[]).some(p => p === goal.position) && !goal.ownGoal;
  }

  isBlue(goal: Goal): boolean {
    return !this.isRed(goal) && !goal.ownGoal;
  }
}
