import BasePiece from './BasePiece';
import { generateDiagonalMoves } from '../helpers';

class Bishop extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'B', color, position);
  }

  generatePossibleMoves = () => {
    return generateDiagonalMoves(this, this.game.board.pieces);
  };
}

export default Bishop;
