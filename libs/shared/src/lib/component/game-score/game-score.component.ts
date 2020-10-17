import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Goal, Match, Position } from '@fussball/data';


const goals = (goals: Goal[], teamsPositions: [Position, Position], otherPositions: [Position, Position]): number => (goals || []).reduce((acc, goal) => {
  return acc + ((teamsPositions.includes(goal.position) && !goal.ownGoal) || (otherPositions.includes(goal.position) && goal.ownGoal) ? 1 : 0);
}, 0);

@Component({
  selector: 'sha-game-score',
  template: '{{score}}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreComponent {

  @Input() side: 'red' | 'blue';
  @Input() match: Match;

  get score(): number {
    const teamsPositions: [Position, Position] = this.side === 'red' ? ['redDefence', 'redOffence'] : ['blueDefence', 'blueOffence'];
    const otherPositions: [Position, Position] = this.side === 'red' ? ['blueDefence', 'blueOffence'] : ['redDefence', 'redOffence'];
    return goals(this.match?.goals, teamsPositions, otherPositions);
  }

}
