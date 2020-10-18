import { Game, Position } from './game.model';

export const TABLES_COLLECTION = 'tables';

export interface Table {
  id: string;
  name: string;
  game: Game;
}

export interface JoinTableData {
  action: 'join';
  tableId: string;
  position: Position;
}
