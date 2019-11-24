import BasePiece from './BasePiece';

class King extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'K', color, position);
  }
}

export default King;
