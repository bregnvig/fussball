export const transactions = { 
  ts1: {
    amount: 20,
    date: '18 March 2019 at 16:46:11 UTC+1',
    from: 'player-uid',
    involved: [ 'player-uid', 'bookie-uid' ],
    message: 'Deltagelse i Monaco',
    to: 'bookie-uid'
  },
  ts2: {
    amount: 100,
    date: '19 March 2019 at 16:46:11 UTC+1',
    from: 'bookie-uid',
    involved: [ 'player-uid', 'bookie-uid' ],
    message: 'Vunndet Monaco',
    to: 'player-uid'
  },
  ts3: {
    amount: 100,
    date: '20 March 2019 at 16:46:11 UTC+1',
    from: 'bankadmin-uid',
    involved: [ 'player-uid', 'bankadmin-uid' ],
    message: 'Indsat',
    to: 'player-uid'
  },
  ts4: {
    amount: 100,
    date: '21 March 2019 at 16:46:11 UTC+1',
    from: 'bookie-uid',
    involved: [ 'bankadmin-uid', 'bookie-uid' ],
    message: 'Hævet',
    to: 'bankadmin-uid'
  }
};
