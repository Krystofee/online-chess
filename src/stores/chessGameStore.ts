import { observable, computed, action } from 'mobx';
import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { toBoardCoord, fromBoardCoord, getWebsocketMessage } from './helpers';

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
  @observable color: PieceColor | null = null;
  @observable gameState: GameState = 'WAITING';
  @observable playerId: string | null = null;
  @observable playerState: PlayerState = 'INIT';
  @observable onMove: PieceColor = 'W';
  @observable canMove: boolean = false;
  @observable pieces: IPiece[];
  @observable selectedPiece: IPiece | null = null;
  @observable socket: WebSocket;
  @observable socketReady: boolean = false;

  constructor() {
    this.pieces = getStartingPieces(this);
    this.socket = new WebSocket('ws://localhost:8765');

    this.socket.onopen = () => {
      this.socketReady = true;
    };

    this.socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data[0] === 'PRE_GAME') {
        const payload = data[1] as ServerPreGame;
        this.color = payload.color;
        this.playerId = payload.id;
      } else if (data[0] === 'GAME_STATE') {
        console.log('...game state', data[1]);
        const payload = data[1] as ServerGameState;
        this.gameState = payload.state;
        this.onMove = payload.on_move;
        this.canMove = true;
        this.pieces = payload.board.map((piece) =>
          this.updatePiece(piece.id, piece.color, piece.type, piece.x, piece.y),
        );
        console.log('... Started game', payload);
      } else if (data[0] === 'PLAYER_STATE') {
        console.log('...player state', data[1]);
        const payload = data[1] as ServerPlayerState;
        if (payload.id === this.playerId) {
          this.playerState = payload.state;
        }
      }
    };
  }

  @action updatePiece = (id: string, color: PieceColor, type: PieceType, x: number, y: number) => {
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

    piece.render();

    return piece;
  };

  @action startGame = () => {
    if (!this.socketReady) {
      return;
    }

    this.socket.send(getWebsocketMessage('CONNECT', { color: this.color }));
  };

  @action selectPiece = (piece: IPiece) => {
    if (this.canMove && piece.color === this.onMove) {
      this.selectedPiece = piece;
    }
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
    if (this.canMove && this.onMove !== piece.color) return;

    const previousPosition = piece.position;
    const move = piece.move(fromBoardCoord(boardCoord));
    if (move) {
      const takes = move.takes;
      if (takes) {
        console.log('Takes!', piece, 'x', takes);
        this.pieces = this.pieces.filter((item) => item.id !== takes.id);
      }

      const nested = move.nested;
      if (nested) {
        console.log('...move nested', nested);
        nested.piece.move(nested.position, true);
      }

      const moveToObject: (move?: Move) => object | null = (move?: Move) =>
        move
          ? {
              from: {
                x: previousPosition.x,
                y: previousPosition.y,
              },
              to: {
                x: move.position.x,
                y: move.position.y,
              },
              nested: moveToObject(move.nested),
            }
          : null;

      this.socket.send(getWebsocketMessage('MOVE', moveToObject(move) as object));
      this.canMove = false;
    }
  };
}

export default ChessGameStore;
