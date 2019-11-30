import Konva from 'konva';
import { computed, action, observable } from 'mobx';
import { uuid } from 'uuidv4';
import { toBoardCoord, findMove } from '../helpers';

class BasePiece implements IPiece {
  id: string;
  imageRef: Konva.Image | null = null;
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

  // eslint-disable-next-line class-methods-use-this
  @computed get possibleMoves() {
    return [] as Move[];
  }

  @computed get hasMoved() {
    return this.moveCount > 0;
  }
}

export default BasePiece;
