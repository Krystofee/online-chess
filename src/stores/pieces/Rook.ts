import BasePiece from './BasePiece';
import { generateStraightMoves } from '../helpers';

class Rook extends BasePiece implements IPiece {
  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'R', color, position);
  }

  generatePossibleMoves = () => {
    return generateStraightMoves(this, this.board.pieces);
  };
}

export default Rook;
