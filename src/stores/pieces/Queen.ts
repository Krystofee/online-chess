import BasePiece from './BasePiece';

class Queen extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'Q', color, position);
  }
}

export default Queen;
