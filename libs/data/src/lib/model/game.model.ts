import { DateTime } from 'luxon';
export type Position = 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence';
export function isPosition(value: any): value is Position {
  const positions: { [key in Position]: Required<boolean> } = { 'redDefence': true, 'redOffence': true, 'blueDefence': true, 'blueOffence': true };
  return Object.keys(positions).some(p => p === value);
};

export type GameState = 'completed' | 'cancelled' | 'ongoing' | 'preparing';
export type Team = 'red' | 'blue';

export interface Goal {
  uid: string;
  position: Position;
  time: DateTime;
  team: Team;
  ownGoal?: boolean;
}

export interface PlayerPosition {
  redDefence: string;
  redOffence: string;
  blueDefence: string;
  blueOffence: string;
}

export interface Match {
  red: number;
  blue: number;
  goals: Goal[];
}

export interface Game {
  latestPosition: PlayerPosition;
  numberOfMatches: number;
  state: GameState;
  matches: Match[];
}