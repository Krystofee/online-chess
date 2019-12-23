declare interface IChessBoard {
  pieces: IPiece[];

  loadState(state: ServerGameState['board']): void;

  isThreatened(coord: Coord, byColor: PieceColor): boolean;
  inCheck(color: PieceColor): boolean;

  applyTemporaryMove(move: Move);
  unapplyTemporaryMove();

  copy(): IChessBoard;
}
