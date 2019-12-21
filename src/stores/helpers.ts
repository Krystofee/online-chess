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

export const invertY = (coord: BoardCoord) => ({
  ...coord,
  y: commonStore.size - coord.y - commonStore.pieceSize,
});

export const findMove = (moves: Move[], coord: Coord) =>
  moves.find((item) => item.position.x === coord.x && item.position.y === coord.y);

export const generateOffsetMoves = (piece: IPiece, allPieces: IPiece[], offsets: Coord[], repeat: boolean) => {
  const moves: Move[] = [];

  offsets.forEach(({ x: dx, y: dy }) => {
    let x = piece.position.x;
    let y = piece.position.y;
    let encounteredPiece: IPiece | undefined;

    const findPiece = (item: IPiece) => item.position.x === x && item.position.y === y;

    while (x >= 1 && x <= 8 && y >= 1 && y <= 8 && !encounteredPiece) {
      x += dx;
      y += dy;
      encounteredPiece = allPieces.find(findPiece);
      if (!encounteredPiece) {
        moves.push({
          piece,
          position: { x, y },
        });
      }

      if (!repeat) break;
    }

    if (encounteredPiece && encounteredPiece.color !== piece.color) {
      moves.push({
        piece,
        position: { x, y },
        takes: encounteredPiece,
      });
    }
  });

  return moves;
};

export const generateDiagonalMoves = (piece: IPiece, allPieces: IPiece[], repeat = true) =>
  generateOffsetMoves(
    piece,
    allPieces,
    [
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
    ],
    repeat,
  );

export const generateStraightMoves = (piece: IPiece, allPieces: IPiece[], repeat = true) =>
  generateOffsetMoves(
    piece,
    allPieces,
    [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ],
    repeat,
  );

export const getWebsocketMessage = (action: ClientAction, data: object) => {
  return JSON.stringify([action, data]);
};

export const getInverseColor = (color: PieceColor) => (color === 'W' ? 'B' : 'W');
