import BasePiece from './BasePiece';
import { generateOffsetMoves } from '../helpers';

class Knight extends BasePiece implements IPiece {
  constructor(board: IChessBoard, color: PieceColor, position: Coord) {
    super(board, 'N', color, position);
  }

  generatePossibleMoves: () => Move[] = () => {
    return generateOffsetMoves(
      this,
      this.board.pieces,
      [
        { x: 1, y: 2 },
        { x: -1, y: 2 },
        { x: 2, y: 1 },
        { x: -2, y: 1 },
        { x: 1, y: -2 },
        { x: -1, y: -2 },
        { x: 2, y: -1 },
        { x: -2, y: -1 },
      ],
      false,
    );
  };
}

export default Knight;
