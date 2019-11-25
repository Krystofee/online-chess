import { computed } from 'mobx';
import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class King extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'K', color, position);
  }

  @computed get possibleMoves(): Move[] {
    return generateDiagonalMoves(this, this.game.pieces, false).concat(
      generateStraightMoves(this, this.game.pieces, false),
    );
  }
}

export default King;
