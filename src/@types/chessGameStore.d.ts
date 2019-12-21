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
  onMove: PieceColor;
  canMove: boolean;
  state: GameState;
  player: IPlayer;
  board: IChessBoard;

  startGame: () => void;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];

  movePiece(piece: IPiece, coord: BoardCoord): void;
  moveSelectedPiece(coord: BoardCoord): void;
}
