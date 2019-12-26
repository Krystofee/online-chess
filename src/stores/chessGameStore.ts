import { observable, computed, action } from 'mobx';

import { toBoardCoord, fromBoardCoord, getWebsocketMessage, invertY, getInverseColor } from './helpers';
import Player from './player';
import ChessBoard from './chessBoard';
import configStore from './configStore';
import GameTimer from './GameTimer';
import PlayerData from './playerData';
import sounds from './sounds';

class ChessGameStore implements IChessGameStore {
  @observable id: string;
  @observable state: GameState = 'WAITING';
  @observable onMove: PieceColor = 'W';
  @observable canMove: boolean = false;
  @observable selectedPiece: IPiece | null = null;
  @observable player: IPlayer;
  @observable playersData: { W: IPlayerData; B: IPlayerData };
  @observable board: IChessBoard;

  @observable winner: PieceColor | null = null;
  @observable endType: GameEndType | null = null;

  @observable socket: WebSocket;
  @observable socketReady: boolean = false;

  timer: IChessTimer;

  constructor(id: string, total_length?: string, per_move?: string) {
    this.id = id;
    this.socket = new WebSocket(configStore.websocketUrl.replace('{id}', this.id));
    this.player = new Player(this.id);
    this.playersData = { W: new PlayerData('W'), B: new PlayerData('B') };
    this.board = new ChessBoard([]);
    this.socket.onopen = () => {
      this.socketReady = true;
      this.socket.send(getWebsocketMessage('IDENTIFY', { id: this.player.id }));
      if (total_length !== undefined && per_move !== undefined) {
        this.socket.send(getWebsocketMessage('SETTING', { total_length, per_move }));
      }
    };
    this.timer = new GameTimer(this);

    this.socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data[0] === 'GAME_STATE') {
        this.loadState(data[1] as ServerGameState);
      } else if (data[0] === 'PLAYER_STATE' && this.player) {
        this.player.loadState(data[1] as ServerPlayerState);
      } else if (data[0] === 'TIMER') {
        this.timer.loadState(data[1] as ServerTimer);
      }
    };
  }

  @action loadState = (state: ServerGameState) => {
    if (this.state === 'WAITING' && state.state === 'PLAYING') {
      this.onGameStart();
    }

    this.state = state.state;
    this.onMove = state.on_move;
    this.canMove = true;
    this.board.loadState(state.board);
    state.players.map((data) => {
      this.playersData[data.color].loadState(data);
    });
    this.winner = state.winner;

    // TODO: let backend decide everything...
    if (!this.winner) {
      this.checkGameEnd();
    }
  };

  @action onGameStart = () => {
    sounds.playStart();
  };

  @action checkGameEnd = () => {
    const loser = this.board.isCheckMate();
    if (loser) {
      this.state = 'ENDED';
      this.winner = getInverseColor(loser);
      this.socket.close();
    }
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

  @computed get shouldInvertBoard() {
    return this.player.color === 'W';
  }

  @computed get possibleMoves() {
    if (!this.selectedPiece) return [];
    return this.selectedPiece.possibleMoves.map((item) => ({
      ...item,
      position: configStore.invert ? invertY(toBoardCoord(item.position)) : toBoardCoord(item.position),
    }));
  }

  @action moveSelectedPiece = (boardCoord: BoardCoord) => {
    if (this.selectedPiece) this.movePiece(this.selectedPiece, boardCoord);
  };

  @action movePiece = (piece: IPiece, boardCoord: BoardCoord) => {
    if (!this.canMove || this.onMove !== piece.color || this.player.color !== piece.color) return;

    const move = piece.move(fromBoardCoord(configStore.invert ? invertY(boardCoord) : boardCoord));
    if (move) {
      const takes = move.takes;
      if (takes) {
        this.board.pieces = this.board.pieces.filter((item) => item.id !== takes.id);
      }

      const nested = move.nested;
      if (nested) {
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

      sounds.playMove();
    }
  };
}

export default ChessGameStore;
