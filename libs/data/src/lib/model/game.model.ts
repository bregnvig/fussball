import { DateTime } from 'luxon';
export type Position = 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence';
export function isPosition(value: any): value is Position {
  const positions: { [key in Position]: Required<boolean> } = { 'redDefence': true, 'redOffence': true, 'blueDefence': true, 'blueOffence': true };
  return Object.keys(positions).some(p => p === value);
};

export type GameState = 'completed' | 'cancelled' | 'ongoing' | 'preparing';
export type Team = 'team1' | 'team2';

export interface Goal {
  uid: string;
  position: Position;
  time: DateTime;
  team: Team;
  ownGoal?: boolean;
}

export type PlayerPosition = Partial<{[K in Position]: string}>;

export interface Match {
  team1: number;
  team2: number;
  goals: Goal[];
}

export interface Game {
  team1: string[];
  team2: string[];
  latestPosition: PlayerPosition;
  numberOfMatches: number;
  state: GameState;
  matches: Match[];
}