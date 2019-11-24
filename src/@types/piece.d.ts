declare type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';

declare type PieceColor = 'W' | 'B';

declare interface IPiece {
  id: string;
  position: Coord;
  renderPosition: BoardCoord;
  color: PieceColor;
  type: PieceType;

  move: (coord: Coord) => boolean;
  moveBoardCoord: (coord: BoardCoord) => boolean;

  possibleMoves: Coord[];
}
