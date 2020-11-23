import { DateTime } from 'luxon';
import { Player } from './player.model';
import { Team } from './team.model';

export type Position = 'redDefence' | 'redOffence' | 'blueDefence' | 'blueOffence';
export const allPositions: Position[] = Object.keys(<{ [key in Position]: Required<boolean> }>{ 'redDefence': true, 'redOffence': true, 'blueDefence': true, 'blueOffence': true }) as Position[];

export function isPosition(value: any): value is Position {
  return allPositions.some(p => p === value);
};

export type GameState = 'completed' | 'cancelled' | 'ongoing' | 'preparing';
export type TeamPosition = 'team1' | 'team2';

export interface Goal {
  uid: string;
  position: Position;
  time: DateTime;
  team: TeamPosition;
  ownGoal?: boolean;
}

export type PlayerPosition = Partial<{ [K in Position]: string }>;

export interface Match {
  team1: number;
  team2: number;
  goals: Goal[];
  createdAt: DateTime;
}

export type GamePlayer = Pick<Player, 'displayName' | 'photoURL'>;
export type GamePlayers = Record<string, GamePlayer>;

export interface Game {
  team1: Team;
  team2: Team;
  latestPosition: PlayerPosition;
  numberOfMatches: number;
  createdAt: DateTime,
  state: GameState;
  matches: Match[];
  players: GamePlayers;
}