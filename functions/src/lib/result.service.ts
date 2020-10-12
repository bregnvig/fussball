import { Bid, SelectedDriverValue, SelectedTeamValue } from "./model";

// tslint:disable:next-line
const sumPoints = (acc: number, points: number): number => acc + points;

/**
 * This rules award you point base on offset in the array.
 * 
 */
export const offsetPoints = (bid: string[], result: string[], maxOffset: number): number[] => {
  return bid.map((driver, index) => {
    const resultIndex = result.indexOf(driver);
    return resultIndex === -1 ? 0 : Math.max((maxOffset + 1) - (Math.abs(index - resultIndex)), 0);
  })
}

export type PropertySet = { [key: string]: number };
export const propertyPoints = (bid: any, result: any, maxPoints = 3): PropertySet => {
  return Object.keys(bid).reduce((acc, key) => {
    acc[key + 'Points'] = Math.max(maxPoints - Math.abs(bid[key] - result[key]), 0) || 0;
    return acc;
  }, <PropertySet>{});
}

export const calculateResult = (bid: Bid, result: Bid): Bid => {
  const calculatedResult: Bid = {...bid};
  calculatedResult.qualifyPoints = offsetPoints(bid.qualify as string[], result.qualify as string[], 1) as [number, number, number, number, number, number];
  calculatedResult.fastestDriverPoints = offsetPoints(bid.fastestDriver as string[], result.fastestDriver as string[], 1) as [number];
  calculatedResult.podiumPoints = offsetPoints(bid.podium as string[], result.podium as string[], 1) as [number, number, number];
  calculatedResult.firstCrashPoints = offsetPoints(bid.firstCrash as string[], (result.firstCrash || []) as string[], 2) as [number];
  calculatedResult.selectedDriver = {...bid.selectedDriver, ...propertyPoints(bid.selectedDriver, result.selectedDriver, 3)} as SelectedDriverValue;
  calculatedResult.polePositionTimeDiff = Math.abs(bid.polePositionTime - result.polePositionTime);
  if (bid.selectedTeam) {
    const qualifyPoints = bid.selectedTeam.qualify === result.selectedTeam?.qualify ? 1 : 0;
    const resultPoints = bid.selectedTeam.result === result.selectedTeam?.result ? 1 : 0;
    calculatedResult.selectedTeam = { ...bid.selectedTeam, qualifyPoints, resultPoints} as SelectedTeamValue;
  }

  calculatedResult.points = calculatedResult.qualifyPoints.reduce(sumPoints, 0) 
    + calculatedResult.fastestDriverPoints.reduce(sumPoints, 0) 
    + calculatedResult.podiumPoints.reduce(sumPoints, 0)
    + calculatedResult.selectedDriver.gridPoints!
    + calculatedResult.selectedDriver.finishPoints!
    + calculatedResult.firstCrashPoints.reduce(sumPoints, 0)
    + (calculatedResult.selectedTeam?.qualifyPoints ?? 0)
    + (calculatedResult.selectedTeam?.resultPoints ?? 0)


  return calculatedResult;
}

export const calculateInterimResult = (bid: Partial<Bid>, result: Partial<Bid>): Partial<Bid> => {
  const calculatedResult: Partial<Bid> = {...bid};
  calculatedResult.qualifyPoints = offsetPoints(bid.qualify as string[], result.qualify as string[], 1) as [number, number, number, number, number, number];
  calculatedResult.selectedDriver = {...bid.selectedDriver, ...propertyPoints(bid.selectedDriver, result.selectedDriver, 3)} as SelectedDriverValue;
  const qualifyPoints = bid.selectedTeam!.qualify === result.selectedTeam?.qualify ? 1 : 0;
  calculatedResult.selectedTeam = { ...bid.selectedTeam, qualifyPoints} as SelectedTeamValue;

  calculatedResult.points = calculatedResult.qualifyPoints.reduce(sumPoints, 0) 
    + calculatedResult.selectedDriver.gridPoints!
    + (calculatedResult.selectedTeam?.qualifyPoints ?? 0)

  return calculatedResult;
}
