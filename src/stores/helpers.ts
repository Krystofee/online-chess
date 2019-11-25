import commonStore from './commonStore';

export const toBoardCoord = (coord: Coord) =>
  ({
    x: (coord.x - 1) * commonStore.pieceSize,
    y: (coord.y - 1) * commonStore.pieceSize,
  } as BoardCoord);

export const fromBoardCoord = (coord: BoardCoord) =>
  ({
    x: Math.floor((coord.x + commonStore.pieceSize / 2) / commonStore.pieceSize) + 1,
    y: Math.floor((coord.y + commonStore.pieceSize / 2) / commonStore.pieceSize) + 1,
  } as Coord);

export const findMove = (moves: Move[], coord: Coord) =>
  moves.find((item) => item.position.x === coord.x && item.position.y === coord.y);
