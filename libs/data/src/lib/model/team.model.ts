export const TEAMS_COLLECTION = 'teams';
export const getTeamId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
}

export interface Team {
  id?: string;
  name?: string;
  players: string[];
}