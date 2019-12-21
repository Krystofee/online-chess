import BasePiece from './BasePiece';
import { generateStraightMoves } from '../helpers';

class Rook extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'R', color, position);
  }

  generatePossibleMoves = () => {
    return generateStraightMoves(this, this.game.pieces);
  };
}

export default Rook;
