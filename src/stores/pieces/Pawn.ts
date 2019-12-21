import { observable } from 'mobx';
import BasePiece from './BasePiece';

class Pawn extends BasePiece implements IPiece {
  @observable direction: number;

  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'P', color, position);
    this.direction = color === 'B' ? -1 : 1;
  }

  generatePossibleMoves = () => {
    const moves: Move[] = [];
    const take_y = this.position.y + 1 * this.direction;

    if (
      !this.board.pieces.find(
        (item) => item.color !== this.color && item.position.x === this.position.x && item.position.y === take_y,
      )
    ) {
      moves.push({ piece: this, position: { x: 0, y: 1 } });
    }

    if (
      !this.hasMoved &&
      !this.board.pieces.find(
        (item) =>
          item.color !== this.color &&
          item.position.x === this.position.x &&
          item.position.y === take_y + 1 * this.direction,
      )
    ) {
      moves.push({ piece: this, position: { x: 0, y: 2 } });
    }

    // take
    const leftPiece = this.board.pieces.find(
      (item) => item.color !== this.color && item.position.x === this.position.x + 1 && item.position.y === take_y,
    );
    if (leftPiece) {
      moves.push({ piece: this, position: { x: 1, y: 1 }, takes: leftPiece });
    }

    // take
    const rightPiece = this.board.pieces.find(
      (item) => item.color !== this.color && item.position.x === this.position.x - 1 && item.position.y === take_y,
    );
    if (rightPiece) {
      moves.push({ piece: this, position: { x: -1, y: 1 }, takes: rightPiece });
    }

    // en passant
    const enPassantY = this.color === 'W' ? 5 : 4;
    if (this.position.y === enPassantY) {
      this.board.pieces
        .filter(
          (item) =>
            item.moveCount === 1 &&
            item.type === 'P' &&
            item.color !== this.color &&
            item.position.y === this.position.y &&
            (item.position.x === this.position.x + 1 || item.position.x === this.position.x - 1),
        )
        .forEach((piece) => {
          moves.push({
            piece: this,
            position: { x: piece.position.x - this.position.x, y: 1 },
            takes: piece,
          });
        });
    }

    return moves.map(({ position: { x, y }, takes, piece }) => ({
      piece,
      takes,
      position: { x: this.position.x + x, y: this.position.y + y * this.direction },
    }));
  };
}

export default Pawn;
