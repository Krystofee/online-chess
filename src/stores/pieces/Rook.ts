import BasePiece from './BasePiece';

class Rook extends BasePiece implements IPiece {
  constructor(gameStore: IChessGameStore, color: PieceColor, position: Coord) {
    super(gameStore, 'R', color, position);
  }
}

export default Rook;
