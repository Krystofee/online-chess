declare type Coord = {
  x: number;
  y: number;
};

declare type BoardCoord = {
  x: number;
  y: number;
};

declare interface IChessGameStore extends Broadcaster {
  id: string;
  pieces: IPiece[];
  onMove: PieceColor;
  canMove: boolean;
  state: GameState;
  player: IPlayer;

  invertBoard: boolean;

  startGame: () => void;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];

  movePiece(piece: IPiece, coord: BoardCoord): void;
  moveSelectedPiece(coord: BoardCoord): void;

  isThreatened(coord: Coord, byColor: PieceColor): boolean;
  inCheck(color: PieceColor): boolean;

  applyTemporaryMove(move: Move);
  unapplyTemporaryMove();
}
