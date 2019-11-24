import { computed, action, observable } from 'mobx';
import { uuid } from 'uuidv4';
import { fromBoardCoord, toBoardCoord, includesCoord } from '../helpers';

class BasePiece implements IPiece {
  id: string;
  game: IChessGameStore;

  @observable position: Coord;
  @observable type: PieceType;
  @observable color: PieceColor;
  @observable hasMoved = false;

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
      this.hasMoved = true;
    }
  };

  @action moveBoardCoord = (boardCoord: Coord) => {
    this.move(fromBoardCoord(boardCoord));
  };

  @computed get possibleMoves() {
    console.log(this);
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
}

export default BasePiece;
