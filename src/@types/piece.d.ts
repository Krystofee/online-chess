declare type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';

declare type PieceColor = 'W' | 'B';

declare interface IPiece {
  id: string;
  position: Coord;
  renderPosition: BoardCoord;
  color: PieceColor;
  type: PieceType;

  move: (coord: Coord) => void;
  moveBoardCoord: (coord: BoardCoord) => void;

  possibleMoves: Coord[];
}
