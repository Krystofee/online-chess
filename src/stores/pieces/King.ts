import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class King extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'K', color, position);
  }

  generatePossibleMoves = () => {
    const moves = generateDiagonalMoves(this, this.game.board.pieces, false).concat(
      generateStraightMoves(this, this.game.board.pieces, false),
    );

    // castling
    if (!this.hasMoved) {
      // king side
      const HRook = this.game.board.pieces.find(
        (item) =>
          item.color === this.color &&
          item.type === 'R' &&
          item.moveCount === 0 &&
          item.position.y === this.position.y &&
          item.position.x === 8,
      );
      if (HRook) {
        const FPiece = this.game.board.pieces.find(
          (item) => item.position.y === this.position.y && item.position.x === 6,
        );
        const GPiece = this.game.board.pieces.find(
          (item) => item.position.y === this.position.y && item.position.x === 7,
        );
        if (!FPiece && !GPiece) {
          moves.push({
            piece: this,
            position: { x: 7, y: this.position.y },
            nested: {
              piece: HRook,
              position: {
                x: 6,
                y: this.position.y,
              },
            },
          });
        }
      }

      // queen side
      const ARook = this.game.board.pieces.find(
        (item) =>
          item.color === this.color &&
          item.type === 'R' &&
          item.moveCount === 0 &&
          item.position.y === this.position.y &&
          item.position.x === 1,
      );
      if (ARook) {
        const BPiece = this.game.board.pieces.find(
          (item) => item.position.y === this.position.y && item.position.x === 2,
        );
        const CPiece = this.game.board.pieces.find(
          (item) => item.position.y === this.position.y && item.position.x === 3,
        );
        const DPiece = this.game.board.pieces.find(
          (item) => item.position.y === this.position.y && item.position.x === 4,
        );
        if (!BPiece && !CPiece && !DPiece) {
          moves.push({
            piece: this,
            position: { x: 3, y: this.position.y },
            nested: {
              piece: ARook,
              position: {
                x: 4,
                y: this.position.y,
              },
            },
          });
        }
      }
    }

    return moves;
  };
}

export default King;
