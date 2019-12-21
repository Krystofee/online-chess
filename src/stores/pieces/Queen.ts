import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class Queen extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'Q', color, position);
  }

  generatePossibleMoves = () => {
    return generateDiagonalMoves(this, this.game.board.pieces).concat(
      generateStraightMoves(this, this.game.board.pieces),
    );
  };
}

export default Queen;
