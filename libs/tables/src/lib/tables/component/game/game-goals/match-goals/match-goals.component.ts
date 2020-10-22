import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Goal, Match, Position, Team } from '@fussball/data';

@Component({
  selector: 'fussball-match-goals',
  templateUrl: './match-goals.component.html',
  styleUrls: ['./match-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchGoalsComponent implements OnInit {

  @Input() team1: Team;
  @Input() team2: Team;
  @Input() match: Match;

  trackByIndex = (index: number) => index;
  displayedColumns = ['player', 'team', 'position', 'time'];

  constructor() { }

  ngOnInit(): void {
  }

  isRed(goal: Goal): boolean {
    return (['redDefence', 'redOffence'] as Position[]).some(p => p === goal.position) && !goal.ownGoal;
  }

  isBlue(goal: Goal): boolean {
    return !this.isRed(goal) && !goal.ownGoal;
  }
}
