import { computed, action, observable } from 'mobx';
import { uuid } from 'uuidv4';
import { toBoardCoord, includesCoord } from '../helpers';

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
    if (this.position !== coord && includesCoord(this.possibleMoves, coord)) {
      console.log('move', coord);
      this.position = coord;
      this.moveCount += 1;
      return true;
    }
    return false;
  };

  @computed get possibleMoves() {
    console.log(this.game.piecesArray);
    return [
      {
        x: 3,
        y: 3,
      },
      {
        x: 4,
        y: 4,
      },
    ];
  }

  @computed get hasMoved() {
    return this.moveCount > 0;
  }
}

export default BasePiece;
