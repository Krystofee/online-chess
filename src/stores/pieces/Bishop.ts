import { computed } from 'mobx';
import BasePiece from './BasePiece';

class Bishop extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'B', color, position);
  }

  @computed get possibleMoves() {
    const moves: Move[] = [];

    [
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
    ].forEach(({ x: dx, y: dy }) => {
      let x = this.position.x;
      let y = this.position.y;
      let encounteredPiece: IPiece | undefined;

      const findPiece = (item: IPiece) => item.position.x === x && item.position.y === y;

      while (x >= 1 && x <= 8 && y >= 1 && y <= 8 && !encounteredPiece) {
        x += dx;
        y += dy;
        encounteredPiece = this.game.pieces.find(findPiece);
        if (!encounteredPiece) {
          moves.push({
            position: { x, y },
          });
        }
      }

      if (encounteredPiece && encounteredPiece.color !== this.color) {
        moves.push({
          position: { x, y },
          takes: encounteredPiece,
        });
      }
    });

    console.log(moves);

    return moves;
  }
}

export default Bishop;
