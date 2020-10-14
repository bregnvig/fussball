export type Role = 'player' | 'admin' | 'viewer' | 'anonymous';

export interface Player {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  roles?: Role[];
  tokens?: string[];
  stat?: PlayerStat;
}

export interface PlayerStat {
  won: number;
  lost: number;
  goals: number;
  ownGoals: number;
}