declare type Coord = {
  x: number;
  y: number;
};

declare type BoardCoord = {
  x: number;
  y: number;
};

declare interface IChessGameStore {
  pieces: IPiece[];
  onMove: PieceColor;

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Move[];

  movePiece(piece: IPiece, coord: BoardCoord): void;
}
