declare type Coord = {
  x: number;
  y: number;
};

declare type BoardCoord = {
  x: number;
  y: number;
};

declare interface IChessGameStore {
  deviceId: string;
  pieces: IPiece[];
  onMove: PieceColor;
  canMove: boolean;
  gameState: GameState;
  playerId: string | null;
  playerState: PlayerState;

  startGame: () => void;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];

  movePiece(piece: IPiece, coord: BoardCoord): void;
}
