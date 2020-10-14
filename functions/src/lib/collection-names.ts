
export const tablesURL = 'tables';
export const tableURL = (uid: string) => `${tablesURL}/${uid}`;
export const playedURL = (uid: string) => `${tablesURL}/${uid}/played`;
export const playersURL = 'players';
export const playerURL = (uid: string): string => `${playersURL}/${uid}`;
