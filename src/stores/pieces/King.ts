import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class King extends BasePiece implements IPiece {
  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'K', color, position);
  }

  generatePossibleMoves: () => Move[] = () => {
    const moves = generateDiagonalMoves(this, this.board.pieces, false).concat(
      generateStraightMoves(this, this.board.pieces, false),
    );

    // castling
    if (!this.hasMoved) {
      // king side
      const HRook = this.board.pieces.find(
        (item) =>
          item.color === this.color &&
          item.type === 'R' &&
          item.moveCount === 0 &&
          item.position.y === this.position.y &&
          item.position.x === 8,
      );
      if (HRook) {
        const FPiece = this.board.pieces.find((item) => item.position.y === this.position.y && item.position.x === 6);
        const GPiece = this.board.pieces.find((item) => item.position.y === this.position.y && item.position.x === 7);
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
      const ARook = this.board.pieces.find(
        (item) =>
          item.color === this.color &&
          item.type === 'R' &&
          item.moveCount === 0 &&
          item.position.y === this.position.y &&
          item.position.x === 1,
      );
      if (ARook) {
        const BPiece = this.board.pieces.find((item) => item.position.y === this.position.y && item.position.x === 2);
        const CPiece = this.board.pieces.find((item) => item.position.y === this.position.y && item.position.x === 3);
        const DPiece = this.board.pieces.find((item) => item.position.y === this.position.y && item.position.x === 4);
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
