import { DateTime } from 'luxon';
export type Position = 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence';
export type GameState = 'completed' | 'cancelled' | 'ongoing' | 'preparing';
export interface Goal {
  uid: string;
  position: Position;
  time: DateTime;
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