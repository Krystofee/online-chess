import { computed, action, observable } from 'mobx';
import { uuid } from 'uuidv4';
import { toBoardCoord, findMove } from '../helpers';

class BasePiece implements IPiece {
  id: string;
  game: IChessGameStore;

  @observable position: Coord;
  @observable type: PieceType;
  @observable color: PieceColor;
  @observable moveCount = 0;

  constructor(gameStore: IChessGameStore, type: PieceType, color: PieceColor, position: Coord) {
    this.id = uuid();
    this.game = gameStore;
    this.type = type;
    this.color = color;
    this.position = position;
  }

  @computed get renderPosition() {
    return toBoardCoord(this.position);
  }

  @action move = (coord: Coord) => {
    const possibleMoves = this.possibleMoves;
    const move = findMove(possibleMoves, coord);
    if (this.position !== coord && move) {
      this.position = coord;
      this.moveCount += 1;
      return move;
    }
    return null;
  };

  // eslint-disable-next-line class-methods-use-this
  @computed get possibleMoves() {
    return [] as Move[];
  }

  @computed get hasMoved() {
    return this.moveCount > 0;
  }
}

export default BasePiece;
