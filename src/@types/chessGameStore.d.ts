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

  selectPiece: (piece: Piece) => void;
  unselectPiece: () => void;
  possibleMoves: Coord[];
}
