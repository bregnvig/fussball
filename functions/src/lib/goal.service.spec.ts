import { collections } from "../test-utils";
import { goal, ownGoal } from './goal.service';
import { Game } from "./model";

describe('Goal service test', () => {

  let game: Game;

  beforeEach(() => {
    game = { ...collections.games.noMatches };
  });

  it('should create a match, and add a goal', () => {
    const result = goal('redDefence', game);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].team1).toEqual(1);
    expect(result.matches[0].team2).toEqual(0);
    expect(result.matches[0].goals).toHaveLength(1);
    expect(result.matches[0].goals[0].ownGoal).toBeFalsy();
    expect(result.matches[0].goals[0].team).toBe('team1');
    expect(result.matches[0].goals[0].uid).toBe('team1Defence');
    expect(result.matches[0].goals[0].position).toBe('redDefence');
  });

  it('should create a new match, when the first is won', () => {
    const result = [...new Array(8)].reduce(acc => goal('redDefence', acc), game);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].team1).toEqual(8);
    expect(result.matches[0].team2).toEqual(0);
    expect(result.matches[0].goals).toHaveLength(8);
    expect(result.matches[1].team1).toEqual(0);
    expect(result.matches[1].team2).toEqual(0);
  });

  it('should complete a game, when enough is won', () => {
    let result: Game = [...new Array(8)].reduce(acc => goal('redDefence', acc), game);
    result = [...new Array(8)].reduce(acc => goal('blueOffence', acc), result);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].team1).toEqual(8);
    expect(result.matches[0].team2).toEqual(0);
    expect(result.matches[0].goals).toHaveLength(8);
    expect(result.matches[1].team1).toEqual(8);
    expect(result.matches[1].team2).toEqual(0);
    expect(result.matches[1].goals).toHaveLength(8);
    expect(result.state).toEqual('completed');
  });

  it('should handle more than 3 matches', () => {
    game.numberOfMatches = 5;
    let result: Game = [...new Array(8)].reduce(acc => goal('redDefence', acc), game);
    result = [...new Array(8)].reduce(acc => goal('blueOffence', acc), result);
    expect(result.matches).toHaveLength(3);
    expect(result.state).toEqual('ongoing');
    result = [...new Array(8)].reduce(acc => goal('redDefence', acc), result);
    expect(result.matches).toHaveLength(3);
    expect(result.state).toEqual('completed');
  });

  it('should different players', () => {
    let result = goal('redDefence', game);
    expect(result.matches[0].team1).toEqual(1);
    expect(result.matches[0].team2).toEqual(0);
    expect(result.matches[0].goals).toHaveLength(1);
    expect(result.matches[0].goals[0].ownGoal).toBeFalsy();
    expect(result.matches[0].goals[0].team).toBe('team1');
    expect(result.matches[0].goals[0].uid).toBe('team1Defence');
    expect(result.matches[0].goals[0].position).toBe('redDefence');
    result = goal('redOffence', result);
    expect(result.matches[0].team1).toEqual(2);
    expect(result.matches[0].team2).toEqual(0);
    expect(result.matches[0].goals).toHaveLength(2);
    expect(result.matches[0].goals[1].ownGoal).toBeFalsy();
    expect(result.matches[0].goals[1].team).toBe('team1');
    expect(result.matches[0].goals[1].uid).toBe('team1Offence');
    expect(result.matches[0].goals[1].position).toBe('redOffence');
    result = goal('blueOffence', result);
    expect(result.matches[0].team1).toEqual(2);
    expect(result.matches[0].team2).toEqual(1);
    expect(result.matches[0].goals).toHaveLength(3);
    expect(result.matches[0].goals[2].ownGoal).toBeFalsy();
    expect(result.matches[0].goals[2].team).toBe('team2');
    expect(result.matches[0].goals[2].uid).toBe('team2Offence');
    expect(result.matches[0].goals[2].position).toBe('blueOffence');
  });

  it('should change players position, when a match is complete', () => {
    expect(game.latestPosition.redDefence).toEqual('team1Defence');
    expect(game.latestPosition.redOffence).toEqual('team1Offence');
    const result = [...new Array(8)].reduce(acc => goal('redDefence', acc), game);
    expect(result.latestPosition.blueDefence).toEqual('team1Defence');
    expect(result.latestPosition.blueOffence).toEqual('team1Offence');
  });

  it('should register own goal as goal for other team', () => {
    expect(game.matches).toHaveLength(0);
    const result = ownGoal('redDefence', game);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].team1).toEqual(0);
    expect(result.matches[0].team2).toEqual(1);
  });
});