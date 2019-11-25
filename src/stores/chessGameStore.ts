import { observable, computed, action } from 'mobx';
import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { toBoardCoord, fromBoardCoord } from './helpers';

export function getStartingPieces(game: IChessGameStore): IPiece[] {
  return [
    new Rook(game, 'B', { x: 1, y: 8 }),
    new Knight(game, 'B', { x: 2, y: 8 }),
    new Bishop(game, 'B', { x: 3, y: 8 }),
    new Queen(game, 'B', { x: 4, y: 8 }),
    new King(game, 'B', { x: 5, y: 8 }),
    new Bishop(game, 'B', { x: 6, y: 8 }),
    new Knight(game, 'B', { x: 7, y: 8 }),
    new Rook(game, 'B', { x: 8, y: 8 }),
    new Pawn(game, 'B', { x: 1, y: 7 }),
    new Pawn(game, 'B', { x: 2, y: 7 }),
    new Pawn(game, 'B', { x: 3, y: 7 }),
    new Pawn(game, 'B', { x: 4, y: 7 }),
    new Pawn(game, 'B', { x: 5, y: 7 }),
    new Pawn(game, 'B', { x: 6, y: 7 }),
    new Pawn(game, 'B', { x: 7, y: 7 }),
    new Pawn(game, 'B', { x: 8, y: 7 }),
    new Pawn(game, 'W', { x: 1, y: 2 }),
    new Pawn(game, 'W', { x: 2, y: 2 }),
    new Pawn(game, 'W', { x: 3, y: 2 }),
    new Pawn(game, 'W', { x: 4, y: 2 }),
    new Pawn(game, 'W', { x: 5, y: 2 }),
    new Pawn(game, 'W', { x: 6, y: 2 }),
    new Pawn(game, 'W', { x: 7, y: 2 }),
    new Pawn(game, 'W', { x: 8, y: 2 }),
    new Rook(game, 'W', { x: 1, y: 1 }),
    new Knight(game, 'W', { x: 2, y: 1 }),
    new Bishop(game, 'W', { x: 3, y: 1 }),
    new Queen(game, 'W', { x: 4, y: 1 }),
    new King(game, 'W', { x: 5, y: 1 }),
    new Bishop(game, 'W', { x: 6, y: 1 }),
    new Knight(game, 'W', { x: 7, y: 1 }),
    new Rook(game, 'W', { x: 8, y: 1 }),
  ];
}

class ChessGameStore implements IChessGameStore {
  @observable pieces: IPiece[];
  @observable selectedPiece: IPiece | null = null;

  constructor() {
    this.pieces = getStartingPieces(this);
  }

  @action selectPiece = (piece: IPiece) => {
    this.selectedPiece = piece;
  };

  @action unselectPiece = () => {
    this.selectedPiece = null;
  };

  @computed get possibleMoves() {
    if (!this.selectedPiece) return [];
    return this.selectedPiece.possibleMoves
      .filter(
        (coord) => coord.position.x >= 1 && coord.position.x <= 8 && coord.position.y >= 1 && coord.position.y <= 8,
      ) // filter only valid moves
      .map((item) => ({ ...item, position: toBoardCoord(item.position) }));
  }

  @action movePiece = (piece: IPiece, boardCoord: BoardCoord) => {
    const coord = fromBoardCoord(boardCoord);
    const move = piece.move(coord);
    if (move) {
      const takes = move.takes;
      if (takes) {
        console.log('Takes!', piece, 'x', takes);
        this.pieces = this.pieces.filter((item) => item.id !== takes.id);
      }
    }
  };
}

export default ChessGameStore;
