import { observable, computed, action } from 'mobx';

import Rook from './pieces/Rook';
import Queen from './pieces/Queen';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import { toBoardCoord, fromBoardCoord, getWebsocketMessage, invertY } from './helpers';
import Player from './player';

class ChessGameStore implements IChessGameStore {
  @observable id: string;
  @observable state: GameState = 'WAITING';
  @observable onMove: PieceColor = 'W';
  @observable canMove: boolean = false;
  @observable pieces: IPiece[];
  @observable selectedPiece: IPiece | null = null;
  @observable player: IPlayer;

  @observable socket: WebSocket;
  @observable socketReady: boolean = false;

  constructor(id: string) {
    this.id = id;
    this.pieces = [];
    // this.socket = new WebSocket(`ws://pichess-backend.herokuapp.com/0.0.0.0/${this.id}`);
    this.socket = new WebSocket(`ws://localhost:9000/${this.id}`);

    this.player = new Player();
    this.socket.onopen = () => {
      this.socketReady = true;
      this.socket.send(getWebsocketMessage('IDENTIFY', { id: this.player.id }));
    };

    this.socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data[0] === 'GAME_STATE') {
        this.loadState(data[1] as ServerGameState);
      } else if (data[0] === 'PLAYER_STATE' && this.player) {
        this.player.loadState(data[1] as ServerPlayerState);
      }
    };
  }

  @action loadState = (state: ServerGameState) => {
    console.log('...game state', state);
    this.state = state.state;
    this.onMove = state.on_move;
    this.canMove = true;
    this.pieces = state.board.map((piece) =>
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

  @action startGame = () => {
    if (!this.socketReady) {
      return;
    }

    this.socket.send(getWebsocketMessage('CONNECT', { id: this.player.id }));
  };

  @action selectPiece = (piece: IPiece) => {
    this.unselectPiece();
    if (this.canMove && piece.color === this.onMove && this.player.color === piece.color) {
      this.selectedPiece = piece;
    }
  };

  @action unselectPiece = () => {
    this.selectedPiece = null;
  };

  @computed get invertBoard() {
    return this.player.color === 'W';
  }

  @computed get possibleMoves() {
    if (!this.selectedPiece) return [];
    return this.selectedPiece.possibleMoves
      .filter(
        (coord) => coord.position.x >= 1 && coord.position.x <= 8 && coord.position.y >= 1 && coord.position.y <= 8,
      ) // filter only valid moves
      .map((item) => ({
        ...item,
        position: this.invertBoard ? invertY(toBoardCoord(item.position)) : toBoardCoord(item.position),
      }));
  }

  @action moveSelectedPiece = (boardCoord: BoardCoord) => {
    if (this.selectedPiece) this.movePiece(this.selectedPiece, boardCoord);
  };

  @action movePiece = (piece: IPiece, boardCoord: BoardCoord) => {
    if (!this.canMove || this.onMove !== piece.color || this.player.color !== piece.color) return;

    console.log('move', this.player.color, this.onMove);

    const move = piece.move(fromBoardCoord(this.invertBoard ? invertY(boardCoord) : boardCoord));
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
              piece: move.piece.id,
              x: move.position.x,
              y: move.position.y,
              ...(move.takes
                ? {
                    takes: move.takes.id,
                  }
                : undefined),
              nested: moveToObject(move.nested),
            }
          : null;

      this.socket.send(getWebsocketMessage('MOVE', moveToObject(move) as object));
      this.canMove = false;
      this.unselectPiece();
    }
  };
}

export default ChessGameStore;
