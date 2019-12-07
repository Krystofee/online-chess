import { observable, computed, action } from 'mobx';
import { uuid } from 'uuidv4';
import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { toBoardCoord, fromBoardCoord, getWebsocketMessage } from './helpers';

class ChessGameStore implements IChessGameStore {
  @observable id: string;
  @observable deviceId: string;
  @observable color: PieceColor | null = null;
  @observable gameState: GameState = 'WAITING';
  @observable playerState: PlayerState = 'INIT';
  @observable onMove: PieceColor = 'W';
  @observable canMove: boolean = false;
  @observable pieces: IPiece[];
  @observable selectedPiece: IPiece | null = null;
  @observable socket: WebSocket;
  @observable socketReady: boolean = false;

  constructor(id: string) {
    this.id = id;
    this.pieces = [];
    this.socket = new WebSocket(`ws://localhost:8765/${this.id}`);

    this.deviceId = uuid();
    const storedUserId = window.localStorage.getItem('user');
    if (storedUserId) {
      this.deviceId = storedUserId;
    } else {
      window.localStorage.setItem('user', this.deviceId);
    }

    this.socket.onopen = () => {
      this.socketReady = true;
      this.socket.send(getWebsocketMessage('IDENTIFY', { id: this.deviceId }));
    };

    this.socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data[0] === 'GAME_STATE') {
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
        if (payload.id === this.deviceId) {
          this.color = payload.color;
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

    this.socket.send(getWebsocketMessage('CONNECT', { id: this.deviceId }));
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
              ...(move.takes
                ? {
                    takes: {
                      ...move.takes.position,
                    },
                  }
                : undefined),
              nested: moveToObject(move.nested),
            }
          : null;

      this.socket.send(getWebsocketMessage('MOVE', moveToObject(move) as object));
      this.canMove = false;
    }
  };
}

export default ChessGameStore;
