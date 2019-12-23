import { action, observable } from 'mobx';

import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { getInverseColor } from './helpers';

class ChessBoard implements IChessBoard {
  @observable pieces: IPiece[];

  reverseMove: Move | null = null;

  constructor(pieces: IPiece[] = []) {
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
      piece = new PieceClass(this, color, { x, y });
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
      .some((piece) => piece.generatePossibleMoves().find((move) => move.position.x === x && move.position.y === y));
  };

  inCheck = (color: PieceColor) => {
    const king = this.pieces.find((piece) => piece.type === 'K' && piece.color === color);
    if (king) {
      return this.isThreatened(king.position, getInverseColor(color));
    }
    return false;
  };

  isCheckMate = () => {
    if (this.pieces.filter((item) => item.color === 'W' && item.possibleMoves.length > 0).length === 0) return 'W';
    if (this.pieces.filter((item) => item.color === 'B' && item.possibleMoves.length > 0).length === 0) return 'B';
    return null;
  };

  applyTemporaryMove = (move: Move) => {
    const piece = this.pieces.find((item) => item.id === move.piece.id);
    const takes = move.takes;

    if (!piece) {
      throw Error('Piece not found!');
    }

    this.reverseMove = {
      position: piece.position,
      piece,
      takes: move.takes,
    };

    piece.position = move.position;
    if (takes) this.pieces = this.pieces.filter((item) => item.id !== takes.id);
  };

  unapplyTemporaryMove = () => {
    if (!this.reverseMove) return;

    const { position, piece, takes } = this.reverseMove;
    const movedPiece = this.pieces.find((item) => item.id === piece.id);

    if (!movedPiece) {
      throw Error('Piece not found!');
    }

    movedPiece.position = position;

    if (takes) {
      this.pieces.push(takes.copy(this));
    }

    this.reverseMove = null;
  };

  copy = () => {
    const board = new ChessBoard();
    board.pieces = this.pieces.map((piece) => piece.copy(board));
    return board;
  };
}

export default ChessBoard;
