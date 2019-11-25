import { computed } from 'mobx';
import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class Queen extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'Q', color, position);
  }

  @computed get possibleMoves(): Move[] {
    return generateDiagonalMoves(this, this.game.pieces).concat(generateStraightMoves(this, this.game.pieces));
  }
}

export default Queen;
