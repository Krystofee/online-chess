declare interface IChessBoard {
  pieces: IPiece[];
  invert: boolean;

  loadState(state: ServerGameState['board']): void;

  isThreatened(coord: Coord, byColor: PieceColor): boolean;
  inCheck(color: PieceColor): boolean;

  applyTemporaryMove(move: Move);
  unapplyTemporaryMove();

  copy(): IChessBoard;
}
