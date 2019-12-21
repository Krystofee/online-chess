import BasePiece from './BasePiece';
import { generateOffsetMoves } from '../helpers';

class Knight extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'N', color, position);
  }

  generatePossibleMoves = () => {
    return generateOffsetMoves(
      this,
      this.game.board.pieces,
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
