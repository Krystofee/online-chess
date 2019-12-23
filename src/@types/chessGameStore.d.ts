declare type Coord = {
  x: number;
  y: number;
};

declare type BoardCoord = {
  x: number;
  y: number;
};

declare type GameEndType = 'CHECKMATE' | 'TIME' | 'DRAW' | 'STALEMATE';

declare interface IChessGameStore extends Broadcaster {
  id: string;
  onMove: PieceColor;
  canMove: boolean;
  state: GameState;
  player: IPlayer;
  playersData: Players | null;
  board: IChessBoard;
  timer: IChessTimer;

  startGame: () => void;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];
  checkGameEnd: () => void;

  winner: PieceColor | null;
  endType: GameEndType | null;

  movePiece(piece: IPiece, coord: BoardCoord): void;
  moveSelectedPiece(coord: BoardCoord): void;
}
