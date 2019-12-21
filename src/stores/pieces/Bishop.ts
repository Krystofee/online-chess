import BasePiece from './BasePiece';
import { generateDiagonalMoves } from '../helpers';

class Bishop extends BasePiece implements IPiece {
  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'B', color, position);
  }

  generatePossibleMoves = () => {
    return generateDiagonalMoves(this, this.board.pieces);
  };
}

export default Bishop;
