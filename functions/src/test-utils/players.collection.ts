export const players = {
  bookie: {
    roles: [ 'bookie' ],
    email: 'bookie@bookie.dk',
    balance: 40,
    uid: 'bookie-uid',
    displayName: 'F1 Bookie'
  },
  admin: {
    balance: 100,
    uid: 'admin-uid',
    displayName: 'Flemming',
    roles: [ 'admin', 'player', 'bank-admin' ],
    email: 'flemming@flemming.dk'
  },
  bankadmin: {
    balance: 100,
    uid: 'bankadmin-uid',
    displayName: 'Bank Admin',
    roles: [ 'bank-admin' ],
    email: 'flemming@flemming.dk'
  },
  player: {
    roles: [ 'player' ],
    email: 'michael@michael.dk',
    uid: 'player-uid',
    balance: 200,
    displayName: 'Michael'
  },
  player1: {
    roles: [ 'player' ],
    email: 'michael@michael.dk',
    uid: 'player1-uid',
    balance: 200,
    displayName: 'Michael'
  },
  player2: {
    roles: [ 'player' ],
    email: 'fie@bregnvig.dk',
    uid: 'player2-uid',
    balance: 200,
    displayName: 'Fie'
  }
};
