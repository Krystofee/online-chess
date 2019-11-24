import { computed, observable } from 'mobx';
import BasePiece from './BasePiece';

class Pawn extends BasePiece implements IPiece {
  @observable direction: number;

  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'P', color, position);
    this.direction = color === 'B' ? -1 : 1;
  }

  @computed get possibleMoves() {
    const moves = [
      {
        x: 0,
        y: 1,
      },
      ...(!this.hasMoved
        ? [
            {
              x: 0,
              y: 2,
            },
          ]
        : []),
    ];

    return moves.map(({ x, y }) => ({
      x: this.position.x + x,
      y: this.position.y + y * this.direction,
    }));
  }
}

export default Pawn;
