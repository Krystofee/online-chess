import BasePiece from './BasePiece';

class Bishop extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'B', color, position);
  }
}

export default Bishop;
