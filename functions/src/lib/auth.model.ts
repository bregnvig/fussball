import { Player, Role } from './model'

export class PlayerImpl implements Player  {

  readonly uid: string;
  readonly displayName: string;
  readonly photoURL: string;
  readonly email: string;
  roles: Role[];
  balance: number;

  constructor({uid,
    displayName,
    photoURL,
    email,
    roles,
    balance}: Player) {
      this.uid =uid;
      this.displayName = displayName;
      this.photoURL =  photoURL;
      this.email =  email;
      this.roles = [...roles || []];
      this.balance = balance || 0;
  }

  isInRole(...role: Role[]): boolean {
    const requiredRoles = Array.isArray(role) ? role : [role];
    return this.roles.some(r => requiredRoles.some(rr => rr === r));
  }
}
