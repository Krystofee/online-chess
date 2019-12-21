declare type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';

declare type PieceColor = 'W' | 'B';

declare type Move = {
  piece: IPiece;
  position: Coord;
  takes?: IPiece;
  nested?: Move;
};

declare interface IPiece {
  id: string;
  imageRef: Image | null;
  position: Coord;
  renderPosition: BoardCoord;
  color: PieceColor;
  type: PieceType;
  moveCount: number;

  move: (coord: Coord, force: boolean = false) => Move | null;
  render: () => void;

  possibleMoves: Move[];
  generatePossibleMoves: () => Move[];
  copy: (board: IChessBoard) => IPiece;
}
