import { Game, Position } from './game.model';

export const TABLES_COLLECTION = 'tables';

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

export interface JoinTableData {
  action: 'join';
  tableId: string;
  position: Position;
}
