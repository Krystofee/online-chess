import { action, observable } from 'mobx';

import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { getInverseColor } from './helpers';

class ChessBoard implements IChessBoard {
  @observable game: IChessGameStore;
  @observable pieces: IPiece[];

  temporaryMove: Move | null = null;

  constructor(game: IChessGameStore, pieces: IPiece[] = []) {
    this.game = game;
    this.pieces = pieces;
  }

  @action loadState = (pieces: ServerGameState['board']) => {
    this.pieces = pieces.map((piece) =>
      this.updatePiece(piece.id, piece.color, piece.type, piece.x, piece.y, piece.move_count),
    );
  };

  @action updatePiece = (id: string, color: PieceColor, type: PieceType, x: number, y: number, moveCount: number) => {
    let piece = this.pieces.find((item) => item.id === id);

    const getPieceClass = (pieceType: PieceType) => {
      switch (pieceType) {
        case 'B':
          return Bishop;
        case 'N':
          return Knight;
        case 'R':
          return Rook;
        case 'Q':
          return Queen;
        case 'K':
          return King;
        default:
          return Pawn;
      }
    };

    if (!piece) {
      const PieceClass = getPieceClass(type);
      piece = new PieceClass(this.game, color, { x, y });
    }

    piece.id = id;
    piece.position = { x, y };
    piece.color = color;
    piece.type = type;
    piece.moveCount = moveCount;

    piece.render();

    return piece;
  };

  isThreatened = ({ x, y }: Coord, byColor: PieceColor) => {
    return this.pieces
      .filter((item) => item.color === byColor)
      .some((piece) => piece.possibleMoves.find((move) => move.position.x === x && move.position.y === y));
  };

  inCheck = (color: PieceColor) => {
    const king = this.pieces.find((piece) => piece.type === 'K' && piece.color === color);
    if (king) {
      return this.isThreatened(king.position, getInverseColor(color));
    }
    return false;
  };

  applyTemporaryMove = (move: Move) => {
    this.temporaryMove = move;
  };

  unapplyTemporaryMove = () => {
    this.temporaryMove = null;
  };
}

export default ChessBoard;
