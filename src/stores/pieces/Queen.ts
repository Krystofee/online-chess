import BasePiece from './BasePiece';
import { generateDiagonalMoves, generateStraightMoves } from '../helpers';

class Queen extends BasePiece implements IPiece {
  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'Q', color, position);
  }

  generatePossibleMoves: () => Move[] = () => {
    return generateDiagonalMoves(this, this.board.pieces).concat(generateStraightMoves(this, this.board.pieces));
  };
}

export default Queen;
