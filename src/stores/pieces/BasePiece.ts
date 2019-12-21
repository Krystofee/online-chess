import Konva from 'konva';
import { computed, action, observable } from 'mobx';
import { uuid } from 'uuidv4';
import { toBoardCoord, findMove, invertY } from '../helpers';

class BasePiece implements IPiece {
  id: string;
  imageRef: Konva.Image | null = null;
  board: IChessBoard;

  @observable position: Coord;
  @observable type: PieceType;
  @observable color: PieceColor;
  @observable moveCount = 0;

  constructor(board: IChessBoard, type: PieceType, color: PieceColor, position: Coord) {
    this.id = uuid();
    this.board = board;
    this.type = type;
    this.color = color;
    this.position = position;
  }

  @computed get renderPosition() {
    return this.board.invert ? invertY(toBoardCoord(this.position)) : toBoardCoord(this.position);
  }

  @action move: (coord: Coord, force?: boolean) => Move | null = (coord: Coord, force = false) => {
    const possibleMoves = this.possibleMoves;
    const move: Move | undefined = force ? { piece: this, position: coord } : findMove(possibleMoves, coord);

    console.log('moving', this, move);

    let result: null | Move = null;
    if (this.position !== coord && move) {
      this.position = coord;
      this.moveCount += 1;
      result = move;
    }

    this.render();

    return result;
  };

  @action render = () => {
    if (this.imageRef) {
      this.imageRef.to({
        ...this.renderPosition,
        duration: 0.1,
      });
    }
  };

  @computed get possibleMoves() {
    // const moves = [];
    const generatedMoves = this.generatePossibleMoves().filter(
      (move) => move.position.x >= 1 && move.position.x <= 8 && move.position.y >= 1 && move.position.y <= 8,
    );
    return generatedMoves;
  }

  generatePossibleMoves = () => {
    return [] as Move[];
  };

  @computed get hasMoved() {
    return this.moveCount > 0;
  }
}

export default BasePiece;
