import { PlayerPosition } from './model/game.model';
import { switchPosition } from './switch.service';
describe('Switch service test', () => {

  let players: PlayerPosition;

  beforeEach(() => {
    players = {
      redDefence: 'red1',
      redOffence: 'red2',
      blueDefence: 'blue1',
      blueOffence: 'blue2'
    };
  });

  it('should switch red players', () => {
    const result = switchPosition('redDefence', players);
    expect(result.redDefence).toEqual('red2');
    expect(result.redOffence).toEqual('red1');
  });

  it('should switch blur players', () => {
    const result = switchPosition('blueDefence', players);
    expect(result.blueDefence).toEqual('blue2');
    expect(result.blueOffence).toEqual('blue1');
  });
});