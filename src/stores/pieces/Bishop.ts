import { computed } from 'mobx';
import BasePiece from './BasePiece';
import { generateDiagonalMoves } from '../helpers';

class Bishop extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'B', color, position);
  }

  @computed get possibleMoves(): Move[] {
    return generateDiagonalMoves(this, this.game.pieces);
  }
}

export default Bishop;
