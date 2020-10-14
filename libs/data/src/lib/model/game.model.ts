import { DateTime } from 'luxon';
export type Position = 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence';
export type GameState = 'completed' | 'cancelled' | 'ongoing' | 'preparing';
export type Team = 'team1' | 'team2';

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
  team1: number;
  team2: number;
  goals: Goal[];
}

export interface Game {
  team1: [string, string];
  team2: [string, string];
  latestPosition: PlayerPosition;
  numberOfMatches: number;
  state: GameState;
  matches: Match[];
}