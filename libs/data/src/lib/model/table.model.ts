import { Game } from './game.model';

export interface TableQrCodes {
  redDefence: string;
  redOffence: string;
  blueDefence: string;
  blueOffence: string;
}

export interface Table {
  name: string;
  game: Game;
  qrCodes: TableQrCodes;
}