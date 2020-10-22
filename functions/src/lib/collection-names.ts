import { TABLES_COLLECTION, TEAMS_COLLECTION } from "./model";

export const tableURL = (uid: string) => `${TABLES_COLLECTION}/${uid}`;
export const playedURL = (uid: string) => `${TABLES_COLLECTION}/${uid}/played`;
export const playersURL = 'players';
export const teamURL = (team: string) => `${TEAMS_COLLECTION}/${team}`;
export const playerURL = (uid: string): string => `${playersURL}/${uid}`;
