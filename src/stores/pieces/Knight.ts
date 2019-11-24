import BasePiece from './BasePiece';

class Knight extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'N', color, position);
  }
}

export default Knight;
