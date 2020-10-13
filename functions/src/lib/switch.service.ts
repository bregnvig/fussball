import { PlayerPosition, Position } from "./model";

export const switchPosition = (position: Position, playerPosition: PlayerPosition): PlayerPosition => {
  if ((['redDefence', 'redOffence'] as Position[]).some(p => p === position)) {
    const redDefence = playerPosition.redOffence;
    const redOffence = playerPosition.redDefence;
    return { ...playerPosition, redDefence, redOffence };
  }
  const blueDefence = playerPosition.blueOffence;
  const blueOffence = playerPosition.blueDefence;
  return { ...playerPosition, blueDefence, blueOffence };
};