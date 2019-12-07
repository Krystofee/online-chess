declare type Coord = {
  x: number;
  y: number;
};

declare type BoardCoord = {
  x: number;
  y: number;
};

declare interface IChessGameStore {
  id: string;
  deviceId: string;
  color: PieceColor | null;
  pieces: IPiece[];
  onMove: PieceColor;
  canMove: boolean;
  gameState: GameState;
  playerState: PlayerState;

  startGame: () => void;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];

  movePiece(piece: IPiece, coord: BoardCoord): void;
}
