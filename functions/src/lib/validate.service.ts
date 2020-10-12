import { SelectedTeamValue } from './model/bid.model';
import { Bid, IRace, ITeam, logAndCreateError } from ".";


const noNullsInArrayFn = (array: (string | null)[]): boolean => array.every(Boolean);
const uniqueDriversFn = (array: (string | null)[]): boolean => array.length === new Set(array).size;
const validArraysFn = (array: (string | null)[]): boolean => noNullsInArrayFn(array) && uniqueDriversFn(array);
const validTeamFn = (team: ITeam | undefined, selected?: SelectedTeamValue): boolean => {
  if (!team) {
    return true;
  }
  return team.drivers.some(d => d === selected?.qualify) && team.drivers.some(d => d === selected?.result);
};

export const validateBid = (bid: Bid, race: IRace): void => {
  const lengths = {
    podium: 3,
    qualify: 6,
    fastestDriver: 1,
    firstCrash: 1,
  } as { [key: string]: number; };
  const validArrays: boolean = Object.values(bid).filter(v => Array.isArray(v)).map(validArraysFn).every(Boolean) && Object.keys(lengths).every(key => lengths[key] === (bid as any)[key].length);
  const validPole: boolean = !!(bid.polePositionTime && (bid.polePositionTime < (1000 * 60 * 2)) && (bid.polePositionTime > (1000 * 60)));
  const validSelected: boolean = !!(bid.selectedDriver && bid.selectedDriver.grid && bid.selectedDriver.grid > 0 && bid.selectedDriver.grid <= race.drivers!.length
    && bid.selectedDriver.finish && bid.selectedDriver.finish > 0 && bid.selectedDriver.finish <= race.drivers!.length);
  const validTeam = validTeamFn(race.selectedTeam, bid.selectedTeam);

  if (![validArrays, validPole, validSelected, validTeam].every(Boolean)) {
    throw logAndCreateError('failed-precondition', `Bid not valid. Arrays: ${validArrays}, valid selected: ${validSelected}, valid pole: ${validPole}, team: ${validTeam}`);
  }
};

export const validateResult = (result: Bid, race: IRace): void => {
  const lengths = {
    podium: 4,
    qualify: 7,
    fastestDriver: 2,
  } as { [key: string]: number; };

  if (!result) {
    throw logAndCreateError('failed-precondition', 'No result specified');
  }

  const validArrays: boolean = Object.values(result).filter(v => Array.isArray(v)).map(validArraysFn).every(Boolean) && Object.keys(lengths).every(key => lengths[key] === undefined || (lengths[key] === (result as any)[key].length));
  const validPole: boolean = !!(result.polePositionTime && (result.polePositionTime < (1000 * 60 * 2)) && (result.polePositionTime > (1000 * 60)));
  const validSelected: boolean = !!(result.selectedDriver && result.selectedDriver.grid && result.selectedDriver.grid > 0 && result.selectedDriver.grid <= race.drivers!.length
    && result.selectedDriver.finish && result.selectedDriver.finish > 0 && result.selectedDriver.finish <= race.drivers!.length);
  const validTeam = validTeamFn(race.selectedTeam, result.selectedTeam);
  if (![validArrays, validPole, validSelected, validTeam].every(Boolean)) {
    throw logAndCreateError('failed-precondition', `Result not valid. Arrays: ${validArrays}, valid selected: ${validSelected}, valid pole: ${validPole}, valid team: ${validTeam}`);
  }

};

export const validateInterimResult = (result: Partial<Bid>, race: IRace): void => {

  if (!result) {
    throw logAndCreateError('failed-precondition', 'No interim result specified');
  }

  const validQualify: boolean = validArraysFn(result.qualify as string[]) && result.qualify?.length === 7  ;
  const validSelected: boolean = !!(result.selectedDriver && result.selectedDriver.grid && result.selectedDriver.grid > 0 && result.selectedDriver.grid <= race.drivers!.length);
  const validTeam = race.selectedTeam!.drivers.some(d => d === result.selectedTeam?.qualify);
  if (![validQualify, validSelected, validTeam].every(Boolean)) {
    throw logAndCreateError('failed-precondition', `Interim result not valid. Qualify: ${validQualify}, valid selected: ${validSelected}, valid team: ${validTeam}`);
  }

};
