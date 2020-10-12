import { SelectedDriverValue } from './model/bid.model';
import { offsetPoints, propertyPoints, calculateResult } from './result.service';
import { collections } from '../test-utils';
describe('Result service test', () => {

  it('should award points to qualify', () => {
    const result = ['grosjean', 'bottas', 'kevin_magnussen', 'albon', 'norris', 'russell', 'hamilton'];
    let bid = ['grosjean', 'bottas', 'kevin_magnussen', 'albon', 'norris', 'russell'];

    expect(offsetPoints(bid, result, 1)).toStrictEqual([2, 2, 2, 2, 2, 2]);

    bid = ['bottas', 'grosjean', 'kevin_magnussen', 'albon', 'norris', 'russell'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([1, 1, 2, 2, 2, 2]);

    bid = ['bottas', 'kevin_magnussen', 'grosjean', 'albon', 'norris', 'russell'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([1, 1, 0, 2, 2, 2]);

    bid = bid = ['russell', 'grosjean', 'bottas', 'kevin_magnussen', 'albon', 'norris'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([0, 1, 1, 1, 1, 1]);

    bid = bid = ['grosjean', 'bottas', 'kevin_magnussen', 'albon', 'norris', 'hamilton'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([2, 2, 2, 2, 2, 1]);

    bid = bid = ['kevin_magnussen', 'albon', 'norris', 'hamilton', 'grosjean', 'bottas'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([0, 0, 0, 0, 0, 0]);

  });

  it('should award points to podium', () => {
    const result = ['grosjean', 'bottas', 'kevin_magnussen', 'albon'];
    let bid = ['grosjean', 'bottas', 'kevin_magnussen'];

    expect(offsetPoints(bid, result, 1)).toStrictEqual([2, 2, 2]);

    bid = ['bottas', 'grosjean', 'kevin_magnussen'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([1, 1, 2]);

    bid = ['bottas', 'grosjean', 'albon'];
    expect(offsetPoints(bid, result, 1)).toStrictEqual([1, 1, 1]);
  });

  it('should award points to first crash', () => {
    let result = ['grosjean', 'bottas', 'kevin_magnussen'];
    const bid = ['grosjean'];

    expect(offsetPoints(bid, result, 2)).toStrictEqual([3]);

    result = ['bottas', 'kevin_magnussen', 'albon'];
    expect(offsetPoints(bid, result, 2)).toStrictEqual([0]);

    result = ['bottas', 'kevin_magnussen', 'grosjean'];
    expect(offsetPoints(bid, result, 2)).toStrictEqual([1]);

    result = ['kevin_magnussen', 'grosjean'];
    expect(offsetPoints(bid, result, 2)).toStrictEqual([2]);

    result = ['grosjean'];
    expect(offsetPoints(bid, result, 2)).toStrictEqual([3]);

    result = [];
    expect(offsetPoints(bid, result, 2)).toStrictEqual([0]);
  });

  it('should award points selected driver', () => {
    const result: SelectedDriverValue = { grid: 1, finish: 1 };
    let bid: SelectedDriverValue = { grid: 1, finish: 1 };

    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 3, finishPoints: 3 });

    bid = { grid: 2, finish: 1 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 2, finishPoints: 3 });
    bid = { grid: 2, finish: 2 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 2, finishPoints: 2 });
    bid = { grid: 3, finish: 2 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 1, finishPoints: 2 });
    bid = { grid: 3, finish: 3 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 1, finishPoints: 1 });
    bid = { grid: 4, finish: 3 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 0, finishPoints: 1 });
    bid = { grid: 4, finish: 13 };
    expect(propertyPoints(bid, result)).toStrictEqual({ gridPoints: 0, finishPoints: 0 });
  })

  it('should calculate the result of Flemmings bid', () => {
    const bid = collections.bids[0];
    const result = collections.results[0];
    const calculatedResult = calculateResult(bid, result)

    expect(calculatedResult.points).toBe(12 + 2 + 6 + 3 + 3 + 3);

    expect(calculatedResult.qualifyPoints).toStrictEqual([2, 2, 2, 2, 2, 2])
    expect(calculatedResult.fastestDriverPoints).toStrictEqual([2])
    expect(calculatedResult.podiumPoints).toStrictEqual([2, 2, 2])
    expect(calculatedResult.selectedDriver.gridPoints).toStrictEqual(3)
    expect(calculatedResult.selectedDriver.finishPoints).toStrictEqual(3)
    expect(calculatedResult.firstCrashPoints).toStrictEqual([3])
    expect(calculatedResult.polePositionTimeDiff).toStrictEqual(100)
  })

  it('should calculate the result of Michaels bid', () => {
    const bid = collections.bids[1];
    const result = collections.results[0];
    const calculatedResult = calculateResult(bid, result)

    expect(calculatedResult.points).toBe(3 + 0 + 1 + 2 + 0 + 1);

    expect(calculatedResult.qualifyPoints).toStrictEqual([1, 0, 0, 0, 1, 1])
    expect(calculatedResult.fastestDriverPoints).toStrictEqual([0])
    expect(calculatedResult.podiumPoints).toStrictEqual([0, 0, 1])
    expect(calculatedResult.selectedDriver.gridPoints).toStrictEqual(2)
    expect(calculatedResult.selectedDriver.finishPoints).toStrictEqual(0)
    expect(calculatedResult.firstCrashPoints).toStrictEqual([1])
    expect(calculatedResult.polePositionTimeDiff).toStrictEqual(1112);
  })

});
