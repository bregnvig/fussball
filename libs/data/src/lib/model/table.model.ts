import { Game } from './game.model';

export const TABLES_COLLECITON = 'tables';

export interface TableQrCodes {
  redDefence: string;
  redOffence: string;
  blueDefence: string;
  blueOffence: string;
}

export interface Table {
  id: string;
  name: string;
  game: Game;
  qrCodes: TableQrCodes;
}