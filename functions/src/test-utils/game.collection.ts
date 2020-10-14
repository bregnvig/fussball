import { Game } from "../lib/model";

export const games = {
  noMatches: {
    numberOfMatches: 3,
    state: 'ongoing',
    team1: ['team1Defence', 'team1Offence'],
    team2: ['team2Defence', 'team2Offence'],
    latestPosition: {
      redDefence: 'team1Defence',
      redOffence: 'team1Offence',
      blueDefence: 'team2Defence',
      blueOffence: 'team2Offence'
    },
    matches: []
  } as Game
};

