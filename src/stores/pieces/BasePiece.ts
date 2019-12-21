import Konva from 'konva';
import { uuid } from 'uuidv4';
import { toBoardCoord, findMove, invertY } from '../helpers';

class BasePiece implements IPiece {
  id: string;
  imageRef: Konva.Image | null = null;
  board: IChessBoard;

  position: Coord;
  type: PieceType;
  color: PieceColor;
  moveCount = 0;

  constructor(board: IChessBoard, type: PieceType, color: PieceColor, position: Coord) {
    this.id = uuid();
    this.board = board;
    this.type = type;
    this.color = color;
    this.position = position;
  }

  get renderPosition() {
    return this.board.invert ? invertY(toBoardCoord(this.position)) : toBoardCoord(this.position);
  }

  move: (coord: Coord, force?: boolean) => Move | null = (coord: Coord, force = false) => {
    const possibleMoves = this.possibleMoves;
    const move: Move | undefined = force ? { piece: this, position: coord } : findMove(possibleMoves, coord);

    let result: null | Move = null;
    if (this.position !== coord && move) {
      this.position = coord;
      this.moveCount += 1;
      result = move;
    }

    this.render();

    return result;
  };

  render = () => {
    if (this.imageRef) {
      this.imageRef.to({
        ...this.renderPosition,
        duration: 0.1,
      });
    }
  };

  get possibleMoves() {
    const moves: Move[] = [];
    const generatedMoves = this.generatePossibleMoves().filter(
      (move) => move.position.x >= 1 && move.position.x <= 8 && move.position.y >= 1 && move.position.y <= 8,
    );

    const board = this.board.copy();

    generatedMoves.forEach((move) => {
      board.applyTemporaryMove(move);

      if (!board.inCheck(this.color)) {
        moves.push(move);
      }

      board.unapplyTemporaryMove();
    });

    return moves;
  }

  generatePossibleMoves = () => {
    return [] as Move[];
  };

  get hasMoved() {
    return this.moveCount > 0;
  }

  copy = (board: IChessBoard) => {
    const piece = new (this.constructor as any)(board, this.color, this.position) as IPiece;
    piece.id = this.id;
    piece.imageRef = null;
    return piece;
  };
}

export default BasePiece;
