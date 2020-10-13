export type Role = 'player' | 'admin' | 'viewer' | 'anonymous';

export interface Player {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  roles?: Role[];
  tokens?: string[];
}
