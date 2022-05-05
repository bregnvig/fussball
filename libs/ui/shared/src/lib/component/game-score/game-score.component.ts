import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Goal, Match, Position } from '@fussball/data';


const goals = (teamsPositions: [Position, Position], otherPositions: [Position, Position], goals?: Goal[]): number => (goals || []).reduce((acc, goal) => {
  return acc + ((teamsPositions.includes(goal.position) && !goal.ownGoal) || (otherPositions.includes(goal.position) && goal.ownGoal) ? 1 : 0);
}, 0);

const positions: Record<'teams' |'other', Record<'red' |'blue', [Position, Position]>> = {
  teams: {
    red: ['redDefence', 'redOffence'],
    blue: ['blueDefence', 'blueOffence'],
  },
  other: {
    red: ['blueDefence', 'blueOffence'],
    blue: ['redDefence', 'redOffence'],
  },
}

@Component({
  selector: 'fuss-game-score',
  template: `{{score || ''}}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreComponent {

  @Input() side?: 'red' | 'blue';
  @Input() match?: Match | null;

  get score(): number | undefined {
    if(this.side) {
      return goals(positions.teams[this.side], positions.other[this.side], this.match?.goals)
    }
    return undefined;
  }

}
