import { Bid } from "../lib/model";

export const bids: Bid[] = [
  {
    polePositionTime: 72123,
    podium: [ 'bottas', 'max_verstappen', 'hamilton' ],
    selectedDriver: { grid: 1, finish: 6 },
    fastestDriver: [ 'max_verstappen' ],
    player: {
      uid: 'admin-uid',
      photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mCwyqRN_i2j54Bx-vSEvBgDbEA5O20pHtpf_7qBQk8',
      email: 'flemming@bregnvig.dk',
      displayName: 'Flemming Bregnvig'
    },
    qualify: [
      'grosjean',
      'bottas',
      'kevin_magnussen',
      'albon',
      'norris',
      'russell'
    ],
    firstCrash: [ 'grojean' ]
  },
  {
    firstCrash: [ 'albon' ],
    polePositionTime: 71111,
    podium: [ 'leclerc', 'vettel', 'max_verstappen' ],
    selectedDriver: { finish: 2, grid: 2 },
    fastestDriver: [ 'vettel' ],
    player: {
      email: 'michael.bartrup@gmail.com',
      displayName: 'Michael Bartrup',
      uid: 'player-uid',
      photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mBvw300XDtDrnheUmG5TjELjs4ldQKADf15MCQtLg'
    },
    qualify: [
      'bottas',
      'leclerc',
      'vettel',
      'max_verstappen',
      'albon',
      'hamilton'
    ]
  },
  {
    firstCrash: [ 'no-points-1' ],
    polePositionTime: 71111,
    podium: ['no-points-1', 'no-points-2', 'no-points-3' ],
    selectedDriver: { finish: 20, grid: 20 },
    fastestDriver: [ 'no-points-1' ],
    player: {
      email: 'michael.bartrup@gmail.com',
      displayName: 'Michael Bartrup',
      uid: 'player1-uid',
      photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mBvw300XDtDrnheUmG5TjELjs4ldQKADf15MCQtLg'
    },
    qualify: [
      'no-points-1',
      'no-points-2',
      'no-points-3',
      'no-points-4',
      'no-points-5',
      'no-points-6'
    ]
  }
]
